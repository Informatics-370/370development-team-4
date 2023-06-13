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
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products
  filteredProducts: FixedProductVM[] = []; //used to hold all the fixed products that will be displayed to the user
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
      this.filteredProducts = products;
      this.fixedProducts = this.filteredProducts;
      console.log('All fixed products array:', this.filteredProducts);  

      this.formatProducts(); // Execute only after data has been retrieved from the DB otherwise error
      console.log('All data fetched successfully.');
    } catch (error) {
      console.error('An error occurred:', error);
      this.messageRow.innerHTML = 'An error occured while retrieving from the database. Please contact B.O.X. support services.';
    }
  }

  //put products in format to display in table
  formatProducts(): void {
    let item: Item;
    let category: CategoryVM;
    let size: Size;

    this.fixedProducts.forEach(currentProduct => {
      //get item description
      this.items.forEach(currentItem => {
        if (currentItem.itemID == currentProduct.itemID) {
          item = currentItem;

          //get category description, using the item found
          this.categories.forEach(currentCat => {
            if (currentItem.categoryID == currentCat.categoryID) {
              category = currentCat;
            }
          });
        }
      });
      console.log('Prod item: ', item, 'and product category: ', category);

      //get size

      //create new tablefixedproductVM and push to global array
      let tableProductVM: TableFixedProductVM = {
        fixedProductID: currentProduct.fixedProductID,
        qRCodeID: 0,
        qRCode: '',
        categoryID: category.categoryID,
        categoryDescription: category.categoryDescription,
        itemID: item.itemID,
        itemDescription: item.description,
        sizeID: 0,
        sizeString: '',
        description: currentProduct.description,
        price: currentProduct.price,
        productPhoto: ''
      };

      this.productCount = this.tableProducts.push(tableProductVM); //update product count; push method returns new length of the array
      console.log('Table product VM list', this.tableProducts);
    });

    if (this.productCount == 0)
      this.messageRow.innerHTML = 'No fixed products found. Please add a new product to the system.';
    else
      this.showMessage = false; //stop displaying loading message
  }
}