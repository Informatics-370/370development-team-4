import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { EstimateVM } from '../shared/estimate-vm';
import { EstimateLineVM } from '../shared/estimate-line-vm';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-estimate-line',
  templateUrl: './estimate-line.component.html',
  styleUrls: ['./estimate-line.component.css']
})
export class EstimateLineComponent {
  estimates: EstimateVM[] = []; //hold all estimates
  filteredEstimates: EstimateVM[] = []; //estimates to show user
  selectedEstimate!: EstimateVM; //specific estimate to show user
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
      //get vat
      let allVAT = await lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      this.vat = allVAT[0];

      this.dataService.GetAllEstimates().subscribe((result: any[]) => {
        let allEstimates: any[] = result;
        this.filteredEstimates = []; //empty array
        allEstimates.forEach((est) => {
          this.filteredEstimates.push(est);
        });
        
        this.estimates = this.filteredEstimates; //store all the estimates someplace before I search below
        this.estimateCount = this.filteredEstimates.length; //update the number of estimates
  
        console.log('All estimates array: ', this.filteredEstimates);
        this.loading = false;
      });
    } catch (error) {
      this.estimateCount = -1;
      this.loading = false;
      this.error = true;
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

  openUpdateEstimateModal(est: EstimateVM) {
    this.selectedEstimate = est;
    this.negotiatedTotal = this.selectedEstimate.confirmedTotal;
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

  /* redirectToEstimateDetails(estID: number) {
    //url is expecting estimate with id 2 to be 'est-2', so combine string into that
    let urlParameter = 'est-' + estID;
    this.router.navigate(['estimate-details', urlParameter]);
  } */
}
