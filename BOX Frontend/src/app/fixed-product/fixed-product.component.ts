import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { CategoryVM } from '../shared/category-vm';
import { SizeVM } from '../shared/size-vm';
import { Item } from '../shared/item';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { TableFixedProductVM } from '../shared/table-fixed-product-vm';
//import discount, VAT, supplier

@Component({
  selector: 'app-fixed-product',
  templateUrl: './fixed-product.component.html',
  styleUrls: ['./fixed-product.component.css']
})
export class FixedProductComponent {
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products
  filteredTableProducts: TableFixedProductVM[] = []; //used to hold all the fixed products that will be displayed to the user
  tableProducts: TableFixedProductVM[] = []; //store all fixed products in format to display in table
  categories: CategoryVM[] = []; //store all categories for view, search, update and delete
  items: Item[] = []; //store all items for view, search, update and delete
  sizes: SizeVM[] = []; //store all sizes for view, search, update and delete
  categorySizes: any[] = []; //store all sizes associated with a specific category
  categoryItems: Item[] = []; //store all product items associated with a specific category
  specificProduct!: FixedProductVM; //used to get a specific product
  productCount: number = -1; //keep track of how many products there are in the DB
  selectedProduct!: TableFixedProductVM; //used to store a specific product
  changedImage = false; //keep track of if user changed image when updating product details

  //forms
  addProductForm: FormGroup;
  updateProductForm: FormGroup;
  //select elements value
  public selectedCatValue = 'NA';
  public selectedItemValue = 'NA';
  public selectedSizeValue = 'NA';
  //update form dropdown elements values
  public selectedCatValueUpdate = '';
  public selectedItemValueUpdate = '';
  public selectedSizeValueUpdate = '';

  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors

  //error, loading and other messages
  loading = true; //show loading message while data loads
  duplicateFound = false; //boolean to display error message if user tries to create a product with duplicate description
  duplicateFoundUpdate = false; //used to display error message if user tries to update a product to have duplicate description

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addProductForm = this.formBuilder.group({
      description: ['', Validators.required],
      categoryID: [{ value: 'NA' }, Validators.required],
      itemID: [{ value: 'NA' }, Validators.required],
      sizeID: [{ value: 'NA' }, Validators.required],
      price: [1.00, Validators.required],
      productPhoto: []
    });

