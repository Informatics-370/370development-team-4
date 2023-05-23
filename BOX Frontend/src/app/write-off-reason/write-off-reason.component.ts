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
  writeOffReasons: WriteOffReason[] = []; //used to store all reasons
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

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    
  }

  ngOnInit(): void {
    this.getReasons();
  }

  getReasons() { //get all write-off reasons
    this.dataService.GetWriteOffReasons().subscribe((result: any[]) => {
      let allReasons: any[] = result;
      this.filteredReasons = []; //empty reason array
      allReasons.forEach((reason) => {
        this.filteredReasons.push(reason);
      });
      
      this.writeOffReasons = this.filteredReasons; //store all the categories someplace before I search below
      this.reasonCount = this.filteredReasons.length; //update the number of items

      console.log('All write-off reasons array: ', this.filteredReasons);
    });
  }  
  
}
