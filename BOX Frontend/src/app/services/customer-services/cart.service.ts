import { Injectable } from '@angular/core';
import { Cart } from '../../shared/customer-interfaces/cart';
import { FixedProductVM } from '../../shared/fixed-product-vm';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //!!!!!!!PRICES IN CART ARE VAT EXCLUSIVE!!!!!!!
  //BULK DISCOUNTS ARE NOT ACCOUNTED FOR IN CART SERVICE
  cart: Cart[] = [];

  constructor() {
    this.loadCartItems();
   }

  loadCartItems() {
    //Retrieve cart list from local storage; if there's nothing in cart, return empty array
    this.cart = JSON.parse(localStorage.getItem("MegaPack-cart") || "[]");
    console.log('cart', this.cart);
  }

  getCartItems(): Cart[] {
    return this.cart;
  }

  emptyCart() {
    this.cart = [];
    this.saveCart();
  }

  saveCart() {
    //store updated cart in local storage
    localStorage.setItem("MegaPack-cart", JSON.stringify(this.cart));
  }

  //excluding VAT and bulk discounts
  getCartTotal(): number {
    let cartTotal = 0;

    this.cart.forEach(cartItem => {
      cartTotal += cartItem.fixedProduct.price * cartItem.quantity;
    });

    return cartTotal;
  }
}
