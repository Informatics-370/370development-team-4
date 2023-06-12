import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; 
import { Category } from '../shared/category';
import { Size } from '../shared/Size';
import { Item } from '../shared/item';
import { FixedProductVM } from '../shared/fixed-product-vm';

@Component({
  selector: 'app-fixed-product',
  templateUrl: './fixed-product.component.html',
  styleUrls: ['./fixed-product.component.css']
})
export class FixedProductComponent {
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products
  filteredProducts: FixedProductVM[] = []; //used to hold all the fixed products that will be displayed to the user
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
    this.getProducts();
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
}
