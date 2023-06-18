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
  specificProduct!: FixedProductVM; //used to get a specific product
  productCount: number = -1; //keep track of how many products there are in the DB
  //view product variables
  viewProduct!: TableFixedProductVM;

  //forms
  // addProductForm: FormGroup;
  // updateProductForm: FormGroup;
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

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    /* this.addProductForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.updateProductForm = this.formBuilder.group({
      uDescription: ['', Validators.required]
    }) */
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
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing. However, the console logs are executing in order, which raises questions.
      But that could just be because they're outside the Promise.all. IDC!!!!! I'm tired of trying to find alternatives for this. 
      And data is being retrieved faster that how I had it work before so I'm moving on with my life
      get all products, categories, items and sizes and put in categories, items, sizes and products array*/
      const [categories, items, sizes, products] = await Promise.all([
        getCategoriesPromise,
        getItemsPromise,
        getSizesPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.categories = categories;
      console.log('All categories array for fixed products:', this.categories);
      this.items = items;
      console.log('All product items for fixed products:', this.items);
      this.sizes = sizes;
      console.log('All sizes for fixed products:', this.sizes);
      this.fixedProducts = products;

      this.formatProducts(); // Execute only after data has been retrieved from the DB otherwise error
    } catch (error) {
      console.error('An error occurred:', error);
      this.messageRow.innerHTML = 'An error occured while retrieving from the database. Please contact B.O.X. support services.';
    }
  }

  //put products in format to display in table
  formatProducts(): void {
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
            if (i == sizeAsArr.length - 1 && sizeString == '')
              sizeString = 'N/A';
          }
        }
      });

      //trim() gets rid of trailing spaces e.g. turn '150 150 150 ' to '150 150 150'. replaceAll() turns '150 150 150' to '150x150x150'
      sizeString = sizeString.trim().replaceAll(' ', 'x');

      //get QR code and product photo

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

  //--------------------SEARCH BAR LOGIC----------------
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

  //--------------------VIEW SPECIFIC PRODUCT----------------
  openViewProduct(prod: TableFixedProductVM) {
    console.log(prod);
    this.viewProduct = prod;
    $('#viewProduct').modal('show');
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

}