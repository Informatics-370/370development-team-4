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
  //forms
  // addProductForm: FormGroup;
  // updateProductForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads
  showMessage = true; //show messages to user in message row
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
      console.log('All fixed products array:', this.fixedProducts);  

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
    let sizeString: string = '';

    this.fixedProducts.forEach(currentProduct => {
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

      //get size
      this.sizes.forEach(currentSize => {
        if (currentSize.sizeID == currentProduct.sizeID) {
          /*concatenate size string logic; I could have achieved this with 7 if statements and no extra variables buuuuuuuuut
          I found an article that explains how to loop through the properties of the size object like it's an array:
          refer to this article: https://www.freecodecamp.org/news/how-to-iterate-over-objects-in-javascript/*/

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
      console.log('size string:', sizeString);
      //trim() gets rid of trailing spaces e.g. turn '150 150 150 ' to '150 150 150'. replaceAll() turns '150 150 150' to '150x150x150'
      sizeString = sizeString.trim().replaceAll(' ', 'x');

      //create new tablefixedproductVM and push to global array
      let tableProductVM: TableFixedProductVM = {
        fixedProductID: currentProduct.fixedProductID,
        qRCodeID: currentProduct.qRCodeID,
        qRCode: '',
        categoryID: category.categoryID,
        categoryDescription: category.categoryDescription,
        itemID: currentProduct.itemID,
        itemDescription: item.description,
        sizeID: currentProduct.sizeID,
        sizeString: sizeString,
        description: currentProduct.description,
        price: currentProduct.price,
        productPhoto: ''
      };

      this.filteredTableProducts.push(tableProductVM);
      console.log('Table product VM list', this.tableProducts);
    });

    this.tableProducts = this.filteredTableProducts; //store all the products someplace before I search below
    this.productCount = this.tableProducts.length; //update product count

    if (this.productCount == 0)
      this.messageRow.innerHTML = 'No fixed products found. Please add a new product to the system.';
    else
      this.showMessage = false; //stop displaying loading message
  }
}