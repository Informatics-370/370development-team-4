import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { OrderVM } from "../shared/order-vm";
import { OrderLineVM } from '../shared/order-line-vm';
import { OrderVMClass } from '../shared/order-vm-class';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent {
  orders: OrderVMClass[] = []; //hold all orders
  filteredOrders: OrderVMClass[] = []; //orders to show user
  selectedOrder!: OrderVMClass; //specific order to show user
  allVATs: VAT[] = [];
  searchTerm: string = '';
  //display messages to user
  orderCount = -1;
  loading = true;
  error: boolean = false;
  isAnyCheckboxChecked = false; //is true if 1 of the process order checkboxes is ticked
  /*Statuses:
  1 Placed
  2 In progress
  3 Cancelled
  4 Ready for delivery
  5 Out for delivery
  6 Completed
  */

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getOrdersPromise = lastValueFrom(this.dataService.GetAllCustomerOrders().pipe(take(1)));

      const [allVAT, allOrders] = await Promise.all([
        getVATPromise,
        getOrdersPromise
      ]);

      //put results from DB in global arrays
      this.allVATs = allVAT;

      //put orders in order class
      this.filteredOrders = []; //empty array
      allOrders.forEach((order: OrderVM) => {
        let applicableVAT = this.getApplicableVAT(order.date); //get vat applicable to that date
        let orderClassObj = new OrderVMClass(order, order.orderLines, applicableVAT);
        this.filteredOrders.push(orderClassObj);
      });

      //sort orders by ID so later orders are first
      this.filteredOrders.sort((current, next) => {
        return next.customerOrderID - current.customerOrderID;
      });
  
      this.orders = this.filteredOrders; //store all the quote someplace before I search below
      this.orderCount = this.filteredOrders.length; //update the number of quotes
      this.loading = false;

    } catch (error) {
      this.orderCount = -1;
      this.loading = false;
      this.error = true;
      console.error('Error retrieving data:', error);
    }
  }

  getApplicableVAT(date: Date): VAT {
    for (let i = this.allVATs.length - 1; i >= 0; i--) {
      if (date >= this.allVATs[i].date) {
        return this.allVATs[i];
      }
    }

    return this.allVATs[this.allVATs.length - 1]; // Fallback to the latest VAT if no applicable VAT is found
  }

  /*------------------SEARCH ORDERS----------------------*/
  searchOrders(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredOrders = []; //clear array
    for (let i = 0; i < this.orders.length; i++) {
      //concatenate all the order info in one variable so user can search using any of them
      let ordInformation: string = String('CUSORDR' + this.orders[i].customerOrderID + ' ' +
        this.orders[i].customerFullName + ' ' +
        this.orders[i].orderStatusDescription).toLowerCase();

      if (ordInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredOrders.push(this.orders[i]);
      }
    }

    this.orderCount = this.filteredOrders.length; //update order count
    console.log('Search results:', this.filteredOrders);
  }

  /*--------------------PROCESS ORDERS----------------------------*/
  //disable/enable process button if one of the process order checkboxes was ticked/unticked
  checkboxChanged() {
    this.isAnyCheckboxChecked = this.filteredOrders.some(ord => ord.checked);
  }

  processOrders() {
    let ordersToProcess: number[] = []; //store IDs of all orders that will be processed

    this.filteredOrders.forEach(order => {
      //if the checkbox associated with that order is ticked, get the order ID so I can process the order
      if (order.checked) {
        ordersToProcess.push(order.customerOrderID);
      }
    });

    console.log('ordersToProcess', ordersToProcess);
    //process orders aka update status to In progress
    try {
      ordersToProcess.forEach(orderID => {
        //statusID 2 = 'In progress'
        this.dataService.UpdateOrderStatus(orderID, 2).subscribe((result) => {
          console.log("Result", result);
          this.getDataFromDB(); //refresh list
          this.isAnyCheckboxChecked = false;
        });
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  /*-------------------OPEN ORDER DETAILS MODAL--------------------*/
  async openViewOrderModal(id: number) {
    //get order to show details of
    let theOrder = await lastValueFrom(this.dataService.GetOrder(id).pipe(take(1)));
    let applicableVAT = this.getApplicableVAT(theOrder.date); //get vat applicable to that date
    this.selectedOrder = new OrderVMClass(theOrder, theOrder.orderLines, applicableVAT);
    console.log('Order before showing', this.selectedOrder);
    $('#viewOrder').modal('show');
  }
}