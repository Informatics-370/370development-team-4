import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomProductVM } from '../shared/custom-product-vm';
import { Item } from '../shared/item';
import { CostPriceFormulaVariables } from '../shared/cost-price-formula-variables';
declare var $:any;

@Component({
  selector: 'app-custom-prod',
  templateUrl: './custom-prod.component.html',
  styleUrls: ['./custom-prod.component.css']
})
export class CustomProdComponent {
  CustomProducts: CustomProductVM[] = []; //used to store all custom products
  items: Item[] = []; //store all items for view, search, update and delete
  variables: CostPriceFormulaVariables [] = []; //store all variables for cost price of custom products
  filteredCustomProducts: CustomProductVM[] = []; //used to hold all the custom products that will be displayed to the user
  customproductCount: number = -1; //keep track of how many custom products there are in the DB
  //forms

  //modals 

  //search functionality
  searchTerm: string = '';
  submitClicked = false;
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService/*  private formBuilder: FormBuilder */) {
    /* this.addReasonForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.updateReasonForm = this.formBuilder.group({
      uDescription: ['', Validators.required]
    }) */
  }

  ngOnInit(): void {
    this.getCustomProducts();
  }

  //view function

  getCustomProducts() { //get all custom products
    this.dataService.GetAllCustomProducts().subscribe((result: any[]) => {
      let allcustomproducts: any[] = result;
      this.filteredCustomProducts = []; //empty product array
      allcustomproducts.forEach((product) => {
        this.filteredCustomProducts.push(product);
      });
      
      this.CustomProducts = this.filteredCustomProducts; //store all the categories someplace before I search below
      this.customproductCount = this.filteredCustomProducts.length; //update the number of items

      console.log('All custom products array: ', this.filteredCustomProducts);
      this.loading = false;
    });
  }

  //search function
  searchCustomProducts(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredCustomProducts = []; //clear array
    for (let i = 0; i < this.CustomProducts.length; i++) {
      let currentcustomproductsearch: string = String(this.CustomProducts[i].customProductID + ' ' +
        this.CustomProducts[i].itemDescription + ' ' + 
        this.CustomProducts[i].width + 'mm x ' +
        this.CustomProducts[i].height + 'mm x ' +
        this.CustomProducts[i].length + 'mm').toLowerCase();
      if (currentcustomproductsearch.includes(this.searchTerm.toLowerCase())) {
        this.filteredCustomProducts.push(this.CustomProducts[i]);
      }
    }
    this.customproductCount = this.filteredCustomProducts.length; //update raw material count so message can be displayed if no reasons are found
    console.log(this.filteredCustomProducts);
  }
}
