import { Injectable } from '@angular/core';
import { Cart } from '../../shared/customer-interfaces/cart';
import { FixedProductVM } from '../../shared/fixed-product-vm';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //!!!!!!!PRICES IN CART ARE VAT EXCLUSIVE!!!!!!!
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

  //excluding VAT
  //please pass discount parameters as whole numbers e.g. 25 for 25%
  getCartTotal(bulkDiscountWholeNumber : number, customerDiscountWholeNumber : number): number {
    let cartTotal = 0;

    this.cart.forEach(cartItem => {
      cartTotal += cartItem.fixedProduct.price * cartItem.quantity;
    });

    //add discount
    let totalDiscountInRand = (bulkDiscountWholeNumber + customerDiscountWholeNumber) / 100 * cartTotal;
    cartTotal = cartTotal - totalDiscountInRand;

    return cartTotal;
  }
}
