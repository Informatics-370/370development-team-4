import { Injectable } from '@angular/core';
import { DataService } from '../../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { Cart } from '../../shared/customer-interfaces/cart';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Discount } from '../../shared/discount';
import { VAT } from '../../shared/vat';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //!!!!!!!PRICES IN CART ARE VAT INCLUSIVE!!!!!!!
  cart: Cart[] = [];
  discountList: Discount[] = []; //list of all discounts
  applicableDiscount: Discount | null = null;
  vat!: VAT;

  constructor(private dataService: DataService) {
    this.loadCartItems();
    this.getDataFromDB();
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
      this.vat = allVAT[0];
      this.discountList = allDiscounts;
      this.determineApplicableDiscount(); //set applicable discount
    } catch (error) {
      console.error('An error occurred:', error);
    }
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

  //get total quantity of items in cart i.e. if I want 10 of product A, 3 of product B and 1 of product C, return 14 NOT 3
  getCartQuantity(): number {
    let qty = 0;

    this.cart.forEach(cartItem => {
      qty += cartItem.quantity;
    });

    return qty;
  }

  /* getCartTotalBeforeDiscount() {

  } */

  //please pass discount parameters as whole numbers e.g. 25 for 25%
  getCartTotal(customerDiscountWholeNumber: number): number {
    let cartTotal = 0;
    this.determineApplicableDiscount();
    let bulkDiscountWholeNumber = this.applicableDiscount ? this.applicableDiscount.percentage : 0;

    this.cart.forEach(cartItem => {
      cartTotal += cartItem.fixedProduct.price * cartItem.quantity;
    });

    //add discount
    let totalDiscountInRand = (bulkDiscountWholeNumber + customerDiscountWholeNumber) / 100 * cartTotal;
    cartTotal = cartTotal - totalDiscountInRand;

    return cartTotal;
  }

  //determine which bulk discount is applicable
  determineApplicableDiscount(): number {
    let cartQty = this.getCartQuantity();

    for (const discount of this.discountList) {
      if (cartQty >= discount.quantity) {
        this.applicableDiscount = discount;
      } else {
        break; // Stop iterating once the quantity requirement is not met
      }
    }

    if (this.applicableDiscount == null) return 0;
    else return this.applicableDiscount.percentage;
  }
  
  getVATInclusive(amount: number): number { 
    let priceInclVAT = amount * (1 + this.vat.percentage/100);
    return priceInclVAT;
  }
}
