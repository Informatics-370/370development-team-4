import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent {
  allVAT: VAT[] = []; //used to store all VAT
  filteredVATs: VAT[] = []; //used to hold all the VAT that will be displayed to the user
  specificVAT!: VAT; //used to get a specific VAT
  VATCount: number = this.filteredVATs.length; //keep track of how many VAT there are in the DB
  //forms
  // addVATForm: FormGroup;
  // updateVATForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    // this.addReasonForm = this.formBuilder.group({
    //   description: ['', Validators.required]
    // });

    // this.updateReasonForm = this.formBuilder.group({
    //   uDescription: ['', Validators.required]
    // })
  }

  ngOnInit(): void {
    this.getVATs();
  }

  getVATs() { //get all VAT
    this.dataService.GetAllVAT().subscribe((result: any[]) => {
      let VATs: any[] = result;
      this.filteredVATs = []; //empty VAT array
      VATs.forEach((vat) => {
        this.filteredVATs.push(vat);
      });
      
      this.allVAT = this.filteredVATs; //store all the categories someplace before I search below
      this.VATCount = this.filteredVATs.length; //update the number of items

      console.log('All VAT array: ', this.filteredVATs);
    });
  }
}
