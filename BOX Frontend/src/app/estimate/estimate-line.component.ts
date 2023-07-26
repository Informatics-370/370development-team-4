import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { EstimateVM } from '../shared/estimate-vm';
import { EstimateLineVM } from '../shared/estimate-line-vm';
import { VATInclusiveEstimate } from '../shared/vat-inclusive-estimate-class';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-estimate-line',
  templateUrl: './estimate-line.component.html',
  styleUrls: ['./estimate-line.component.css'],
  providers: [CurrencyPipe]
})
export class EstimateLineComponent {
  estimates: VATInclusiveEstimate[] = []; //hold all estimates
  filteredEstimates: VATInclusiveEstimate[] = []; //estimates to show user
  selectedEstimate!: VATInclusiveEstimate; //specific estimate to show user
  negotiatedTotal = 0; //hold total after negotiations in global array
  fixedProducts: FixedProductVM[] = [];
  filteredFixedProducts: FixedProductVM[] = [];
  vat!: VAT;
  searchTerm: string = '';
  //display messages to user
  estimateCount = -1;
  loading = true;
  error: boolean = false;
  //forms logic
  addEstimateLineForm: FormGroup;
  selectedProductID = 'NA';
  selectedProduct: FixedProductVM | undefined;

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private currencyPipe: CurrencyPipe) {
    this.addEstimateLineForm = this.formBuilder.group({
      productID: [Validators.required],
      quantity: [1.00, Validators.required]
    });
  }

  ngOnInit() {
    this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      That's what the Promise.all method is supposed to be doing.
      get all products, categories, items and sizes and put in categories, items, sizes and products array*/
      const [allVAT, allProducts] = await Promise.all([
        getVATPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.vat = allVAT[0];
      this.filteredFixedProducts = allProducts;
      this.fixedProducts = this.filteredFixedProducts; //store all products someplace before I filter below
      console.log('All products: ', this.fixedProducts, 'and filtered products: ', this.filteredFixedProducts);

      await this.getEstimatesPromise();
    } catch (error) {
      this.estimateCount = -1;
      this.loading = false;
      this.error = true;
    }
  }

  //get estimates separately so I can update only estimates list when estimate is updated to save time
  async getEstimatesPromise(): Promise<any> {
    try {
      let allEstimates: EstimateVM[] = await lastValueFrom(this.dataService.GetAllEstimates().pipe(take(1)));
      this.filteredEstimates = [];

      allEstimates.forEach((currentEst: EstimateVM) => {
        let newEstimate: VATInclusiveEstimate = new VATInclusiveEstimate(currentEst, this.vat.percentage);
        this.filteredEstimates.push(newEstimate);
      });

      this.estimates = this.filteredEstimates; //store all the estimates someplace before I search below
      this.estimateCount = this.filteredEstimates.length; //update the number of estimates

      console.log('All estimates array: ', this.filteredEstimates);
      this.loading = false;

      return 'Successfully retrieved estimates from the database';
    } catch (error) {
      console.error('An error occurred while retrieving estimates: ' + error);
      throw new Error('An error occurred while retrieving estimates: ' + error);
    }
  }

  searchEstimates(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredEstimates = []; //clear array
    for (let i = 0; i < this.estimates.length; i++) {
      //concatenate all the estimate info in one variable so user can search using any of them
      let estInformation: string = String('EST' + this.estimates[i].estimateID + ' ' +
        this.estimates[i].customerFullName + ' ' +
        this.estimates[i].confirmedTotal + ' ' +
        this.estimates[i].estimateStatusDescription).toLowerCase();

      if (estInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredEstimates.push(this.estimates[i]);
      }
    }

    this.estimateCount = this.filteredEstimates.length; //update estimates count

    console.log('Search results:', this.filteredEstimates);
  }

  //-------------------UPDATE ESTIMATE DETAILS TABLE LOGIC-------------------
  async openUpdateEstimateModal(id: number) {
    //get estimate to show details of
    let theEstimate = await lastValueFrom(this.dataService.GetEstimate(id).pipe(take(1)));
    this.selectedEstimate = new VATInclusiveEstimate(theEstimate, this.vat.percentage);

    //set global negotiated total value
    this.negotiatedTotal = parseFloat(this.selectedEstimate.confirmedTotal.toFixed(2));
    this.filterProductDropdown(this.selectedEstimate); //filter product dropdown

    //show modal and close confirm edit modal if this function was called by closing that modal
    $('#confirmEdit').modal('hide');
    $('#editPrice').modal('show');
  }

  //filter products shown in dropdown to not include products currently in estimate; atm, this only accounts for fixed products
  filterProductDropdown(currentEstimate: VATInclusiveEstimate) {
    this.filteredFixedProducts = [];
    this.filteredFixedProducts = this.fixedProducts; //reset array
    console.log('All products: ', this.fixedProducts, 'and filtered products: ', this.filteredFixedProducts);

    //for each estimate line
    currentEstimate.estimate_Lines.forEach(estLine => {
      //find fixed product with matching ID
      console.log('est line: ', estLine);
      let toDelete = this.fixedProducts.find(prod => estLine.fixedProductID == prod.fixedProductID);
      console.log('Bout to delete: ', toDelete);

      //if product is found, delete it
      if (toDelete) this.filteredFixedProducts.splice(this.filteredFixedProducts.indexOf(toDelete));
    });
  }

  /* getVATInclusiveAmount(amount: number): number {
    let priceInclVAT = amount * (1 + this.vat.percentage / 100);
    return priceInclVAT;
  }

  getVATInclusiveTotal(est: EstimateVM): number {
    let totalInclVAT = 0;
    est.estimate_Lines.forEach(estimateLine => {
      totalInclVAT += estimateLine.fixedProductUnitPrice * (1 + this.vat.percentage / 100) * estimateLine.quantity;
    });

    return totalInclVAT;
  } */

  //changing product using dropdown should change the max value of the qty input field to be whatever is the product's qty on hand
  //this method handles that
  changedProduct() {
    this.selectedProduct = this.fixedProducts.find(fp => fp.fixedProductID == parseInt(this.selectedProductID));
  }

  addEstimateLine() {
    if (this.addEstimateLineForm.valid && this.selectedProductID != 'NA') {
      const formData = this.addEstimateLineForm.value;
      console.log(formData);

      let newRow: HTMLTableRowElement = document.createElement('tr');
      newRow.id = 'f-' + this.selectedProduct?.fixedProductID + '-' + formData.quantity;
      
      let newProductCell: HTMLTableCellElement = document.createElement('td');
      newProductCell.innerHTML = this.selectedProduct ? this.selectedProduct.description : '';
      newRow.appendChild(newProductCell);
      
      let newPriceCell: HTMLTableCellElement = document.createElement('td');
      let price = this.selectedProduct ? this.currencyPipe.transform(this.selectedProduct.price, 'R') : '0';
      newPriceCell.innerHTML = price ? price : '0';
      newRow.appendChild(newPriceCell);

      let newQtyCell: HTMLTableCellElement = document.createElement('td');
      newQtyCell.innerHTML = Math.floor(formData.quantity).toString();
      newRow.appendChild(newQtyCell);

      let newTotalCell: HTMLTableCellElement = document.createElement('td');
      let total = this.selectedProduct ? this.currencyPipe.transform(this.selectedProduct.price * formData.quantity, 'R') : '0';
      newTotalCell.innerHTML = total ? total : '0';
      newRow.appendChild(newTotalCell);

      document.getElementById('estimate-details-tbody')?.appendChild(newRow);
      console.log(newRow);
    }
  }

  //-------------------UPDATE ESTIMATE LOGIC-------------------
  updateEstimate() {

  }
}
