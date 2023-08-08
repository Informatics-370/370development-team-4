import { Component, Renderer2, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { SizeVM } from '../../shared/size-vm';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { VAT } from 'src/app/shared/vat';
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

  //OUT OF STOCK
  outOfStock = false;
  maxQuantity = 2000000;

  /* //DISCOUNT
  discountApplied = false;
  discount: Discount | null = null; //hold discount
  discountList: Discount[] = []; //hold all bulk discounts */

  //DISPLAY PRODUCT
  selectedProductVM!: ProductVM; //used to hold the product that is displayed to the user
  items: Item[] = []; //used to store all items
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products
  sizes: SizeVM[] = []; //all sizes
  itemID: number = -1; //ID of product item user clicked on to get to this page
  vat!: VAT;

  //ADD TO CART
  sizeDropdownArray: SizeDropdrownItem[] = []; //array used to populate size dropdown
  selectedFixedProdID = 1; //holds the ID of fixed prod with size currently selected
  selectedSizeIndex = 0; //holds index of size currently selected in dropdown
  total = 0; //hold total cost i.e. unit price * qty - discount
  cart: Cart[] = []; //hold cart
  addToCartForm: FormGroup; //form

  //MESSAGES TO USER
  invalidQty = false; //validation error logic
  loading = true; //display loading message
  cartSuccess = false; //display success message when product is added to cart

  //DISPLAY RELATED PRODUCTS
  relatedProductsVMList: ProductVM[] = []; //list of max 6 related products

  //CUSTOMISE PRODUCT
  canCustomise = false;
  customiseForm: FormGroup; //customise form
  customisableItems: Item[] = []; //hold array of single wall carton and double wall carton
  invalidFile = false;
  sides = 1; //holds number of sides user wants to print on for a custom box
  //hold styles for box preview that are calculated based on box dimensions
  front: any = { //styles for box front face
    width: '10em', /*box length*/
    height: '8em', /*box height*/
    transform: 'translateZ(2.5em)' /* half of box width */
  }

  back: any = { //styles for box back face
    width: '10em', /*box length*/
    height: '8em', /*box height*/
    transform: 'translateZ(-2.5em)' /* half of box width */
  }

  left: any = { //styles for box left face
    width: '5em', /*box width*/
    height: '8em', /*box height*/
    transform: 'translateX(-5em) rotateY(90deg)' /* half of box length */
  }

  right: any = { //styles for box right face
    width: '5em', /*box width*/
    height: '8em', /*box height*/
    transform: 'translateX(5em) rotateY(90deg)' /* half of box length */
  }

  top: any = { //styles for box top face
    width: '10em', /*box length*/
    height: '5em', /*box width*/
    transform: 'translateY(-4em) rotateX(90deg)' /*half of box height*/
  }

  bottom: any = { //styles for box bottom face
    width: '10em', /*box length*/
    height: '5em', /*box width*/
    transform: 'translateY(4em) rotateX(90deg)' /*half of box height*/
  }

  topSpan: any = { //styles for box tape on top
    width: '1em' /*box length divided by 10*/
  }

  frontBackSpan: any = { //styles for box tape on front
    height: '2em', /*box height divided by 4*/
    width: '1em' /*box length divided by 10*/
  }

  leftRightImg: any = { //styles for box image
    'max-width': '4em', /*box width times 0.8*/
    'max-height': '6.4em' /*box height times 0.8*/
  }

  frontBackImg: any = { //styles for box image
    'max-width': '8em', /*box length times 0.8*/
    'max-height': '6.4em' /*box height times 0.8*/
  }

  topBottomImg: any = { //styles for box image
    'max-height': '4em' /*box width times 0.8*/
  }

  constructor(private dataService: DataService, private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder, private renderer: Renderer2, private el: ElementRef) {
    this.addToCartForm = this.formBuilder.group({
      sizeID: [{ value: '1' }, Validators.required],
      qty: [1, Validators.required]
    });

    this.customiseForm = this.formBuilder.group({
      height: [800, Validators.required],
      width: [500, Validators.required],
      length: [1000, Validators.required],
      itemID: [1, Validators.required],
      sides: [1, Validators.required],
      label: []
    });

    this.customiseForm.valueChanges.subscribe(changes => {
      this.updateCustomBoxPreview(changes);
    });
  }

  ngOnInit() {
    this.getDataFromDB();
    //Retrieve the item ID from url
    this.activatedRoute.paramMap.subscribe(params => {
      //product with id 2 and description 'product description' will come as '2-product-description' so split it into array that is ['2', 'product-description']
      let id = params.get('id')?.split('-', 1);
      if (id) this.itemID = parseInt(id[0]);
    });

    //Retrieve cart list from local storage; if there's nothing in cart, return empty array
    this.cart = JSON.parse(localStorage.getItem("MegaPack-cart") || "[]");
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getItemsPromise = lastValueFrom(this.dataService.GetItems().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getSizesPromise = lastValueFrom(this.dataService.GetSizes().pipe(take(1)));
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allVAT, allItems, allSizes, allFixedProducts] = await Promise.all([
        getVATPromise,
        getItemsPromise,
        getSizesPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.items = allItems;
      this.fixedProducts = allFixedProducts;
      this.sizes = allSizes;
      this.vat = allVAT[0];
      this.customisableItems = this.items.filter(item =>
        item.description.toLocaleLowerCase() == 'single wall carton' || item.description.toLocaleLowerCase() == 'single wall box' ||
        item.description.toLocaleLowerCase() == 'double wall carton' || item.description.toLocaleLowerCase() == 'double wall box'
      );
      console.log('customisableItems', this.customisableItems);

      this.displayProduct();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  displayProduct() {
    let matchingItem = this.items.find(item => item.itemID == this.itemID); //get the item with matching ID
    let matchingFixedProducts = this.fixedProducts.filter(fixedProd => fixedProd.itemID == this.itemID); //get all products with matching item ID

    //determine if it can be customised
    if (matchingItem?.description.toLocaleLowerCase() == 'single wall carton' || matchingItem?.description.toLocaleLowerCase() == 'single wall box' || matchingItem?.description.toLocaleLowerCase() == 'double wall carton' || matchingItem?.description.toLocaleLowerCase() == 'double wall box') {
      this.canCustomise = true;
    }

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
          let priceInclVAT = fixedProd.price * (1 + this.vat.percentage / 100); //let price shown incl vat

          let sizeDropdownObject: SizeDropdrownItem = {
            sizeString: sizeDropdownString,
            price: parseFloat(priceInclVAT.toFixed(2)),
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
        sizeStringArray: sizeStringListArr,
        price: 0
      }

      console.log('Display: ', this.selectedProductVM, ' and dropdown list: ', this.sizeDropdownArray);
      this.selectedFixedProdID = this.sizeDropdownArray[0].fixedProductID; //set initial value of size dropdown to first size
      this.maxQuantity = this.sizeDropdownArray[0].qtyOnHand; //set max on qty number input

      if (this.maxQuantity == 0) this.toggleOutOfStock(true);

      this.loading = false; //stop showing loading message

      this.displayRelatedProducts(); //display related products
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

      this.total = this.sizeDropdownArray[this.selectedSizeIndex].price * qtyInputValue; //set product total

      /* //apply discount; keep iterating through the loop until a) reach end of discount list or b) find correct discount to apply
      let i = this.discountList.length - 1;
      while (i >= 0 && qtyInputValue < this.discountList[i].quantity) { i--; }

      if (i >= 0) { //if while loop stopped because I found correct discount not because I ran out of discounts to check
        this.applyDiscount(this.discountList[i], qtyInputValue);
      }
      //Discount applied logic
      else {
        //remove all previously applied discounts
        this.discountApplied = false;
        this.discount = null;
        this.total = this.sizeDropdownArray[this.selectedSizeIndex].price * qtyInputValue; //set product total
      } */
    }
    else if (qtyInputValue == 0) {
      this.addToCartForm.get("qty")?.setValue(1);
      this.invalidQty = true;

      setTimeout(() => {
        this.invalidQty = false;
      }, 8000);
    }
  }

  /* applyDiscount(discountToApply: Discount, qty: number) {
    this.discount = discountToApply;
    let unitPrice = this.sizeDropdownArray[this.selectedSizeIndex].price;
    let totalBeforeDiscount = unitPrice * qty;
    this.total = totalBeforeDiscount - (totalBeforeDiscount * this.discount.percentage / 100);

    console.log('total', this.total, ' and discount is ', this.discount, '%');
    this.discountApplied = true; //display discount    
  } */

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
        fixedProdToAdd.price = this.getVATInclusive(fixedProdToAdd.price); //make fixed product price vat inclusive so cart is auto vat inclusive

        let newCartItem: Cart = {
          fixedProduct: fixedProdToAdd,
          sizeString: this.selectedProductVM.sizeStringArray[this.selectedSizeIndex],
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

  async displayRelatedProducts() {
    //get related products
    let matchingItem = this.items.find(item => item.itemID == this.itemID); //get the item with matching ID
    let matchingProductItems = this.items.filter(item => item.categoryID == matchingItem?.categoryID && item.itemID != matchingItem.itemID);
    this.relatedProductsVMList = [];

    //display max 6 related products
    let maxProducts: number = 6;
    if (matchingProductItems.length <= 4) maxProducts = matchingProductItems.length; //if there's less than 6 related products, don't loop 4 times

    let relatedProductContainer = document.getElementById('related-products-container') as HTMLElement; //get row that holds related products
    relatedProductContainer.innerHTML = '';

    for (let i = 0; i < maxProducts; i++) {
      //1st put all related products in product VM
      let prodVM: ProductVM;
      //check if there are actually fixed products under this product item
      let foundProd = this.fixedProducts.find(prod => prod.itemID == matchingProductItems[i].itemID);

      //put item and product photo info in card to display
      if (foundProd) { //don't show product items for which there are no fixed products
        //get product photo to use with product item because items don't have photos, products do.
        let foundProdWithPhoto = this.fixedProducts.find(prod => prod.itemID == matchingProductItems[i].itemID && prod.productPhotoB64 != '');

        prodVM = {
          itemID: foundProdWithPhoto ? foundProdWithPhoto.itemID : 0,
          categoryID: matchingProductItems[i].categoryID,
          description: matchingProductItems[i].description,
          productPhotoB64: foundProdWithPhoto ? foundProdWithPhoto.productPhotoB64 : '',
          sizeStringArray: [],
          price: 0
        }
        this.relatedProductsVMList.push(prodVM); //populate list that we'll use to display products to the user

        //create card dynamically
        const cardContainer = this.renderer.createElement('div');
        this.renderer.addClass(cardContainer, 'col-md-4');
        this.renderer.addClass(cardContainer, 'col-sm-6');
        this.renderer.addClass(cardContainer, 'card-container');

        const card = this.renderer.createElement('div');
        this.renderer.addClass(card, 'card');
        this.renderer.addClass(card, 'product-card');
        this.renderer.addClass(card, 'hover-animation');
        this.renderer.setStyle(card, 'border', '0.5px solid rgba(219, 219, 219, 0.25)');

        const cardImgTop = this.renderer.createElement('div');
        this.renderer.addClass(cardImgTop, 'card-img-top');
        this.renderer.addClass(cardImgTop, 'product-card-img-top');

        const img = this.renderer.createElement('img');
        this.renderer.addClass(img, 'card-img');
        this.renderer.addClass(img, 'product-card-img');
        this.renderer.setStyle(img, 'width', 'auto');
        this.renderer.setAttribute(img, 'src', 'data:image/png;base64,' + prodVM.productPhotoB64);
        this.renderer.setAttribute(img, 'alt', prodVM.description);

        const cardBody = this.renderer.createElement('div');
        this.renderer.addClass(cardBody, 'card-body');
        this.renderer.addClass(cardBody, 'product-card-body');

        const cardText = this.renderer.createElement('p');
        this.renderer.addClass(cardText, 'card-text');
        const text = this.renderer.createText(prodVM.description);
        this.renderer.appendChild(cardText, text);

        this.renderer.appendChild(cardImgTop, img);
        this.renderer.appendChild(cardBody, cardText);
        this.renderer.appendChild(card, cardImgTop);
        this.renderer.appendChild(card, cardBody);
        this.renderer.appendChild(cardContainer, card);
        this.renderer.appendChild(relatedProductContainer, cardContainer);

        this.renderer.listen(cardContainer, 'click', () => {
          this.redirectToProductDetails(prodVM.itemID, prodVM.description);
        });

        /*The resulting code looks like this:
            <div class="col-md-3 col-sm-6 card-container">
                <div class="card product-card hover-animation" style="border: 0.5px solid rgba(219, 219, 219, 0.25);">
                    <div class="card-img-top">
                        <img class="card-img product-card-img" style="width: auto;" src="data:image/png;base64,Base64String" alt="Single wall box">
                    </div>
                    <div class="card-body product-card-body">
                        <p class="card-text">Single Wall Box</p>
                    </div>
                </div>
            </div>
        */
      }
    }
  }

  redirectToProductDetails(productItemID: number, itemDescription: string) {
    //url is expecting product with id 2 and description 'product description' to be '2-product-description', so combine string into that
    let urlParameter = productItemID + '-' + itemDescription.replaceAll(' ', '-');
    //update displayed product info
    window.location.href = '/product-details/' + urlParameter;
  }

  getVATInclusive(amount: number): number {
    let priceInclVAT = amount * (1 + this.vat.percentage / 100);
    return priceInclVAT;
  }

  /*---------------------CUSTOMISE BOX LOGIC----------------------*/
  //function to display image name since I decided to be fancy with a custom input button
  showImageName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const chosenFile = inputElement.files?.[0];
    let imageName = document.getElementById('imageName') as HTMLSpanElement;
    const imageElements = this.el.nativeElement.querySelectorAll('.print');

    console.log(imageElements);

    if (chosenFile) { //if there is a file chosen
      //if chosen file is pdf/jpg
      if (chosenFile.type.includes('pdf') || chosenFile.type.includes('jpeg') || chosenFile.type.includes('jpg')) {
        imageName.innerHTML = chosenFile.name; //display file name
        this.invalidFile = false;

        if (chosenFile.type.includes('jpeg') || chosenFile.type.includes('jpg')) { //if chosen file is an image
          const reader = new FileReader();
          reader.readAsDataURL(chosenFile); //NB!!
          reader.onload = (e) => {
            imageElements.forEach((imgElement: HTMLImageElement) => {
              imgElement.src = e.target?.result as string; // Set the src attribute of the image element
            });
          };
        }
      }
      else {
        imageName.style.display = 'none';
        this.invalidFile = true;
      }
    }
  }

  //function to update custom box preview
  updateCustomBoxPreview(changes: any) {
    //first some validation aka no decimals allowed
    changes.length = Math.round(changes.length);
    changes.width = Math.round(changes.width);
    changes.height = Math.round(changes.height);
    this.sides = Math.round(this.sides);

    /*100mm = 1em
    Max length, width and height that can be displayed = 14em aka 1400mm aka 140cm
    */

    let newLength: number = changes.length;
    let newWidth: number = changes.width;
    let newHeight: number = changes.height;

    // Max size that can be displayed is 14em aka 1400mm
    const maxSize = 1400;

    // Check if any dimension exceeds the maximum size
    if (newLength > maxSize || newWidth > maxSize || newHeight > maxSize) {
      // Find the largest dimension
      const largestDimension = Math.max(newLength, newWidth, newHeight);

      // Calculate the scaling factor to fit within the max size
      const scalingFactor = maxSize / largestDimension;

      // Scale down all dimensions while maintaining the aspect ratio
      newLength = Math.floor(newLength * scalingFactor);
      newWidth = Math.floor(newWidth * scalingFactor);
      newHeight = Math.floor(newHeight * scalingFactor);
    }

    this.front = { //styles for box front face
      width: (newLength / 100).toFixed(1) + 'em', /*box length*/
      height: (newHeight / 100).toFixed(1) + 'em', /*box height*/
      transform: 'translateZ(' + (newWidth / 200).toFixed(1) + 'em)' /* half of box width */
    }

    this.back = { //styles for box back face
      width: (newLength / 100).toFixed(1) + 'em', /*box length*/
      height: (newHeight / 100).toFixed(1) + 'em', /*box height*/
      transform: 'translateZ(-' + (newWidth / 200).toFixed(1) + 'em)' /* half of box width */
    }

    this.left = { //styles for box left face
      width: (newWidth / 100).toFixed(1) + 'em', /*box width*/
      height: (newHeight / 100).toFixed(1) + 'em', /*box height*/
      transform: 'translateX(-' + (newLength / 200).toFixed(1) + 'em) rotateY(90deg)' /* half of box length */
    }

    this.right = { //styles for box right face
      width: (newWidth / 100).toFixed(1) + 'em', /*box width*/
      height: (newHeight / 100).toFixed(1) + 'em', /*box height*/
      transform: 'translateX(' + (newLength / 200).toFixed(1) + 'em) rotateY(90deg)' /* half of box length */
    }

    this.top = { //styles for box top face
      width: (newLength / 100).toFixed(1) + 'em', /*box length*/
      height: (newWidth / 100).toFixed(1) + 'em', /*box width*/
      transform: 'translateY(-' + (newHeight / 200).toFixed(1) + 'em) rotateX(90deg)' /*half of box height*/
    }

    this.bottom = { //styles for box bottom face
      width: (newLength / 100).toFixed(1) + 'em', /*box length*/
      height: (newWidth / 100).toFixed(1) + 'em', /*box width*/
      transform: 'translateY(' + (newHeight / 200).toFixed(1) + 'em) rotateX(90deg)' /*half of box height*/
    }

    this.topSpan = { //styles for box tape on top
      width: (newLength / 1000).toFixed(1) + 'em' /*box length divided by 10*/
    }

    this.frontBackSpan = { //styles for box tape on front
      height: (newHeight / 400).toFixed(1) + 'em', /*box height divided by 4*/
      width: (newLength / 1000).toFixed(1) + 'em' /*box length divided by 10*/
    }

    this.topBottomImg = { //styles for box image
      'max-height': (newWidth * 0.8 / 100).toFixed(1) + 'em', /*box width times 0.8*/
      'max-width': (newLength * 0.8 / 100).toFixed(1) + 'em' /*box length times 0.8*/
    }

    this.leftRightImg = { //styles for box image
      'max-width': (newWidth * 0.8 / 100).toFixed(1) + 'em', /*box width times 0.8*/
      'max-height': (newHeight * 0.8 / 100).toFixed(1) + 'em' /*box height times 0.8*/
    }
  
    this.frontBackImg = { //styles for box image
      'max-width': (newLength * 0.8 / 100).toFixed(1) + 'em', /*box length times 0.8*/
      'max-height': (newHeight * 0.8 / 100).toFixed(1) + 'em' /*box height times 0.8*/
    }
  }
}

export interface SizeDropdrownItem {
  fixedProductID: number;
  sizeString: string;
  price: number;
  qtyOnHand: number;
}
