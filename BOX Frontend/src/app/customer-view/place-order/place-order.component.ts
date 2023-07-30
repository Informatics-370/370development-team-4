import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { CartService } from '../../services/customer-services/cart.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from '../../shared/item';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Discount } from '../../shared/discount';
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
  creditBalanceDue!: Date;
  progress = 0;
  //forms logic
  placeOrderForm: FormGroup;

  constructor(private dataService: DataService, private cartService: CartService, private formBuilder: FormBuilder) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['pick up', Validators.required],
      shippingAddress: ['123 Fake Road, Pretoria North', Validators.required],
      paymentType: ['immediately', Validators.required],
    });
  }

  ngOnInit() {
    this.getDataFromDB();
    this.randomDiscount = Math.floor(Math.random() * 10 + 1);
    this.cart = this.cartService.getCartItems();
    this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
    console.log(this.randomDiscount, this.cartTotal);
    this.checkCredit();
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
    
    
    switch(this.tab) {
      case 0 || 1:
        this.tab = 1;
        this.progress = 0;
        break;

      case 2:
        this.progress = 33;
        break;

      case 3:
        this.progress = 66;
        break;

      case 4 || 5:
        this.tab = 4;
        this.progress = 100;
        break;

      default:
        this.tab = 1;
        this.progress = 0;
        break;        
    }

    console.log(this.tab + ' ' + this.progress);
    //update progress bar
    $('#bar').css('width', this.progress + '%');
  }

  /* previousTab() {
    this.tab--;
    if (this.tab >= 1) {
      this.progress -= 33;
    }
    else if (this.tab < 1) {
      this.tab = 1;
      this.progress = 0;
    }

    let progressBar = document.getElementById('bar');
    console.log(this.progress)
    if (progressBar) progressBar.style.width = progressBar + '%';
  } */

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
