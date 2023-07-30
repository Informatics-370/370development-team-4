import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { CartService } from '../../services/customer-services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Route, Router } from '@angular/router';
import { OrderVM } from '../../shared/order-vm';
import { OrderLineVM } from '../../shared/order-line-vm';
declare var $: any;

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  /*Statuses:
  1 Placed
  2 In progress
  3 Cancelled
  4 Ready for delivery
  5 Out for delivery
  6 Completed
  */

  cart: Cart[] = [];
  cartTotal = 0;
  totalBeforeDiscount = 0;
  randomDiscount = 0;
  tab = 1;
  creditAllowed = true;
  creditBalanceDate: Date = new Date(Date.now());
  creditBalanceDue = '';
  progress = 0;
  placedOrder!: OrderVM;
  //forms logic
  placeOrderForm: FormGroup;

  constructor(private router: Router, private dataService: DataService, private cartService: CartService, private formBuilder: FormBuilder) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['Pick up', Validators.required],
      shippingAddress: ['123 Fake Road, Pretoria North', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
    });
  }

  ngOnInit() {
    this.getDataFromDB();
    this.randomDiscount = Math.floor(Math.random() * 10 + 1);
    this.cart = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
    console.log(this.randomDiscount, this.cartTotal);
    this.checkCredit();
    this.getCreditDueDate();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getDiscountPromise = lastValueFrom(this.dataService.GetDiscounts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allVAT, allDiscounts] = await Promise.all([
        getVATPromise,
        getDiscountPromise
      ]);

      //put results from DB in global arrays
      let vat = allVAT[0];
      let discountList = allDiscounts;

      this.cartService.setGlobalVariables(discountList, vat);
      this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
      this.totalBeforeDiscount = this.cartService.getCartTotalBeforeDiscount();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //check if user is approved for credit and sufficient credit left to place this order
  checkCredit() {

  }

  changeTab(direction: string) {
    if (direction == 'next') this.tab++;
    else this.tab--;


    switch (this.tab) {
      case 0 || 1:
        this.tab = 1;
        this.progress = 0;
        break;

      case 2:
        this.progress = 33;
        break;

      case 3 || 4:
        this.progress = 66;
        break;

      /* case 4 || 5:
        this.tab = 4;
        this.progress = 100;
        break; */

      default:
        this.tab = 1;
        this.progress = 0;
        break;
    }

    console.log(this.tab + ' ' + this.progress);
    //update progress bar
    $('#bar').css('width', this.progress + '%');
  }

  getCreditDueDate() {
    let dueDate = this.creditBalanceDate.setDate(this.creditBalanceDate.getDate() + 30);
    console.log(dueDate);
    let newDate = new Date(dueDate);
    this.creditBalanceDue = newDate.toLocaleDateString('za');
  }

  /*-------------PLACE ORDER------------ */
  placeOrder() {
    //create order lines for each cart item
    let orderLines: OrderLineVM[] = [];
    this.cart.forEach(cartItem => {
      let ol: OrderLineVM = {
        customerOrderLineID: 0,
        customerOrderID: 0,
        fixedProductID: cartItem.fixedProduct.fixedProductID,
        fixedProductDescription: '',
        fixedProductUnitPrice: 0,
        customProductID: 0,
        customProductDescription: '',
        customProductUnitPrice: 0,
        quantity: cartItem.quantity,
        customerRefundID: 0
      }

      orderLines.push(ol);
    });

    //create order vm for order
    let now = new Date(Date.now());
    let dateInCorrectFormat = now.toLocaleString("za", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    console.log(dateInCorrectFormat);
    let newOrder: OrderVM = {
      customerID: 1,
      customerOrderID: 0,
      customerStatusID: 0,
      orderDeliveryScheduleID: 0,
      date: '',
      deliveryPhoto: '',
      customerFullName: '',
      orderStatusDescription: '',
      customerOrders: orderLines
    };

    console.log('order before posting', newOrder);

    try {
      //post to backend
      this.dataService.AddCustomerOrder(newOrder).subscribe((result) => {
        this.placedOrder = result;
        this.cartService.emptyCart(); //clear cart
        this.router.navigate(['/order-history']); //redirect to order history page
        //this.changeTab('next'); //go to success tab
      });
    } catch (error) {
      console.error('Error submitting order: ', error);
    }
  }

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
