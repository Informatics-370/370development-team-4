import { Injectable } from '@angular/core';
import { Cart } from '../../shared/customer-interfaces/cart';
import { DataService } from '../data.services';
import { Observable, forkJoin } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from 'src/app/shared/custom-product-vm';
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
  customProducts: CustomProductVM[] = [];
  /* discountList: Discount[] = []; //list of all discounts
  applicableDiscount: Discount | null = null;
  vat!: VAT; */

  constructor(private dataService: DataService) {
    this.loadCartItems();
  }

  //get fixed and custom products from DB
  //returns an observable of type void; doesn't emit any actual values when subscribed to but will be used for other things like updating fixedProducts and customProducts arrays.
  getProducts(): Observable<void> {
    //forkjoin combines multiple observables into 1 that emits an array of values once all the observables complete
    return forkJoin([
      this.dataService.GetAllFixedProducts(),
      this.dataService.GetAllCustomProducts()
    ]).pipe(
      //tap receives an array containing the fixed and custom products
      tap(([allFixed, allCustom]) => {
        this.fixedProducts = allFixed;
        this.customProducts = allCustom;
  
        console.log('All fixed products from cart service: ', this.fixedProducts);
        console.log('All custom products from cart service: ', this.customProducts);
      }),
      //map each value emitted to a constant value- void 0 (aka undefined). Since getProducts doesn't return any values, this ensures that the resulting observable emits nothing but still completes successfully.
      map(() => void 0)
    );
  }
  
  /* async getProducts() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getCustomProductsPromise = lastValueFrom(this.dataService.GetAllCustomProducts().pipe(take(1)));

      //The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      //That's what the Promise.all method is supposed to be doing.
      const [allFixed, allCustom] = await Promise.all([
        getFixedProductsPromise,
        getCustomProductsPromise
      ]);

      //put results from DB in global arrays
      this.fixedProducts = allFixed;
      console.log('All fixed products from cart service: ', this.fixedProducts);
      this.customProducts = allCustom;
      console.log('All custom products from cart service: ', this.customProducts);
    } 
    catch (error) {
      console.error('An error occurred:', error);
    }
  } */

  loadCartItems() {
    //Retrieve cart list from local storage; if there's nothing in cart, return empty array
    this.cart = JSON.parse(localStorage.getItem("MegaPack-cart") || "[]");
    console.log('cart from load cart items function', this.cart);
  }

  saveCart() {
    //store updated cart in local storage
    localStorage.setItem("MegaPack-cart", JSON.stringify(this.cart));
  }

  getCartItems(): Cart[] {
    return this.cart;
  }

  emptyCart() {
    this.cart = [];
    this.saveCart();
  }

  //NUMBER OF PRODUCTS IN CART i.e. if I want 10 of product A, 3 of product B and 1 of product C, return 3 products NOT 14
  getCartProductCount(): number {
    return this.cart.length;
  }

  //get total quantity of items in cart i.e. if I want 10 of product A, 3 of product B and 1 of product C, return 14 NOT 3
  getCartQuantity(): number {
    let qty = 0;

    this.cart.forEach(cartItem => {
      qty += cartItem.quantity;
    });

    return qty;
  }

  addToCart(productID: number, description: string, productItemDescription: string, sizeString: string,
    productPhotoB64: string, isFixedProduct: boolean, quantity: number): boolean {

    if (isFixedProduct) { //if it's a fixed product
      let fixedProdToAdd = this.fixedProducts.find(prod => prod.fixedProductID == productID); //get fixed product to put in cart

      if (fixedProdToAdd) {
        //check if user already has that product in their cart
        let duplicateCartItem = this.cart.find(cartItem => cartItem.productID == fixedProdToAdd?.fixedProductID);

        if (duplicateCartItem) { //if the user already has that item in cart, just update quantity
          let index = this.cart.indexOf(duplicateCartItem);

          //if the product already exists in the cart, just increase the quantity; don't worry about adjusting discount cos they can't see it on this page; they'll see it in their cart
          this.cart[index].quantity += quantity;
        }
        else {
          //if not, create new cart item
          let newCartItem: Cart = {
            //fixedProduct: fixedProdToAdd,
            productID: productID,
            description: description,
            itemDescription: productItemDescription,
            sizeString: sizeString,
            productPhotoB64: productPhotoB64,
            isFixedProduct: isFixedProduct,
            quantity: quantity,
            quantityOnHand: 0,
            hasValidQuantity: true
          }

          this.cart.push(newCartItem);
          console.log('Updated cart: ', this.cart);
        }

        this.saveCart();
        return true; //successfully updated quantity or added to cart
      }
    }
    else { //it's a custom product
      //create new cart item
      let newCartItem: Cart = {
        productID: productID,
        description: description,
        itemDescription: productItemDescription,
        sizeString: sizeString,
        productPhotoB64: productPhotoB64,
        isFixedProduct: isFixedProduct,
        quantity: quantity,
        quantityOnHand: 0,
        hasValidQuantity: true
      }

      this.cart.push(newCartItem);
      console.log('Updated cart: ', this.cart);

      this.saveCart();
      return true; //successfully added to cart
    }

    return false;
  }

  removeFromCart(cartItem: Cart) {
    let index = this.cart.indexOf(cartItem);
    this.cart.splice(index, 1);
    this.saveCart();
  }

  //update quantity of cart item
  updateProductQuantity(productID: number, isFixedProduct: boolean, newQuantity: number): boolean {
    //find product in the cart
    let product = this.cart.find(prod => prod.productID == productID && prod.isFixedProduct == isFixedProduct);
    if (product) {
      if (isFixedProduct) {
        //if it's a fixed product, check that the new quantity is not more than the quantity on hand
        if (this.belowQuantityOnHand(product.productID, newQuantity)) {
          let i = this.cart.indexOf(product);
          this.cart[i].quantity = newQuantity;
          this.saveCart();
          console.log('Updated fixed cart item: ', this.cart[i]);

          return true;
        }
      }
      else { //custom product
        let i = this.cart.indexOf(product);
        this.cart[i].quantity = newQuantity;
        this.saveCart();
        console.log('Updated custom cart item: ', this.cart[i]);

        return true;
      }
    }

    return false;
  }

  //returns true if the quantity I want to assign to a fixed product in the cart is below the quantity on hand
  //this function ASSUMES you're checking a fixed product
  belowQuantityOnHand(productID: number, quantityToCheck: number): boolean {
    let prodToCheck = this.cart.find(prod => prod.productID == productID && prod.isFixedProduct == true);

    if (prodToCheck) {
      let fixedProd = this.fixedProducts.find(prod => prod.fixedProductID == prodToCheck?.productID);
      console.log('fixedProd', fixedProd);

      let i = this.cart.indexOf(prodToCheck); //get index of product so I can update its max quantity

      if (fixedProd) {
        if (quantityToCheck <= fixedProd?.quantityOnHand) {
          this.cart[i].hasValidQuantity = true;
          this.cart[i].quantityOnHand =  fixedProd.quantityOnHand;
          this.saveCart();
          return true;
        }
        else {
          this.cart[i].hasValidQuantity = false;
          this.cart[i].quantityOnHand = fixedProd.quantityOnHand;
          this.saveCart();
        }
      }
    }

    return false;
  }

  //function to get data from DB asynchronously (and simultaneously)
  /* setGlobalVariables(allDiscounts: Discount[], vat: VAT) {
    this.discountList = allDiscounts;
    this.vat = vat;
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
