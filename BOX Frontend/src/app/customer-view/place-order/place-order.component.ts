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
    //this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
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

      /* this.cartService.setGlobalVariables(discountList, vat);
      this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
      this.totalBeforeDiscount = this.cartService.getCartTotalBeforeDiscount(); */
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

    //update progress bar
    $('#bar').css('width', this.progress + '%');
  }

  getCreditDueDate() {
    let dueDate = this.creditBalanceDate.setDate(this.creditBalanceDate.getDate() + 30);
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
    //put date in correct format to post to DB
    let now = new Date(Date.now());
    const yyyy = now.getFullYear();
    let mm = String(now.getMonth() + 1); // month is zero-based
    let dd = now.getDate().toString();
    let hh = now.getHours().toString();
    let min = now.getMinutes().toString();
    
    if (parseInt(dd) < 10) dd = '0' + dd;
    if (parseInt(mm) < 10) mm = '0' + mm;
    if (parseInt(hh) < 10) hh = '0' + hh;
    if (parseInt(min) < 10) min = '0' + min;
    
    let dateInCorrectFormat = yyyy + '-' + mm + '-' + dd + ' ' + hh + ':' + min;
    console.log('dateInCorrectFormat', dateInCorrectFormat); // 2023-07-31 18:23
    let newOrder: OrderVM = {
      userId: 'd8aa46f8-c696-4206-88bb-2d932c0e0ad8',
      customerOrderID: 0,
      orderStatusID: 0,
      orderDeliveryScheduleID: 0,
      date: dateInCorrectFormat,
      deliveryPhoto: '',
      customerFullName: '',
      orderStatusDescription: '',
      orderTotalExcludingVAT: 0,
      customerOrders: orderLines
    };

    console.log('order before posting', newOrder);

    try {
      //post to backend
      this.dataService.AddCustomerOrder(newOrder).subscribe((result) => {
        this.placedOrder = result;
        this.cartService.emptyCart(); //clear cart
        this.router.navigate(['/order-history', 'success']); //redirect to order history page
        //this.changeTab('next'); //go to success tab
      });
    } catch (error) {
      console.error('Error submitting order: ', error);
    }
  }

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
