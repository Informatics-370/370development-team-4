import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { OrderVM } from "../shared/order-vm";
import { OrderLineVM } from '../shared/order-line-vm';
import { VAT } from '../shared/vat';
import { event } from 'jquery';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.component.html',
  styleUrls: ['./customer-orders.component.css']
})
export class CustomerOrdersComponent {
  orders: VATInclusiveOrder[] = []; //hold all orders
  filteredOrders: VATInclusiveOrder[] = []; //orders to show user
  selectedOrder!: VATInclusiveOrder; //specific order to show user
  vat!: VAT;
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

      const [allVAT] = await Promise.all([
        getVATPromise
      ]);

      //put results from DB in global arrays
      this.vat = allVAT[0];

      await this.getOrdersPromise();
    } catch (error) {
      this.orderCount = -1;
      this.loading = false;
      this.error = true;
    }
  }

  async getOrdersPromise(): Promise<any> {
    try {
      let allOrders: OrderVM[] = await lastValueFrom(this.dataService.GetAllCustomerOrders().pipe(take(1)));
      this.filteredOrders = [];

      allOrders.forEach((ord: OrderVM) => {
        let theOrder: VATInclusiveOrder = new VATInclusiveOrder(ord, this.vat.percentage);
        this.filteredOrders.push(theOrder);
      });

      this.orders = this.filteredOrders; //store all the orders someplace before I search below
      this.orderCount = this.filteredOrders.length; //update the number of orders

      console.log('All order array: ', this.filteredOrders);
      this.loading = false; //stop showing loading message

      return 'Successfully retrieved orders from the database';
    } catch (error) {
      console.error('An error occurred while retrieving orders: ' + error);
      throw new Error('An error occurred while retrieving orders: ' + error);
    }
  }

  /*------------------SEARCH ORDERS----------------------*/
  searchOrders(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredOrders = []; //clear array
    for (let i = 0; i < this.orders.length; i++) {
      //concatenate all the order info in one variable so user can search using any of them
      let ordInformation: string = String('CUSORDR' + this.orders[i].customerOrderID + ' ' +
        this.orders[i].customerFullName + ' ' +
        this.orders[i].total + ' ' +
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
          this.getOrdersPromise(); //refresh list
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
    this.selectedOrder = new VATInclusiveOrder(theOrder, this.vat.percentage);
    console.log('Order before adding', this.selectedOrder);
    $('#viewOrder').modal('show');
  }
}

class VATInclusiveOrder {
  customerOrderID: number;
  userId: string;
  orderDeliveryScheduleID: number;
  date: Date;
  deliveryPhoto: string;
  customerFullName: string;
  orderStatusID: number;
  orderStatusDescription: string;
  orderTotalExcludingVAT: number; //total before negotiations or discount
  customerOrders: OrderLineVM[];
  vatPercentage: number; //whole number e.g. 25 for 25%
  totalVAT: number; //total VAT on this order
  total: number; //order total including VAT
  checked!: boolean; //keep track of process order checkbox value

  constructor(order: OrderVM, vatPercentage: number) {
    this.customerOrders = order.orderLines;
    this.orderTotalExcludingVAT = 0;
    this.vatPercentage = vatPercentage;
    this.customerOrderID = order.customerOrderID;
    this.orderStatusID = order.orderStatusID;
    this.orderStatusDescription = order.orderStatusDescription;
    this.orderDeliveryScheduleID = order.deliveryScheduleID;
    this.date = order.date;
    this.deliveryPhoto = order.deliveryPhoto;
    this.userId = order.customerId
    this.customerFullName = order.customerFullName;
    this.total = this.orderTotalExcludingVAT * (1 + vatPercentage/100);
    this.totalVAT = this.getTotalVAT();

    if (this.orderStatusID == 1) { //if order has status of Placed, then it can be changed to In progress
      this.checked = false; //set checkbox value
    }
  }

  getOrderTotalExcludingVAT(): number {
    let totalBeforeVAT = 0;
    this.customerOrders.forEach(ordLine => {
      totalBeforeVAT += ordLine.confirmedUnitPrice * ordLine.quantity;
    });

    return totalBeforeVAT;
  }
  
  getTotalVAT(): number {
    return this.orderTotalExcludingVAT * this.vatPercentage / 100;
  }
}
