import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { OrderVM } from "../shared/order-vm";
import { OrderLineVM } from '../shared/order-line-vm';
import { VAT } from '../shared/vat';

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
  //forms logic
  //processOrdersForm: FormGroup;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) { }

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
      console.log(allOrders);
      this.filteredOrders = [];

      allOrders.forEach((ord: OrderVM) => {
        let theOrder: VATInclusiveOrder = new VATInclusiveOrder(ord, this.vat.percentage);
        this.filteredOrders.push(theOrder);
      });

      this.orders = this.filteredOrders; //store all the orders someplace before I search below
      this.orderCount = this.filteredOrders.length; //update the number of orders

      console.log('All order array: ', this.filteredOrders);
      this.loading = false;

      return 'Successfully retrieved orders from the database';
    } catch (error) {
      console.error('An error occurred while retrieving orders: ' + error);
      throw new Error('An error occurred while retrieving orders: ' + error);
    }
  }
}

class VATInclusiveOrder implements OrderVM {
  customerOrderID: number;
  customerStatusID: number;
  userId: string;
  orderDeliveryScheduleID: number;
  date: string;
  deliveryPhoto: string;
  customerFullName: string;
  orderStatusDescription: string;
  customerOrders: OrderLineVM[];
  vatPercentage: number; //whole number e.g. 25 for 25%
  total: number; //total before negotiations after discount
  totalDiscount: number; //total discount in rands before negotiations; customer loyalty discount + bulk discount
  negotiatedDiscount: number; //discount agreed on during negotiations

  constructor(order: OrderVM, vatPercentage: number, negotiatedDiscount?: number) {
    this.customerOrders = this.makePriceVATInclusive(order.customerOrders);
    this.vatPercentage = vatPercentage;
    this.customerOrderID = order.customerOrderID;
    this.customerStatusID = order.customerStatusID;
    this.orderStatusDescription = order.orderStatusDescription;
    this.orderDeliveryScheduleID = order.orderDeliveryScheduleID;
    this.date = order.date;
    this.deliveryPhoto = order.deliveryPhoto;
    this.userId = order.userId;
    this.customerFullName = order.customerFullName;
    this.negotiatedDiscount = negotiatedDiscount ? negotiatedDiscount : 0; //includes VAT
    this.total = this.getTotalBeforeDiscount();
    this.totalDiscount = this.getDiscount();
  }

  //this function takes the estimate lines and makes the product price vat inclusive
  makePriceVATInclusive(orderLines: OrderLineVM[]): OrderLineVM[] {
    let lines: OrderLineVM[] = [];

    orderLines.forEach(ordL => {
      ordL.fixedProductUnitPrice = this.getVATInclusiveAmount(ordL.fixedProductUnitPrice);
      ordL.customProductUnitPrice = this.getVATInclusiveAmount(ordL.customProductUnitPrice);
      console.log(ordL.fixedProductUnitPrice, ordL.customProductUnitPrice)

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
