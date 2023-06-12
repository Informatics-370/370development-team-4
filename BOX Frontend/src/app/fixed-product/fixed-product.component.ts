import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    /* this.addProductForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.updateProductForm = this.formBuilder.group({
      uDescription: ['', Validators.required]
    }) */
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProductItems();
    this.getSizes();
    this.getProducts();
  }

  //put products in format to display in table
  formatProducts(): void {

  }

  getProducts() { //get all fixed products
    this.dataService.GetAllFixedProducts().subscribe((result: any[]) => {
      let allProducts: any[] = result;
      this.filteredProducts = []; //empty products array
      allProducts.forEach((fixedProd) => {
        this.filteredProducts.push(fixedProd);
      });
      this.fixedProducts = this.filteredProducts; //store all the products someplace before I search below
      this.productCount = this.filteredProducts.length; //update the number of products

      console.log('All fixed products array: ', this.filteredProducts);
      this.loading = false; //stop displaying loading message
    });
  }

  //get all categories for view, search, create and update modals
  getCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      let allCategories: any[] = result;
      this.categories = []; //empty array
      allCategories.forEach((category) => {
        this.categories.push(category);
      });

      console.log('All categories array for fixed products: ', this.categories);
    });
  }

  //get all product items for view, search, create and update modals
  getProductItems() {
    this.dataService.GetItems().subscribe((result: any[]) => {
      let allItems: any[] = result;
      this.items = []; //empty array
      allItems.forEach((item) => {
        this.items.push(item);
      });

      console.log('All product items for fixed products: ', this.items);
    });
  }

  //get all sizes for view, search, create and update modals
  getSizes() {
    this.dataService.GetSizes().subscribe((result: any[]) => {
      let allSizes: any[] = result;
      this.sizes = []; //empty array
      allSizes.forEach((size) => {
        this.sizes.push(size);
      });

      console.log('All sizes for fixed products: ', this.sizes);
    });
  }
}