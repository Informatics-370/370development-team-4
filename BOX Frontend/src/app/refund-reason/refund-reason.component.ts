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
  addReasonForm: FormGroup;
  // updateReasonForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addReasonForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
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

      console.log('All refund reasons array: ', this.filteredReasons);
    });
  }
  
  //--------------------SEARCH BAR LOGIC----------------
  searchReasons(event: Event) {
    event.preventDefault();
    this.filteredReasons = []; //clear array
    for (let i = 0; i < this.refundReasons.length; i++) {
      let currentReasonDescripton: string = this.refundReasons[i].description.toLowerCase();
      if (currentReasonDescripton.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredReasons.push(this.refundReasons[i]);
      }
      console.log(this.filteredReasons);
    }
  }

  //--------------------ADD REASON LOGIC----------------
  addReason() {
    if (this.addReasonForm.valid) {
      const formData = this.addReasonForm.value;
      let newReason = {
        description: formData.description
      };
      console.log(newReason);
      
      this.dataService.AddReason(newReason).subscribe(
        (result: any) => {
          console.log('New reason!', result);

          this.getReasons(); //refresh item list
          this.addReasonForm.reset();
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    }
    else {console.log('Invalid data')}
  }

}
