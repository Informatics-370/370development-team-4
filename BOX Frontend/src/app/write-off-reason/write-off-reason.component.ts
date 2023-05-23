import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WriteOffReason } from '../shared/write-off-reason';

@Component({
  selector: 'app-write-off-reason',
  templateUrl: './write-off-reason.component.html',
  styleUrls: ['./write-off-reason.component.css']
})
export class WriteOffReasonComponent {
  wrireOffReasons: WriteOffReason[] = []; //used to store all reasons
  filteredReasons: WriteOffReason[] = []; //used to hold all the reasons that will be displayed to the user
  specificReason!: WriteOffReason; //used to get a specific reason
  reasonCount: number = this.filteredReasons.length; //keep track of how many reasons there are in the DB
  //forms
  // addReasonForm: FormGroup;
  // updateReasonForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';

  
}
