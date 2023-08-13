import { Injectable } from '@angular/core';
import { Cart } from '../../shared/customer-interfaces/cart';
import { DataService } from '../data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
/* import { Discount } from '../../shared/discount';
import { VAT } from '../../shared/vat';
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  //!!PRICES IN CART ARE VAT INCLUSIVE!!
  cart: Cart[] = [];
  fixedProducts: FixedProductVM[] = [];
  /* discountList: Discount[] = []; //list of all discounts
  applicableDiscount: Discount | null = null;
  vat!: VAT; */

  constructor(private dataService: DataService) {
    this.getProducts();
  }

  //get fixed and custom products from DB
  getProducts() {
    this.dataService.GetAllFixedProducts().subscribe((result: any[]) => {
      let allFixedProducts: any[] = result;
      this.fixedProducts = []; //empty array
      allFixedProducts.forEach((prod) => {
        this.fixedProducts.push(prod);
      });

      console.log('All fixed products from cart service: ', this.fixedProducts);
    });
  }

  getCartItems(): Cart[] {
    return this.cart;
  }

  emptyCart() {
    this.cart = [];
    //this.saveCart();
  }

  //get total quantity of items in cart i.e. if I want 10 of product A, 3 of product B and 1 of product C, return 14 NOT 3
  getCartQuantity(): number {
    let qty = 0;

    this.cart.forEach(cartItem => {
      qty += cartItem.quantity;
    });

    return qty;
  }

  addToCart(fixedProductID: number, quantity: number, sizeString: string): boolean {
    let fixedProdToAdd = this.fixedProducts.find(prod => prod.fixedProductID == fixedProductID); //get fixed product to put in cart
    if (fixedProdToAdd) {
      //check if user already has that product in their cart
      let duplicateCartItem = this.cart.find(cartItem => cartItem.fixedProduct.fixedProductID == fixedProdToAdd?.fixedProductID);

      if (duplicateCartItem) { //if the user already has that item in cart, just update quantity
        let index = this.cart.indexOf(duplicateCartItem);
        console.log('Cart item before updating qty: ', this.cart[index]);
        //if the product already exists in the cart, just increase the quantity; don't worry about adjusting discount cos they can't see it on this page; they'll see it in their cart
        this.cart[index].quantity += quantity;
        console.log('Cart item after updating qty: ', this.cart[index]);

        return true; //successfully updated quantity
      }
      else {
        //if not, create new cart item
        let newCartItem: Cart = {
          fixedProduct: fixedProdToAdd,
          sizeString: sizeString,
          quantity: quantity
        }

        this.cart.push(newCartItem);
        console.log('Updated cart: ', this.cart);

        return true; //successfully added to cart
      }
    }
    else {
      return false;
    }
  }

  //function to get data from DB asynchronously (and simultaneously)
  /* setGlobalVariables(allDiscounts: Discount[], vat: VAT) {
    this.discountList = allDiscounts;
    this.vat = vat;
  }

  loadCartItems() {
    //Retrieve cart list from local storage; if there's nothing in cart, return empty array
    this.cart = JSON.parse(localStorage.getItem("MegaPack-cart") || "[]");
    console.log('cart', this.cart);
  }

  saveCart() {
    //store updated cart in local storage
    localStorage.setItem("MegaPack-cart", JSON.stringify(this.cart));
  }

  getCartTotalBeforeDiscount() {

  }

  getCartTotalBeforeDiscount(): number {
    let cartTotal = 0;

    this.cart.forEach(cartItem => {
      cartTotal += cartItem.fixedProduct.price * cartItem.quantity;
    });

    return cartTotal;
  }

  //please pass discount parameters as whole numbers e.g. 25 for 25%
  getCartTotal(customerDiscountWholeNumber: number): number {
    console.log(this.discountList);
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
  } */
}
