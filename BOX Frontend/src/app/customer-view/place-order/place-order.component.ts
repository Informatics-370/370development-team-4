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

  cartTotal = 0;
  randomDiscount = 0;
  tab = 1;
  creditAllowed = false;
  creditBalanceDue!: Date;
  progress = 33;
  //forms logic
  placeOrderForm: FormGroup;

  constructor(private dataService: DataService, private cartService: CartService, private formBuilder: FormBuilder) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['pick up', Validators.required],
      shippingAddress: ['', Validators.required],
      paymentType: ['immediately', Validators.required],
    });
  }

  ngOnInit() {
    this.randomDiscount = Math.floor(Math.random() * 10 + 1);
    this.cartTotal = this.cartService.getCartTotal(this.randomDiscount);
    console.log(this.randomDiscount, this.cartTotal);
    this.checkCredit();
  }

  //check if user is approved for credit and sufficient credit left to place this order
  checkCredit() {

  }

  nextTab() {
    if (this.tab < 3) {
      this.tab++;
      this.progress += 33;
    }
    else if (this.tab == 3) {
      this.tab = 3;
      this.progress = 100;
    }

    let progressBar = document.getElementById('bar');
    if (progressBar) progressBar.style.width = progressBar + '%';
  }

  previousTab() {
    if (this.tab > 0) {
      this.tab--;
      this.progress -= 33;
    }
    else if (this.tab == 0) {
      this.tab = 0;
      this.progress = 0;
    }

    let progressBar = document.getElementById('bar');
    if (progressBar) progressBar.style.width = progressBar + '%';
  }

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
