import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { SizeVM } from '../../shared/size-vm';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { Discount } from '../../shared/discount';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cart } from 'src/app/shared/customer-interfaces/cart';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  /*NOTE: the product on display represents an item but each size available represents a fixed product */

  outOfStock = false;
  maxQuantity = 2000000;
  discountApplied = false;
  relatedProductsVMList: ProductVM[] = []; //all products
  selectedProductVM!: ProductVM; //used to hold all the products that will be displayed to the user
  items: Item[] = []; //used to store all items
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products
  sizes: SizeVM[] = [];
  itemID: number = -1;
  sizeDropdownArray: SizeDropdrownItem[] = []; //array used to populate size dropdown
  selectedFixedProdID = 1; //holds the ID of fixed prod with size currently selected
  selectedSizeIndex = 0; //holds index of size currently selected in dropdown
  discountList: Discount[] = []; //hold all bulk discounts
  total = 0; //hold total cost i.e. unit price * qty - discount
  discount: Discount | null = null; //hold discount
  cart: Cart[] = []; //hold cart
  //form
  addToCartForm: FormGroup;
  //messages to user
  invalidQty = false; //validation error logic
  loading = true; //display loading message
  cartSuccess = false; //display success message when product is added to cart

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) {
    this.addToCartForm = this.formBuilder.group({
      sizeID: [{ value: '1' }, Validators.required],
      qty: [1, Validators.required]
    });
  }

  ngOnInit() {
    this.getDataFromDB();
    //Retrieve the item ID from url
    this.activatedRoute.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) this.itemID = parseInt(id);
    });

    // generate static discount list
    this.discountList.push(
      { discountID: 1, percentage: 6, quantity: 50 },
      { discountID: 2, percentage: 10, quantity: 400 },
      { discountID: 3, percentage: 17, quantity: 7000 },
      { discountID: 4, percentage: 23, quantity: 20000 }
    )
    console.log('All discounts: ', this.discountList);

    //Retrieve cart list from local storage; if there's nothing in cart, return empty array
    this.cart = JSON.parse(localStorage.getItem("MegaPack-cart") || "[]");
    console.log('cart', this.cart);
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getItemsPromise = lastValueFrom(this.dataService.GetItems().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getSizesPromise = lastValueFrom(this.dataService.GetSizes().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allItems, allSizes, allFixedProducts] = await Promise.all([
        getItemsPromise,
        getSizesPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.items = allItems;
      this.fixedProducts = allFixedProducts;
      this.sizes = allSizes;

      this.displayProduct(this.itemID);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  displayProduct(id: number) {
    let matchingItem = this.items.find(item => item.itemID == id); //get the item with matching ID
    let matchingFixedProducts = this.fixedProducts.filter(fixedProd => fixedProd.itemID == id); //get all products with matching item ID
    /*sort matching fixed products by price so that sizes will also be in order from least expensive to most expensive, 
    which should result in smallest to biggest size*/
    matchingFixedProducts.sort((currentProd, nextProd) => {
      return currentProd.price - nextProd.price
    });

    let sizeStringListArr: string[] = []; //hold all size strings for this prod

    if (matchingItem && matchingFixedProducts.length != 0) {
      console.log('Item: ', matchingItem, ' and fixed products: ', matchingFixedProducts);

      //get all available sizes for this product item, as well as the sizes and put in product list
      matchingFixedProducts.forEach(fixedProd => {
        //get size using size ID
        let foundSize = this.sizes.find(size => size.sizeID == fixedProd.sizeID);

        //CONCATENATE SIZE STRINGS; later add sorting of sizes from smallest to largest
        if (foundSize) {
          //treat size like an array with the properties as values in the array but ignore categoryID, description, sizeID and any size that's = 0
          let sizeAsArray = Object.entries(foundSize).filter(([key, value]) => {
            return typeof value === 'number' && value > 0 && key !== 'categoryID' && key !== 'sizeID';
          });

          //GET SIZE STRING FOR SIZE LIST (INCL MEASUREMENTS)
          //concatenate the sizes into a string joined by 'x' and measurement, e.g. '150cm x 150cm x 150cm x 20l', for size list
          let sizeString = '';
          sizeAsArray.forEach(([key, value]) => {
            if (key == 'width' || key == 'height' || key == 'length') {
              sizeString += value + 'cm x ';
            }
            else if (key == 'volume') { sizeString += value + 'l x '; }
            else { sizeString += value + 'g x '; }
          }); //e.g. result is '150cm x 150cm x 150cm x 20l x '

          //if empty, N/A
          if (sizeString.trim() === '') sizeString = 'N/A';
          //it's not empty, so turn '150cm x 150cm x 150cm x 20l x ' to '150cm x 150cm x 150cm x 20l'
          else sizeString = sizeString.substring(0, sizeString.length - 3);

          sizeStringListArr.push(sizeString); //push to size string holder

          //GET SIZE STRINGS FOR SIZE DROPDOWN
          //concatenate the sizes into a string joined by 'x', e.g. '150x150x150', for size dropdown
          let sizeDropdownString = sizeAsArray.map(([key, value]) => value).join('x');

          //if it's empty, N/A
          if (sizeDropdownString.trim() === '') sizeDropdownString = 'N/A';

          //create object; e.g. result: {sizeString: '150x150', price: 12.99, id: 15, qtyOnHand: 243500}
          let sizeDropdownObject: SizeDropdrownItem = {
            sizeString: sizeDropdownString,
            price: fixedProd.price,
            fixedProductID: fixedProd.fixedProductID,
            qtyOnHand: Math.floor((Math.random() * 2000000)) //random whole number between 0 and 2 000 000
            /* qtyOnHand: fixedProd.quantityOnHand //when fixed product quantities can be updated */
          };

          this.sizeDropdownArray.push(sizeDropdownObject); //push to global array for size dropdown
        }
      });

      //must declare product here otherwise TS forgets that I check that prodItem isn't null
      this.selectedProductVM = {
        itemID: matchingItem.itemID,
        description: matchingItem.description,
        categoryID: matchingItem.categoryID,
        productPhotoB64: matchingFixedProducts[matchingFixedProducts.length - 1].productPhotoB64,
        sizeStringArray: sizeStringListArr
      }

      console.log('Display: ', this.selectedProductVM, ' and dropdown list: ', this.sizeDropdownArray);
      this.selectedFixedProdID = this.sizeDropdownArray[0].fixedProductID; //set initial value of size dropdown to first size
      this.maxQuantity = this.sizeDropdownArray[0].qtyOnHand; //set max on qty number input

      if (this.maxQuantity == 0) this.toggleOutOfStock(true);

      this.loading = false; //stop showing loading message
    }
  }

  changedSize() {
    this.selectedSizeIndex = this.sizeDropdownArray.findIndex(element => element.fixedProductID == this.selectedFixedProdID);
    this.maxQuantity = this.sizeDropdownArray[this.selectedSizeIndex].qtyOnHand; //update max qty on hand because it sets the max value of qty input
    //check if this product is out of stock
    if (this.maxQuantity == 0) this.toggleOutOfStock(true);
    else this.toggleOutOfStock(false);

    this.changedQty();
  }

  changedQty() {
    this.invalidQty = false; //hide validation error msg
    let qtyInputValue = this.addToCartForm.get("qty")?.value; //get value entered in qty number input
    if (qtyInputValue > 0) { //if it's a valid number
      //don't allow orders greater than what we got on hand
      if (qtyInputValue > this.maxQuantity) {
        this.addToCartForm.get("qty")?.setValue(this.maxQuantity);
        this.invalidQty = true;

        setTimeout(() => {
          this.invalidQty = false;
        }, 8000);
      }

      //apply discount; keep iterating through the loop until a) reach end of discount list or b) find correct discount to apply
      let i = this.discountList.length - 1;
      while (i >= 0 && qtyInputValue < this.discountList[i].quantity) { i--; }

      if (i >= 0) { //if while loop stopped because I found correct discount not because I ran out of discounts to check
        this.applyDiscount(this.discountList[i], qtyInputValue);
      }
      else {
        //remove all previously applied discounts
        this.discountApplied = false;
        this.discount = null;
        this.total = this.sizeDropdownArray[this.selectedSizeIndex].price * qtyInputValue; //set product total
      }
    }
    else if (qtyInputValue == 0) {
      this.addToCartForm.get("qty")?.setValue(1);
      this.invalidQty = true;

      setTimeout(() => {
        this.invalidQty = false;
      }, 8000);
    }
  }

  applyDiscount(discountToApply: Discount, qty: number) {
    this.discount = discountToApply;
    let unitPrice = this.sizeDropdownArray[this.selectedSizeIndex].price;
    let totalBeforeDiscount = unitPrice * qty;
    this.total = totalBeforeDiscount - (totalBeforeDiscount * this.discount.percentage / 100);

    console.log('total', this.total, ' and discount is ', this.discount, '%');
    this.discountApplied = true; //display discount    
  }

  addToCart() {
    let id = this.sizeDropdownArray[this.selectedSizeIndex].fixedProductID;
    let fixedProdToAdd = this.fixedProducts.find(prod => prod.fixedProductID == id); //get fixed product to put in cart
    if (fixedProdToAdd) {
      //check if user already has that product in their cart
      let duplicateCartItem = this.cart.find(cartItem => cartItem.fixedProduct.fixedProductID == fixedProdToAdd?.fixedProductID);

      if (duplicateCartItem) {
        let index = this.cart.indexOf(duplicateCartItem);
        console.log('Cart item before updating qty: ', this.cart[index]);
        //if the product already exists in the cart, just increase the quantity; don't worry about adjusting discount cos they can't see it on this page; they'll see it in their cart
        this.cart[index].quantity += this.addToCartForm.get("qty")?.value;
        console.log('Cart item after updating qty: ', this.cart[index]);
      }
      else {
        //if not, create new cart item
        let newCartItem: Cart = {
          fixedProduct: fixedProdToAdd,
          sizeString: this.selectedProductVM.sizeStringArray[this.selectedSizeIndex],
          discountID: this.discount ? this.discount.discountID : -1,
          quantity: this.addToCartForm.get("qty")?.value
        }

        this.cart.push(newCartItem);
      }

      //store updated cart in local storage
      localStorage.setItem("MegaPack-cart", JSON.stringify(this.cart));
      this.cartSuccess = true;
      setTimeout(() => {
        this.cartSuccess = false;
      }, 8000);
    }
  }

  toggleOutOfStock(isProductOutOfStock: boolean) {
    if (isProductOutOfStock) { //if out of stock
      this.outOfStock = true; //show div if product is out of stock
      this.addToCartForm.get("qty")?.disable(); //disable qty number input but leave size because a different size might be in stock
    }
    else {
      this.outOfStock = false; //hide div
      this.addToCartForm.get("qty")?.enable(); //enable qty number input
    }
  }

  /*  
  redirectToCart() {
    this.router.navigate(['cart']);
  }
  */

}

export interface SizeDropdrownItem {
  fixedProductID: number;
  sizeString: string;
  price: number;
  qtyOnHand: number;
}
