import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { CategoryVM } from '../shared/category-vm';
import { Size } from '../shared/Size';
import { Item } from '../shared/item';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { TableFixedProductVM } from '../shared/table-fixed-product-vm';
import { Category } from '../shared/category';
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
  sizes: Size[] = []; //store all sizes for view, search, update and delete
  categorySizes: any[] = []; //store all sizes associated with a specific category
  categoryItems: Item[] = []; //store all product items associated with a specific category
  specificProduct!: FixedProductVM; //used to get a specific product
  productCount: number = -1; //keep track of how many products there are in the DB
  //view product variables
  viewProduct!: TableFixedProductVM;

  //forms
  addProductForm: FormGroup;
  updateProductForm: FormGroup;
  //select elements value
  public selectedCatValue = 'NA';
  public selectedItemValue = 'NA';
  public selectedSizeValue = 'NA';
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;

  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  search = false; //used to show message if no search results found

  //error, loading and other messages
  showMessage = true; //show messages to user in message row like loading message, error message, etc.
  messageRow!: HTMLTableCellElement; //it's called messageRow, but it's just a cell that spans a row
  duplicateFound = false; //boolean to display error message if user tries to create a product with duplicate description

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
      uDescription: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getDataFromDB();
  }

  ngAfterViewInit(): void {
    this.messageRow = document.getElementById('message') as HTMLTableCellElement; //get message row only after view has been intialised and there's a message row to get
  }

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
      this.messageRow.innerHTML = 'An error occured while retrieving from the database. Please contact B.O.X. support services.';
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
      this.sizes.forEach(currentSize => {
        if (currentSize.sizeID == currentProduct.sizeID) {
          //treat currentSize like an array with the properties as values in the array
          let sizeAsArr = Object.entries(currentSize);
          //description is the last property in the size object and sizeID is the first property; I don't want to use them, only the sizes
          for (let i = 1; i < sizeAsArr.length - 1; i++) {
            if (sizeAsArr[i][1] > 0) {
              sizeString += sizeAsArr[i][1] + ' ';
            }

            //if no sizes are greater than 0, i.e. looped through all the properties that are sizes and string is still empty, make it NA
            if (i == sizeAsArr.length - 2 && sizeString == '')
              sizeString = 'N/A';
          }
        }
      });

      //trim() gets rid of trailing spaces e.g. turn '150 150 150 ' to '150 150 150'. replaceAll() turns '150 150 150' to '150x150x150'
      sizeString = sizeString.trim().replaceAll(' ', 'x');

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
    this.productCount = this.tableProducts.length; //update product count

    if (this.productCount == 0)
      this.messageRow.innerHTML = 'No fixed products found. Please add a new product to the system.';
    else
      this.showMessage = false; //stop displaying loading message
  }

  //--------------------------------------------------------SEARCH BAR LOGIC--------------------------------------------------------
  searchProducts(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredTableProducts = []; //clear array
    for (let i = 0; i < this.tableProducts.length; i++) {
      //concatenate all the product info in one variable so user can search using any of them even if they aren't displayed in the table
      let prodInformation: string = String(this.tableProducts[i].categoryDescription +
        this.tableProducts[i].itemDescription +
        this.tableProducts[i].sizeString +
        this.tableProducts[i].description +
        this.tableProducts[i].price).toLowerCase();

      if (prodInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredTableProducts.push(this.tableProducts[i]);
      }
    }

    this.productCount = this.filteredTableProducts.length; //update product count

    if (this.productCount == 0)
      this.search = true;
    else
      this.search = false;

    console.log('Search results:', this.filteredTableProducts);
  }

  //--------------------------------------------------------VIEW SPECIFIC PRODUCT LOGIC--------------------------------------------------------
  openViewProduct(prod: TableFixedProductVM) {
    this.viewProduct = prod;
    $('#viewFixedProduct').modal('show');
  }

  //Download QR code as image
  downloadQRCodeAsImage() {
    var arrayBuffer = this.B64ToArrayBuffer(this.viewProduct.qRCodeB64)
    const blob = new Blob([arrayBuffer], { type: 'image/png' });

    //Create link; apparently, I need this even though I have a download button
    const QRCodeImage = document.createElement('a');
    QRCodeImage.href = URL.createObjectURL(blob);
    QRCodeImage.download = this.viewProduct.description + ' QR code';
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
  changedCategory() {
    this.categorySizes = []; //reset array
    this.categoryItems = [];

    //get category with index that matches value selected in select
    let index = this.categories.findIndex(cat => cat.categoryID === parseInt(this.selectedCatValue));
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

      if (cat.categoryDescription == this.sizes[i].description) {
        //treat size like an array with the properties as values in the array
        let sizeAsArray = Object.entries(this.sizes[i]);
        //description is the last property in the size object and sizeID is the first property; don't use them, only the sizes
        for (let j = 1; j < sizeAsArray.length - 1; j++) {
          if (sizeAsArray[j][1] > 0) {
            sizeStr += sizeAsArray[j][1] + ' ';
          }

          //if no sizes are greater than 0, i.e. looped through all the properties that are sizes and string is still empty, N/A
          if (j == sizeAsArray.length - 2 && sizeStr == '')
            sizeStr = 'N/A';
        }

        sizeStr = sizeStr.trim().replaceAll(' ', 'x'); //turn '150 150 150 ' to '150 150 150' and then to '150x150x150'

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
  changedItem() {
    var descriptionInput = document.getElementById('description') as HTMLInputElement; //get description input
    //get selected product item
    let i = this.categoryItems.findIndex(item => item.itemID === parseInt(this.selectedItemValue));
    descriptionInput.value += this.categoryItems[i].description;
  }

  changedSize() {
    var descriptionInput = document.getElementById('description') as HTMLInputElement; //get description input
    //get selected size
    let i = this.categorySizes.findIndex(catSize => catSize.sizeID === parseInt(this.selectedSizeValue));
    descriptionInput.value += ' ' + this.categorySizes[i].sizeString;
  }

  async addFixedProduct() {
    this.submitClicked = true;
    if (this.addProductForm.valid) {
      try {
        //get form data
        const formData = this.addProductForm.value;

        //form data makes the image a string with a fake url which I can't convert to B64 so I must get the actual value of the file input      
        const inputElement = document.getElementById('productPhoto') as HTMLInputElement;
        const formImage = inputElement.files?.[0];

        let newProduct: FixedProductVM = {
          fixedProductID: 0,
          qrCodeID: 0,
          qrCodeBytesB64: '',
          itemID: formData.itemID,
          sizeID: formData.sizeID,
          description: formData.description,
          price: formData.price,
          quantityOnHand: 0,
          productPhotoB64: formImage ? await this.convertToBase64(formImage) : '' //convert to B64 if there's an image selected, otherwise, empty string
        }
        console.log(newProduct);

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
      catch (error) {
        console.log('Error submitting form', error)
      }      
    }
  }

  //--------------------------------------------------------UPDATE PRODUCT LOGIC--------------------------------------------------------
  openUpdateModal(prod: TableFixedProductVM) {
    //get product and display data
    console.log(prod);

    $('#updateFixedProduct').modal('show');
    /* this.dataService.GetItem(itemId).subscribe(
      (result) => {
        console.log('Item to update: ', result);        
        this.updateItemForm.setValue({
          uCategoryID: result.categoryID,
          uItemDescription: result.description
        }); //display data; Reactive forms are so powerful. All the item data passed with one method

        //Open the modal manually only after the data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateItem-' + itemId; //pass item ID into modal ID so I can use it to update later
        //Fade background when modal is open.
        const backdrop = document.getElementById("backdrop");
        if (backdrop) {backdrop.style.display = "block"};
        document.body.style.overflow = 'hidden'; //prevent scrolling web page body
      },
      (error) => {
        console.error(error);
      }
    ); */
  }

  //--------------------------------------------------------MULTI-PURPOSE METHODS--------------------------------------------------------
  //function to display image name since I decided to be fancy with a custom input button
  showImageName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const chosenFile = inputElement.files?.[0];
    let imageElement = document.getElementById('display-img') as HTMLImageElement;
    let imgIcon = document.getElementById('no-img');

    if (chosenFile) { //if there is a file chosen
      const reader = new FileReader();
      reader.onload = (e) => {
        imageElement.src = e.target?.result as string; // Set the src attribute of the image element
      };
      reader.readAsDataURL(chosenFile);
      imageElement.alt = chosenFile.name;

      if (imgIcon) {
        imgIcon.style.display = "none"; //hide the font awesome icon that shows that no image was selected
      }

      document.getElementById('imageName')!.innerHTML = '<br/>' + chosenFile.name; //display file name
    }
    else {
      // Reset the image source and name
      imageElement.src = '';
      imageElement.alt = '';
      document.getElementById('imageName')!.innerHTML = 'No image chosen';
      if (imgIcon) {
        imgIcon.style.display = "block"; //show the font awesome icon that shows that no image was selected
      }
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
  //method to determine if a user tried to enter a new category with same description
  checkDuplicateDescription(description: string): boolean {
    description = description.trim().toLowerCase(); //remove trailing white space so users can't cheat by adding space to string
    for (let i = 0; i < this.categories.length; i++) {      
      if (this.categories[i].categoryDescription.toLowerCase() == description) {
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
  /*get uDescription() { return this.updateProductForm.get('uDescription'); }*/
}