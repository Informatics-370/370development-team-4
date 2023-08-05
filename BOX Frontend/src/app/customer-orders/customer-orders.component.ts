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
      let ordInformation: string = String('ORD' + this.orders[i].customerOrderID + ' ' +
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
}

class VATInclusiveOrder implements OrderVM {
  customerOrderID: number;
  userId: string;
  orderDeliveryScheduleID: number;
  date: string;
  deliveryPhoto: string;
  customerFullName: string;
  orderStatusID: number;
  orderStatusDescription: string;
  orderTotalExcludingVAT: number; //total before negotiations or discount
  customerOrders: OrderLineVM[];
  vatPercentage: number; //whole number e.g. 25 for 25%
  total: number; //total before negotiations after discount
  totalDiscount: number; //total discount in rands before negotiations; customer loyalty discount + bulk discount
  negotiatedDiscount: number; //discount agreed on during negotiations
  checked!: boolean; //keep track of process order checkbox value

  constructor(order: OrderVM, vatPercentage: number, negotiatedDiscount?: number) {
    this.customerOrders = this.makePriceVATInclusive(order.customerOrders);
    this.vatPercentage = vatPercentage;
    this.customerOrderID = order.customerOrderID;
    this.orderStatusID = order.orderStatusID;
    this.orderStatusDescription = order.orderStatusDescription;
    this.orderDeliveryScheduleID = order.orderDeliveryScheduleID;
    this.date = order.date;
    this.deliveryPhoto = order.deliveryPhoto;
    this.userId = order.userId;
    this.orderTotalExcludingVAT = order.orderTotalExcludingVAT;
    this.customerFullName = order.customerFullName;
    this.negotiatedDiscount = negotiatedDiscount ? negotiatedDiscount : 0; //includes VAT
    this.total = this.getVATInclusiveAmount(this.orderTotalExcludingVAT);
    this.totalDiscount = this.getDiscount();

    if (this.orderStatusID == 1) { //if order has status of Placed, then it can be changed to In progress
      this.checked = false; //set checkbox value
    }
  }

  //this function takes the estimate lines and makes the product price vat inclusive
  makePriceVATInclusive(orderLines: OrderLineVM[]): OrderLineVM[] {
    let lines: OrderLineVM[] = [];

    orderLines.forEach(ordL => {
      ordL.fixedProductUnitPrice = this.getVATInclusiveAmount(ordL.fixedProductUnitPrice);
      ordL.customProductUnitPrice = this.getVATInclusiveAmount(ordL.customProductUnitPrice);

      lines.push(ordL);
    });

    return lines;
  }

  getVATInclusiveAmount(amount: number): number {
    let priceInclVAT = amount * (1 + this.vatPercentage / 100);
    return priceInclVAT;
  }

  getTotalBeforeDiscount(): number {
    let total = 0;
    this.customerOrders.forEach(line => {
      total += line.fixedProductUnitPrice * line.quantity;
    });

    return total;
  }

  getDiscount(): number {
    let totalBeforeDiscount = this.getTotalBeforeDiscount();
    let discount = totalBeforeDiscount - this.total;
    return discount;
  }
}
