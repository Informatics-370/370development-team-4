import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { Route, Router } from '@angular/router';
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
  vat!: VAT;
  searchTerm: string = '';
  //display messages to user
  estimateCount = -1;
  loading = true;
  error: boolean = false;

  constructor(private router: Router, private dataService: DataService) {}

  ngOnInit() {
    this.getEstimates();
  }

  getEstimates() {
    try {
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
}
