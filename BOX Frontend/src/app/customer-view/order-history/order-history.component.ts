import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { AuthService } from '../../services/auth.service';
import { OrderVM } from '../../shared/order-vm';
import { OrderVMClass } from '../../shared/order-vm-class';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from '../../shared/custom-product-vm';
import { take, lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent {
  customerOrders: OrderVM[] = []; //hold orders from backend
  allCustomerOrders: OrderVMClass[] = []; //hold all orders
  filteredOrders: OrderVMClass[] = []; //orders to show user

  //messages to show user
  orderCount = -1;
  loading = true;
  error = false;

  //customer
  customerID = '';
  allVATs!: VAT[];
  fixedProducts: FixedProductVM[] = [];
  customProducts: CustomProductVM[] = [];
  searchTerm: string = '';
  /*Statuses:
  1 Placed
  2 In progress
  3 Cancelled
  4 Ready for delivery / collection
  5 Scheduled for delivery
  6 Out for delivery
  7 Completed
  */

  constructor(private dataService: DataService, private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    //get customer ID
    const token = localStorage.getItem('access_token')!;
    let id = this.authService.getUserIdFromToken(token);
    if (id) this.customerID = id;

    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getCustomProductsPromise = lastValueFrom(this.dataService.GetAllCustomProducts().pipe(take(1)));
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allVAT, allFixedProducts, allCustomProducts] = await Promise.all([
        getVATPromise,
        getFixedProductsPromise,
        getCustomProductsPromise
      ]);

      //put results from DB in global arrays
      this.fixedProducts = allFixedProducts;
      console.log('All fixed products', this.fixedProducts);
      this.customProducts = allCustomProducts;
      console.log('All custom products', this.customProducts);
      this.allVATs = allVAT;

      await this.getCustomerOrdersPromise();
    } catch (error) {
      this.loading = false;
      this.orderCount = -1;
      this.error = true;
      console.error('An error occurred:', error);
    }
  }

  //separate functionality of getting orders so I can call it separately whenever an order is cancelled
  async getCustomerOrdersPromise() {
    this.loading = true;
    try {
      this.customerOrders = await lastValueFrom(this.dataService.GetOrdersByCustomer(this.customerID).pipe(take(1)));
      console.log('customer orders', this.customerOrders);
      this.displayCustomerOrders() //Execute only after data has been retrieved from the DB otherwise error
    } catch (error) {
      this.loading = false;
      this.orderCount = -1;
      this.error = true;
      console.error('An error occurred while retrieving orders: ', error);
    }
  }

  displayCustomerOrders() {
    this.filteredOrders = []; //empty array
    this.allCustomerOrders = [];

    this.customerOrders.forEach(order => {
      //create array that holds product photo
      let orderLines: any[] = [];
      order.orderLines.forEach(line => {
        let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product
        let fixedProduct: FixedProductVM | undefined;
        let customProduct: CustomProductVM | undefined;

        if (isFixedProduct) {
          fixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        }
        else {
          customProduct = this.customProducts.find(prod => prod.customProductID == line.customProductID);
        }

        let orderLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? fixedProduct?.fixedProductID : customProduct?.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription,
          productFileB64: isFixedProduct ? fixedProduct?.productPhotoB64 : customProduct?.label,
          confirmedUnitPrice: line.confirmedUnitPrice,
          quantity: line.quantity,
          statusID: line.orderLineStatusID,
          statusDescription: line.orderLineStatusDescription
        }

        orderLines.push(orderLine);
      });

      let applicableVAT = this.getApplicableVAT(order.date); //get vat applicable to that date
      let orderClass: OrderVMClass = new OrderVMClass(order, orderLines, applicableVAT);
      this.filteredOrders.push(orderClass);
    });

    this.allCustomerOrders = this.filteredOrders; //store all the orders someplace before I search below
    this.orderCount = this.filteredOrders.length; //update the number of orders
    this.loading = false;
  }

  getApplicableVAT(date: Date): VAT {
    for (let i = this.allVATs.length - 1; i >= 0; i--) {
      if (date >= this.allVATs[i].date) {
        return this.allVATs[i];
      }
    }

    return this.allVATs[this.allVATs.length - 1]; // Fallback to the latest VAT if no applicable VAT is found
  }

  /*SEARCH*/
  searchOrders(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredOrders = []; //clear array
    for (let i = 0; i < this.allCustomerOrders.length; i++) {
      //concatenate all the searchable info in one variable
      let toSearch: string = String(this.allCustomerOrders[i].customerOrderID + ' ' +
        this.allCustomerOrders[i].orderStatusDescription).toLowerCase();

      if (toSearch.includes(this.searchTerm.toLowerCase())) {
        this.filteredOrders.push(this.allCustomerOrders[i]);
      }
    }

    this.orderCount = this.filteredOrders.length; //update count
    console.log('Search results:', this.filteredOrders);
  }

  //------------------- CANCEL ORDER -------------------
  warnCustomer(orderId: number) {
    //notify them of how cancellation works and their deposit
    //warn user
    Swal.fire({
      icon: 'warning',
      title: "Are you sure?",
      html: `20% of every order is a deposit. This amount is <b>not refundable</b>`,
      confirmButtonColor: '#32AF99',
      confirmButtonText: 'Yes, cancel order!',
      showCancelButton: true,
      cancelButtonColor: '#E33131',
      cancelButtonText: 'Nevermind',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.cancelOrder(orderId);
      }
    });
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

  //------------------- REVIEW ORDER -------------------
  reviewOrder(code: string) {
    this.router.navigate(['review-order/' + code]);
  }
}
