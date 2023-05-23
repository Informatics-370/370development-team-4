import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefundReason } from '../shared/refund-reason';

@Component({
  selector: 'app-refund-reason',
  templateUrl: './refund-reason.component.html',
  styleUrls: ['./refund-reason.component.css']
})
export class RefundReasonComponent {
  refundReasons: RefundReason[] = []; //used to store all reasons
  filteredReasons: RefundReason[] = []; //used to hold all the reasons that will be displayed to the user
  specificReason!: RefundReason; //used to get a specific reason
  reasonCount: number = this.filteredReasons.length; //keep track of how many reasons there are in the DB
  //forms
  // addReasonForm: FormGroup;
  // updateReasonForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    this.getReasons();
  }

  getReasons() { //get all refund reasons
    this.dataService.GetRefundReasons().subscribe((result: any[]) => {
      let allReasons: any[] = result;
      this.filteredReasons = []; //empty item array
      allReasons.forEach((reason) => {
        this.filteredReasons.push(reason);
      });
      
      this.refundReasons = this.filteredReasons; //store all the categories someplace before I search below
      this.reasonCount = this.filteredReasons.length; //update the number of items

      console.log('All items array: ', this.filteredReasons);
    });
  }

}