    this.updateProductForm = this.formBuilder.group({
      uDescription: ['', Validators.required],
      uCategoryID: [{ value: 'NA' }, Validators.required],
      uItemID: [{ value: 'NA' }, Validators.required],
      uSizeID: [{ value: 'NA' }, Validators.required],
      uPrice: [1.00, Validators.required],
      uProductPhoto: []
    })
  }

  ngOnInit(): void {
    this.getDataFromDB();
  }

  //--------------------------------------------------VIEW ALL PRODUCTS LOGIC--------------------------------------------------
  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getCategoriesPromise = lastValueFrom(this.dataService.GetCategories().pipe(take(1)));
      const getItemsPromise = lastValueFrom(this.dataService.GetItems().pipe(take(1)));
      const getSizesPromise = lastValueFrom(this.dataService.GetSizes().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing. However, the console logs are executing in order, which raises questions.
      But that could just be because they're outside the Promise.all. IDC!!!!! I'm tired of trying to find alternatives for this. 
      And data is being retrieved faster that how I had it work before so I'm moving on with my life
      get all products, categories, items and sizes and put in categories, items, sizes and products array*/
      const [categories, items, sizes] = await Promise.all([
        getCategoriesPromise,
        getItemsPromise,
        getSizesPromise
      ]);

      //put results from DB in global arrays
      this.categories = categories;
      console.log('All categories array for fixed products:', this.categories);
      this.items = items;
      console.log('All product items for fixed products:', this.items);
      this.sizes = sizes;
      console.log('All sizes for fixed products:', this.sizes);

      await this.getProductsPromise(); //get products; I love the await keyword
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //get products separately so I can update only products list, and not categories, items, etc. when product is CRUDed to save time
  async getProductsPromise(): Promise<any> {
    try {
      this.fixedProducts = await lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      this.formatProducts(); //Execute only after data has been retrieved from the DB otherwise error; put products in format to display in table

      return 'Successfully retrieved product from the database';
    } catch (error) {
      console.log('An error occurred while retrieving products: ' + error);
      throw new Error('An error occurred while retrieving products: ' + error);
    }
  }

  //put products in format to display in table
  formatProducts(): void {
    //reset arrays
    this.filteredTableProducts = [];
    this.tableProducts = [];
    let item: Item;
    let category: CategoryVM;

    this.fixedProducts.forEach(currentProduct => {
      let sizeString: string = ''; //reset string
// we instantiate the current product variable. By using a foreach loop, we go through each fixed product, eventually we will get to a certain ID
      //get item description
      this.items.forEach(currentItem => {
        if (currentItem.itemID == currentProduct.itemID) {
          item = currentItem;

          //get category description, using the category ID in item found
          this.categories.forEach(currentCat => {
            if (currentItem.categoryID == currentCat.categoryID) {
              category = currentCat;
            }
          });
        }
      });

      /*get size and concatenate size string logic; I could have achieved this with 7 if statements and no extra variables buuuuuuuuut
      I found an article that explains how to loop through the properties of the size object like it's an array:
      refer to this article: https://www.freecodecamp.org/news/how-to-iterate-over-objects-in-javascript/ */

      //Line 167 is actually the crux of the code
      this.sizes.forEach(currentSize => {
        if (currentSize.sizeID == currentProduct.sizeID) {
          //treat size like an array with the properties as values in the array but ignore categoryID, description, sizeID and any size that's = 0
          let sizeAsArr = Object.entries(currentSize).filter(([key, value]) => {
            return typeof value === 'number' && value > 0 && key !== 'categoryID' && key !== 'sizeID';
          });
    
          //concatenate the sizes into a string joined by 'x' '150x150x150'
          sizeString = sizeAsArr.map(([key, value]) => value).join('x');
    
          //if it's empty, N/A
          if (sizeString.trim() === '') {
            sizeString = 'N/A';
          }
        }
      });

      //create new tablefixedproductVM and push to global array
      let tableProductVM: TableFixedProductVM = {
        fixedProductID: currentProduct.fixedProductID,
        qRCodeID: currentProduct.qrCodeID,
        qRCodeB64: currentProduct.qrCodeBytesB64,
        categoryID: category.categoryID,
        categoryDescription: category.categoryDescription,
        itemID: currentProduct.itemID,
        itemDescription: item.description,
        sizeID: currentProduct.sizeID,
        sizeString: sizeString,
        description: currentProduct.description,
        price: currentProduct.price,
        productPhoto: currentProduct.productPhotoB64,
        quantityOnHand: currentProduct.quantityOnHand
      };

      this.filteredTableProducts.push(tableProductVM);
    });

    this.tableProducts = this.filteredTableProducts; //store all the products someplace before I search below
    console.log('Table product VM list', this.tableProducts);
    this.loading = false; //stop displaying loading message
    this.productCount = this.tableProducts.length; //update product count
  }

  //--------------------------------------------------------SEARCH BAR LOGIC--------------------------------------------------------
  searchProducts(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredTableProducts = []; //clear array
    for (let i = 0; i < this.tableProducts.length; i++) {
      //concatenate all the product info in one variable so user can search using any of them even if they aren't displayed in the table
      let prodInformation: string = String(this.tableProducts[i].categoryDescription +
        this.tableProducts[i].itemDescription + ' ' +
        this.tableProducts[i].sizeString + ' ' +
        this.tableProducts[i].description + ' ' +
        this.tableProducts[i].price).toLowerCase();

      if (prodInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredTableProducts.push(this.tableProducts[i]);
      }
    }

    this.productCount = this.filteredTableProducts.length; //update product count

    console.log('Search results:', this.filteredTableProducts);
  }

  //--------------------------------------------------------VIEW SPECIFIC PRODUCT LOGIC--------------------------------------------------------
  openViewProduct(prod: TableFixedProductVM) {
    this.selectedProduct = prod;
    $('#viewFixedProduct').modal('show');
  }

  //Download QR code as image
  downloadQRCodeAsImage() {
    var arrayBuffer = this.B64ToArrayBuffer(this.selectedProduct.qRCodeB64)
    const blob = new Blob([arrayBuffer], { type: 'image/png' });

    //Create link; apparently, I need this even though I have a download button
    const QRCodeImage = document.createElement('a');
    QRCodeImage.href = URL.createObjectURL(blob);
    QRCodeImage.download = this.selectedProduct.description + ' QR code';
    QRCodeImage.click(); //click link to start downloading
    URL.revokeObjectURL(QRCodeImage.href); //clean up URL object
  }

  //need to convert to array buffer first otherwise file is corrupted
  B64ToArrayBuffer(B64String: string) {
    var binaryString = window.atob(B64String); //decodes a Base64 string into a binary string
    var binaryLength = binaryString.length;
    var byteArray = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryLength; i++) {
      var ascii = binaryString.charCodeAt(i); //retrieve the ASCII code of the character in the binary string
      byteArray[i] = ascii; //assigns ASCII code to corresponding character in byte array
    }
    return byteArray;
  }

  //--------------------------------------------------------ADD PRODUCT LOGIC--------------------------------------------------------
  async addFixedProduct() {
    this.submitClicked = true;
    if (this.addProductForm.valid) {
      try {
        //get form data
        const formData = this.addProductForm.value;

        //prevent user from creating multiple products with same description
        if (this.checkDuplicateDescription(formData.description)) {
          this.duplicateFound = true;
          setTimeout(() => {
            this.duplicateFound = false;
          }, 5000);
        }
        else {
          //form data makes the image a string with a fake url which I can't convert to B64 so I must get the actual value of the file input      
          const inputElement = document.getElementById('productPhoto') as HTMLInputElement;
          const formImage = inputElement.files?.[0];

          let newProduct: FixedProductVM = {
            fixedProductID: 0,
            qrCodeID: 0,
            qrCodeBytesB64: '',
            itemID: parseInt(formData.itemID),
            sizeID: parseInt(formData.sizeID),
            description: formData.description,
            price: formData.price,
            quantityOnHand: 0,
            productPhotoB64: formImage ? await this.convertToBase64(formImage) : '' //convert to B64 if there's an image selected, otherwise, empty string
          }
          console.log('Unposted new product', newProduct);

          this.dataService.AddFixedProduct(newProduct).subscribe(
            (result: any) => {
              console.log('New product successfully created!', result);

              this.getProductsPromise(); //refresh only product list excluding item, category, etc.

              $('#addFixedProduct').modal('hide');

              //reset form
              this.submitClicked = false;
              this.addProductForm.reset();
              this.categoryItems = [];
              this.categorySizes = [];
              this.selectedCatValue = 'NA';
              this.selectedItemValue = "NA";
              this.selectedSizeValue = 'NA';
              //reset display image div
              let imageElement = document.getElementById('display-img') as HTMLImageElement;
              imageElement.src = '';
              imageElement.alt = '';
              document.getElementById('imageName')!.innerHTML = 'No image chosen';
              let imgIcon = document.getElementById('no-img'); //get image font awesome icon
              if (imgIcon) imgIcon.style.display = "block"; //show the font awesome icon that shows that no image was selected
            }
          );
        }
      }
      catch (error) {
        console.log('Error submitting form', error)
      }
    }
  }

  //--------------------------------------------------------UPDATE PRODUCT LOGIC--------------------------------------------------------
  openUpdateModal(prod: TableFixedProductVM) {
    this.selectedProduct = prod; //store image b64 string and other info; idc if it's better to only store string. I should be in bed rn
    //set category ID first cos it's used to populate size and item dropdown
    this.selectedCatValueUpdate = String(prod.categoryID);

    this.changedCategory('update'); //populate dropdowns
    //get item and size values
    let index = this.categoryItems.findIndex(item => item.itemID === prod.itemID);
    let selectedItem = this.categoryItems[index];
    index = this.categorySizes.findIndex(size => size.sizeID === prod.sizeID);
    let selectedSize = this.categorySizes[index];

    //display data in form
    this.updateProductForm.setValue({
      uDescription: prod.description,
      uCategoryID: prod.categoryID,
      uItemID: selectedItem.itemID,
      uSizeID: selectedSize.sizeID,
      uPrice: prod.price,
      uProductPhoto: ''
    });

    //show image if user added image when creating product
    var imageElement = document.getElementById('display-img-update') as HTMLImageElement;
    var imageNameSpan = document.getElementById('imageNameUpdate') as HTMLSpanElement;
    //create button to remove an uploaded pic
    let removeBtn: HTMLButtonElement = document.createElement('button');
    removeBtn.classList.add('remove-pic');
    removeBtn.setAttribute('title', 'Remove image')
    removeBtn.innerHTML = 'Remove';
    removeBtn.addEventListener('click', this.removeImage.bind(this, 'update'));

    if (prod.productPhoto) {
      imageElement.src = 'data:image/png;base64,' + prod.productPhoto;
      imageElement.alt = prod.description + '.png';
      imageNameSpan.innerHTML = prod.description; //display file name
      imageNameSpan.appendChild(removeBtn);
    }
    else {
      imageElement.src ='';
      imageElement.alt = 'No image found for this product.';
      imageNameSpan.innerHTML = '';
    }

    $('#updateFixedProduct').modal('show');    
  }

  //update product
  async updateFixedProduct() {
    this.submitClicked = true;
    if (this.updateProductForm.valid) {
      try {
        //get form data
        const formData = this.updateProductForm.value;

        //prevent user from creating multiple products with same description
        if (this.checkDuplicateDescription(formData.uDescription, this.selectedProduct.fixedProductID)) {
          this.duplicateFoundUpdate = true;
          setTimeout(() => {
            this.duplicateFoundUpdate = false;
          }, 8000);
        }
        else {
          //get image
          let productImgB64 = this.selectedProduct.productPhoto;
          var formImage;
          if (this.changedImage) { 
            //form data makes the image a string with a fake url which I can't convert to B64 so I must get the actual value of the file input      
            const inputElement = document.getElementById('uProductPhoto') as HTMLInputElement;
            formImage = inputElement.files?.[0];
            productImgB64 = formImage ? await this.convertToBase64(formImage) : '' //convert to B64 if there's an image selected, otherwise, empty string
          }

          //put form data in VM
          let updatedProduct : FixedProductVM = {
            fixedProductID: this.selectedProduct.fixedProductID,
            qrCodeID: 0,
            qrCodeBytesB64: '',
            itemID: parseInt(formData.uItemID),
            sizeID: parseInt(formData.uSizeID),
            description: formData.uDescription,
            price: formData.uPrice,
            productPhotoB64: productImgB64,
            quantityOnHand: this.selectedProduct.quantityOnHand
          }

          console.log('form data', updatedProduct);

          this.dataService.UpdateFixedProduct(this.selectedProduct.fixedProductID, updatedProduct).subscribe(
            (result: any) => {
              console.log('Successfully updated product! ', result);
              this.getProductsPromise(); //refresh products list
              //reset form (kind of)
              this.changedImage = false;
              this.submitClicked = false;
              $('#updateFixedProduct').modal('hide');
            }
          );
        }
      }
      catch (error) {
        console.log('Error submitting form', error)
      }
    }
  }

  //--------------------DELETE REASON LOGIC----------------
  openDeleteModal(prod: TableFixedProductVM) {
    this.selectedProduct = prod;
    $('#deleteFixedProduct').modal('show');
  }

  deleteFixedProduct() {
    this.dataService.DeleteFixedProduct(this.selectedProduct.fixedProductID).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getProductsPromise(); //refresh products
        $('#deleteFixedProduct').modal('hide');
      }
    );    
  }

  //--------------------------------------------------------MULTI-PURPOSE METHODS--------------------------------------------------------
  changedCategory(crudAction: string) {
    this.categorySizes = []; //reset array
    this.categoryItems = [];

    //get category with index that matches value selected in select field in add/update form modal
    let index: number = -1;
    if (crudAction == 'add') {  //add modal
      index = this.categories.findIndex(cat => cat.categoryID === parseInt(this.selectedCatValue));
      //reset values for size and item dropdowns in case user had already selected something
      this.itemID?.setValue('NA');
      this.sizeID?.setValue('NA');
    }
    else if (crudAction == 'update') {  //update modal
      index = this.categories.findIndex(cat => cat.categoryID === parseInt(this.selectedCatValueUpdate));      
      //reset values for size and item dropdowns in case user had already selected something
      this.uSizeID?.setValue("NA");
      this.uItemID?.setValue('NA');
    }
    
    let cat = this.categories[index];

    //populate product item dropdown
    this.items.forEach(item => {
      if (cat.categoryID == item.categoryID) {
        this.categoryItems.push(item);
      }
    });

    //populate size dropdown
    for (let i = 0; i < this.sizes.length; i++) {
      let sizeStr: string = ''; //reset string

      if (cat.categoryID == this.sizes[i].categoryID) {
        //treat size like an array with the properties as values in the array but ignore categoryID, description, sizeID and any size that's = 0
        let sizeAsArray = Object.entries(this.sizes[i]).filter(([key, value]) => {
          return typeof value === 'number' && value > 0 && key !== 'categoryID' && key !== 'sizeID';
        });
  
        //concatenate the sizes into a string joined by 'x' '150x150x150'
        sizeStr = sizeAsArray.map(([key, value]) => value).join('x');
  
        //if it's empty, N/A
        if (sizeStr.trim() === '') {
          sizeStr = 'N/A';
        }

        //put in size dropdown array
        var catSize: any = {
          sizeID: this.sizes[i].sizeID,
          sizeString: sizeStr
        }

        this.categorySizes.push(catSize);
      }
    }
  }

  /*not yet sure how to handle the fact that angular says the description field isn't filled and thus won't fill the form if I concatenate
  the product description using the item and size. Atm, the only solution is to, after getting the product name and description entered for you,
  go backspace and then reenter the last character in description field*/
  changedItem(selected: any, crudAction: string) {
    //set description input value for add/update form modal
    if (crudAction == 'add')
    this.description?.setValue(selected.target[selected.target.selectedIndex].text);
    else
      this.uDescription?.setValue(selected.target[selected.target.selectedIndex].text);
  }

  changedSize(selected: any, crudAction: string) {
    //set description input value for add/update form modal
    if (crudAction == 'add')
      this.description?.setValue(this.description.value + ' ' + selected.target[selected.target.selectedIndex].text);
    else
      this.uDescription?.setValue(this.uDescription.value + ' ' + selected.target[selected.target.selectedIndex].text);
  }
  
  //function to display image name since I decided to be fancy with a custom input button
  showImageName(event: Event, crudAction: string): void {
    const inputElement = event.target as HTMLInputElement;
    const chosenFile = inputElement.files?.[0];
    //get image element from add/update form modal
    let imageElement: HTMLImageElement;
    let imageName: HTMLSpanElement;
    //create button to remove an uploaded pic
    let removeBtn: HTMLButtonElement = document.createElement('button');
    removeBtn.classList.add('remove-pic');
    removeBtn.setAttribute('title', 'Remove image')
    removeBtn.innerHTML = 'Remove';

    if (crudAction == 'add') {
      imageElement = document.getElementById('display-img') as HTMLImageElement;
      imageName = document.getElementById('imageName') as HTMLSpanElement;
      removeBtn.addEventListener('click', this.removeImage.bind(this, 'add'));
    }
    else { //update form
      imageElement = document.getElementById('display-img-update') as HTMLImageElement;
      imageName = document.getElementById('imageNameUpdate') as HTMLSpanElement;
      removeBtn.addEventListener('click', this.removeImage.bind(this, 'update'));
      this.changedImage = true;
    }

    if (chosenFile) { //if there is a file chosen
      const reader = new FileReader();
      reader.onload = (e) => {
        imageElement.src = e.target?.result as string; // Set the src attribute of the image element
      };
      reader.readAsDataURL(chosenFile);
      imageElement.alt = chosenFile.name;
      imageName.style.display = 'block';
      imageName.innerHTML = chosenFile.name; //display file name
      imageName.appendChild(removeBtn);      
    }
  }

  //convert image to B64
  convertToBase64(img: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        resolve(base64String.substring(base64String.indexOf(',') + 1)); // Resolve the promise with the base64 string; get rid of the data:image/... that auto appends itself to the B64 string
      };
      reader.onerror = (error) => {
        reject(error); // Reject the promise if an error occurs
      };
      reader.readAsDataURL(img);
    });
  }

  removeImage(crudAction: string) {
    //get image element, name span and file input from add/update form modal
    let imageElement: HTMLImageElement;
    let imageName: HTMLSpanElement;
    let imageInput : HTMLInputElement;

    if (crudAction == 'add') {
      imageInput = document.getElementById('productPhoto') as HTMLInputElement;
      imageElement = document.getElementById('display-img') as HTMLImageElement;
      imageName = document.getElementById('imageName') as HTMLSpanElement;
    }
    else { //update form
      imageInput = document.getElementById('uProductPhoto') as HTMLInputElement;
      imageElement = document.getElementById('display-img-update') as HTMLImageElement;
      imageName = document.getElementById('imageNameUpdate') as HTMLSpanElement;
      this.changedImage = true;
    }

    //remove image from file input
    imageInput.value = '';
    // Reset the image source and name
    imageElement.src = '';
    imageElement.alt = 'No image found. Please select a product image.';
    imageName.innerHTML = '';
  }

  //method to determine if a user tried to enter a fixed product with same description as existing fixed product
  checkDuplicateDescription(description: string, ID?: number): boolean {
    description = description.trim().toLowerCase(); //remove trailing white space so users can't cheat by adding space to string
    for (let i = 0; i < this.fixedProducts.length; i++) {
      //if description matches but they're updating a product, don't count it as a duplicate if they kept the product description the same
      if (this.fixedProducts[i].description.toLowerCase() == description && ID != this.fixedProducts[i].fixedProductID) {
        return true;
      }
    }
    return false;
  }

  //--------------------------------------------------------VALIDATION ERRORS LOGIC--------------------------------------------------------
  get description() { return this.addProductForm.get('description'); }
  get categoryID() { return this.addProductForm.get('categoryID'); }
  get itemID() { return this.addProductForm.get('itemID'); }
  get sizeID() { return this.addProductForm.get('sizeID'); }
  get price() { return this.addProductForm.get('price'); }
  //update form
  get uDescription() { return this.updateProductForm.get('uDescription'); }
  get uPrice() { return this.updateProductForm.get('uPrice'); }
  get uItemID() { return this.updateProductForm.get('uItemID'); }
  get uSizeID() { return this.updateProductForm.get('uSizeID'); }
}