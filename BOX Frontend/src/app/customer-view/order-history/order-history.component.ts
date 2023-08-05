import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.services';
import { OrderVM } from '../../shared/order-vm';
import { OrderLineVM } from '../../shared/order-line-vm';
import { Discount } from '../../shared/discount';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  customerOrders: OrderVM[] = []; //hold orders from backend
  allCustomerOrders: OrderClass[] = []; //hold all orders
  filteredOrders: OrderClass[] = []; //orders to show user
  orderCount = -1;
  loading = true;
  customer = {
    ID: 1,
    fullName: 'John Doe',
    discount: 0.05
  }; //will retrieve from backend when users are up and running
  vat!: VAT;
  fixedProducts: FixedProductVM[] = [];
  discountList: Discount[] = [];
  searchTerm: string = '';
  success = false;
  /*Statuses:
  1 Placed
  2 In progress
  3 Cancelled
  4 Ready for delivery
  5 Out for delivery
  6 Completed
  */

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {    
    //Retrieve the item ID from url
    this.activatedRoute.paramMap.subscribe(params => {
      let successMsg = params.get('success');
      if (successMsg) {
        this.success = true;
        this.displaySuccessMessage();
      }
    });

    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getDiscountPromise = lastValueFrom(this.dataService.GetDiscounts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allVAT, allFixedProducts, allDiscounts] = await Promise.all([
        getVATPromise,
        getProductsPromise,
        getDiscountPromise
      ]);

      //put results from DB in global arrays
      this.fixedProducts = allFixedProducts;
      this.vat = allVAT[0];
      this.discountList = allDiscounts;

      await this.getCustomerOrdersPromise();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }  

  //separate functionality of getting orders so I can call it separately whenever an order is cancelled
  async getCustomerOrdersPromise() {
    this.loading = true;
    try {
      this.customerOrders = await lastValueFrom(this.dataService.GetOrdersByCustomer(this.customer.ID).pipe(take(1)));

      this.displayCustomerOrderes() //Execute only after data has been retrieved from the DB otherwise error

      return 'Successfully retrieved orders from the database';
    } catch (error) {
      console.log('An error occurred while retrieving orders: ' + error);
      throw new Error('An error occurred while retrieving orders: ' + error);
    }
  }

  displayCustomerOrderes() {
    this.filteredOrders = []; //empty array
    this.allCustomerOrders = [];

    this.customerOrders.forEach(ord => {
      //create array that holds product photo
      let orderLines: any[] = [];
      ord.customerOrders.forEach(line => {
        let product = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        let ol: any = {
          productDescription: line.fixedProductDescription,
          quantity: line.quantity,
          unitPrice: this.getVATInclusive(line.fixedProductUnitPrice),
          productImage: product ? product.productPhotoB64 : ''
        }
        
        orderLines.push(ol);
      });

      let order : OrderClass = new OrderClass(ord, orderLines)
      this.filteredOrders.push(order);
    });
    
    this.allCustomerOrders = this.filteredOrders; //store all the order someplace before I search below
    this.orderCount = this.filteredOrders.length; //update the number of orders

    console.log("All of customer " + this.customer.ID + "'s orders: ", this.filteredOrders);
    this.loading = false;
  }

  getVATInclusive(amount: number): number { 
    let priceInclVAT = amount * (1 + this.vat.percentage/100);
    return parseFloat(priceInclVAT.toFixed(2))
  }

  /*SEARCH*/
  searchOrders(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredOrders = []; //clear array
    for (let i = 0; i < this.allCustomerOrders.length; i++) {
      //concatenate all the searchable info in one variable
      let toSearch: string = String(this.allCustomerOrders[i].ID + this.allCustomerOrders[i].statusDescription).toLowerCase();

      if (toSearch.includes(this.searchTerm.toLowerCase())) {
        this.filteredOrders.push(this.allCustomerOrders[i]);
      }
    }

    this.orderCount = this.filteredOrders.length; //update count
    console.log('Search results:', this.filteredOrders);
  }

  cancelOrder(orderId: number) {
    try {
      //statusID 3 = 'Cancelled'
      this.dataService.UpdateOrderStatus(orderId, 3).subscribe((result) => {
        console.log("Result", result);
        this.getCustomerOrdersPromise(); //refresh list

        //update credit balance for credit customer; cash happens off system
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  displaySuccessMessage() {
    setTimeout(() => {
      this.success = false;
    }, 10000);
    return false
  }

}

class OrderClass {
  ID: number;
  statusID: number;
  statusDescription: string;
  deliveryScheduleID: number;
  date: string;
  deliveryPhoto: string;
  total: number; //total before negotiations after discount
  totalDiscount: number; //total discount in rands before negotiations; customer loyalty discount + bulk discount
  negotiatedDiscount: number; //discount agreed on during negotiations
  orderLines: any[]; //array holding product info incl pics

  constructor(order: OrderVM, orderLines: any[], negotiatedDiscount?: number) {
    this.orderLines = orderLines;
    this.ID = order.customerOrderID;
    this.statusID = order.customerStatusID;
    this.statusDescription = order.orderStatusDescription; 
    this.date = order.date;
    this.deliveryScheduleID = order.orderDeliveryScheduleID;
    this.deliveryPhoto = order.deliveryPhoto;   
    this.negotiatedDiscount = negotiatedDiscount ? negotiatedDiscount : 0; //includes VAT
    this.total = this.getTotalBeforeDiscount();
    this.totalDiscount = this.getDiscount();
  }

  getTotalBeforeDiscount(): number {
    let total = 0;
    this.orderLines.forEach(line => {
      total += line.unitPrice * line.quantity;
    });

    return total;
  }

  getDiscount(): number {
    let totalBeforeDiscount = this.getTotalBeforeDiscount();
    let discount = totalBeforeDiscount - this.total;
    return discount;
  }
}
