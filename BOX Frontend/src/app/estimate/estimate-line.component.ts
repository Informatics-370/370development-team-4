import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { EstimateVM } from '../shared/estimate-vm';
import { EstimateLineVM } from '../shared/estimate-line-vm';
import { VATInclusiveEstimate } from '../shared/vat-inclusive-estimate-class';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-estimate-line',
  templateUrl: './estimate-line.component.html',
  styleUrls: ['./estimate-line.component.css']
})
export class EstimateLineComponent {
  estimates: VATInclusiveEstimate[] = []; //hold all estimates
  filteredEstimates: VATInclusiveEstimate[] = []; //estimates to show user
  selectedEstimate!: VATInclusiveEstimate; //specific estimate to show user
  negotiatedTotal = 0; //hold total after negotiations in global array
  vat!: VAT;
  searchTerm: string = '';
  //display messages to user
  estimateCount = -1;
  loading = true;
  error: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      That's what the Promise.all method is supposed to be doing.
      get all products, categories, items and sizes and put in categories, items, sizes and products array*/
      const [allVAT] = await Promise.all([
        getVATPromise
      ]);

      //put results from DB in global arrays
      this.vat = allVAT[0];

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
      let estInformation: string = String(this.estimates[i].estimateID + ' ' +
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

  async openUpdateEstimateModal(id: number) {
    let theEstimate = await lastValueFrom(this.dataService.GetEstimate(id).pipe(take(1)));
    this.selectedEstimate = new VATInclusiveEstimate(theEstimate, this.vat.percentage);
    console.log(this.selectedEstimate);
    this.negotiatedTotal = parseFloat(this.selectedEstimate.confirmedTotal.toFixed(2));
    $('#confirmEdit').modal('hide');
    $('#editPrice').modal('show');
  }

  getVATInclusiveAmount(amount: number): number { 
    let priceInclVAT = amount * (1 + this.vat.percentage/100);
    return priceInclVAT;
  }

  getVATInclusiveTotal(est: EstimateVM): number { 
    let totalInclVAT = 0;
    est.estimate_Lines.forEach(estimateLine => {
      totalInclVAT += estimateLine.fixedProductUnitPrice  * (1 + this.vat.percentage/100) * estimateLine.quantity;
    });

    return totalInclVAT;
  }

  updateEstimate() {
    
  }
}
