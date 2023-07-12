import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { SizeVM } from '../../shared/size-vm';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
//import discount
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  outOfStock = false;
  quantityOnHand = 2000000;
  discountApplied = false;
  relatedProductsVMList: ProductVM[] = []; //all products
  selectedProductVM!: ProductVM; //used to hold all the products that will be displayed to the user
  items: Item[] = []; //used to store all items
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products
  sizes: SizeVM[] = [];
  itemID: number = -1;
  sizeStringAndPricesArr: any[] = []; //array used to populate size dropdown
  selectedSizeID = 1; //holds the ID of size currently selected
  selectedSizeIndex = 0; //holds index of size currently selected in array
  loading = true; //display loading message
  discountList: standInDiscount[] = []; //hold all bulk discounts
  total = 0; //hold total cost
  discount = 0; //hold discount e.g 20 for 20% discount
  //form
  addToCartForm: FormGroup;
  //validation error logic
  invalidQty = false;

  constructor(private dataService: DataService ,private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.addToCartForm = this.formBuilder.group({
      sizeID: [{ value: '1' }, Validators.required],
      qty: [1, Validators.required]
    });
}

  ngOnInit() {
    this.getDataFromDB();
    //Retrieve the item ID from url
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');
      if (id) this.itemID = parseInt(id);
    });

    // generate static discount list
    for (let i = 0; i < 4; i++) {
      let min = 5 + i * 5;  // Calculate the lower bound for percentage
      let newDiscount: standInDiscount = {
        discountID: i + 1,
        percentage: Math.floor(Math.random() * ((9 + i * 5) - min + 1)) + min, //random whole number between 5-9, then 10-14, 15-19 then 20-24
        quantity: (Math.floor(Math.random() * 9) + 1) * Math.pow(10, i + 1) //random multiple of 10 between 10-90, then 100-900, 1 000-9 000 then 10 000-90 000
      }
      this.discountList.push(newDiscount);
    }
    console.log('All discounts: ', this.discountList);
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
    which should result in smallest size to biggest size*/
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
          
          let sizeStringAndPrice: SizeDropdrownItem = {
            sizeID: foundSize.sizeID,
            sizeString: sizeDropdownString, 
            price: fixedProd.price
          }; //create object; e.g. result: {sizeString: '150x150', price: 12.99}
          this.sizeStringAndPricesArr.push(sizeStringAndPrice); //push to global array for size dropdown
        }        
      });
      
      //must declare product here otherwise TS forgets that I check that prodItem isn't null
      this.selectedProductVM = {
        itemID: matchingItem.itemID,
        description: matchingItem.description,
        categoryID: matchingItem.categoryID,
        productPhotoB64: matchingFixedProducts[matchingFixedProducts.length - 1].productPhotoB64,
        sizeStringArray: sizeStringListArr,
        qtyOnHand: Math.floor((Math.random() * 2000000)) //random whole number between 0 and 2 000 000
      }

      console.log('Display: ', this.selectedProductVM);
      this.selectedSizeID = this.sizeStringAndPricesArr[0]['sizeID']; //set value of size dropdown to first size
      this.quantityOnHand = this.selectedProductVM.qtyOnHand; //set max on qty number input

      if (this.selectedProductVM.qtyOnHand == 0) this.outOfStock = true; //show if product is out of stock

      this.loading = false; //stop showing loading message
    }
  }

  changedSize() {
    this.selectedSizeIndex = this.sizeStringAndPricesArr.findIndex(element => element.sizeID == this.selectedSizeID);
    this.changedQty();
  }

  changedQty() {
    this.invalidQty = false; //hide validation error msg
    let qtyInputValue = this.addToCartForm.get("qty")?.value; //get value enered in qty number input
    if (qtyInputValue > 0) { //if it's a valid number
      //don't allow orders greater than what we got on hand
      if (qtyInputValue > this.quantityOnHand) { 
        this.addToCartForm.get("qty")?.setValue(this.quantityOnHand);
        this.invalidQty = true;

        setTimeout(() => {
          this.invalidQty = false;
        }, 10000);
      }

      //apply discount; keep iterating through the loop until a) reach end of discount list or b) find correct discount to apply
      let i = this.discountList.length - 1;
      while (i >= 0 && qtyInputValue < this.discountList[i].quantity) { i--; }

      if (i >= 0) { //if while loop stopped because I found correct discount not because I ran out of discounts to check
        console.log('i', i);
        this.applyDiscount(this.discountList[i], qtyInputValue);
      }
      else
        this.discountApplied = false; //remove all previously applied discounts
        this.total = this.sizeStringAndPricesArr[this.selectedSizeIndex].price * qtyInputValue; //set product total
    }
    else if (qtyInputValue == 0) {        
      this.addToCartForm.get("qty")?.setValue(1);
      this.invalidQty = true;

      setTimeout(() => {
        this.invalidQty = false;
      }, 10000);
    }
  }

  applyDiscount(discountToApply: standInDiscount, qty: number) {
    this.discount = discountToApply.percentage;
    let unitPrice = this.sizeStringAndPricesArr[this.selectedSizeIndex].price;
    let totalBeforeDiscount = unitPrice * qty;
    this.total = totalBeforeDiscount - (totalBeforeDiscount * this.discount / 100);

    console.log('total', this.total, ' and discount is ', this.discount, '%');
    this.discountApplied = true; //display discount
    
  }

  /*APPLY DISCOUNT:
  BEFORE
  <span id="estimated-price">Unit price (estimate):<br/>
                                    <strong class="price">{{sizeStringAndPricesArr[selectedSizeIndex].price | currency: 'ZAR':'symbol-narrow'}}</strong>
                                </span>
                                <span id="discount-applied" *ngIf="discountApplied"> <br/>
                                    Total: <strong class="price"><br/>R19.99</strong>                                    
                                    <strong id="discount">20% OFF!</strong>
                                </span>

  AFTER
  <span id="estimated-price" class="strikethrough">Unit price (estimate):<br/>
                                    <strong>R19.99</strong>
                                </span>
                                <span id="discount-applied" *ngIf="discountApplied"> <br/>
                                    Total: <strong class="price"><br/>R19.99</strong>                                    
                                    <strong id="discount">20% OFF!</strong>
                                </span>
  */


}

export interface SizeDropdrownItem {
  sizeID: number;
  sizeString: string;
  price: number;
}

export interface standInDiscount {
  discountID: number;
  percentage: number;
  quantity: number;
}
