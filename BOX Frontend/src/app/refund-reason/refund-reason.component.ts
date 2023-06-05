import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefundReason } from '../shared/refund-reason';
declare var $: any; 

@Component({
  selector: 'app-refund-reason',
  templateUrl: './refund-reason.component.html',
  styleUrls: ['./refund-reason.component.css']
})
export class RefundReasonComponent {
  refundReasons: RefundReason[] = []; //used to store all reasons
  filteredReasons: RefundReason[] = []; //used to hold all the reasons that will be displayed to the user
  specificReason!: RefundReason; //used to get a specific reason
  reasonCount: number = -1; //keep track of how many reasons there are in the DB
  //forms
  addReasonForm: FormGroup;
  updateReasonForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addReasonForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.updateReasonForm = this.formBuilder.group({
      uDescription: ['', Validators.required]
    })
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
      this.loading = false; //stop displaying loading message
    });
  }
  
  //--------------------SEARCH BAR LOGIC----------------
  searchReasons(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredReasons = []; //clear array
    for (let i = 0; i < this.refundReasons.length; i++) {
      let currentReasonDescripton: string = this.refundReasons[i].description.toLowerCase();
      if (currentReasonDescripton.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredReasons.push(this.refundReasons[i]);
      }
    }
    this.reasonCount = this.filteredReasons.length; //update reason count so message can be displayed if no reasons are found
    console.log(this.filteredReasons);
  }

  //--------------------ADD REASON LOGIC----------------
  addReason() {
    this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
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
          this.submitClicked = false; //reset submission status
          $('#addReason').modal('hide');
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    }
    else {
      console.log('Invalid data');
    }
  }
  

  //--------------------DELETE REASON LOGIC----------------
  openDeleteModal(customerrefundreasonId: number) {
    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteReason-' + customerrefundreasonId; //store Id where I can access it again
    //Fade background when modal is open.
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "block"};
    document.body.style.overflow = 'hidden'; //prevent scrolling web page body
  }

  closeDeleteModal() {
    //Close the modal manually
    this.deleteModal.nativeElement.classList.remove('show');
    this.deleteModal.nativeElement.style.display = 'none';
    //Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "none"};
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

  deleteReason() {
    //get reason ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let reasonId = id.substring(id.indexOf('-') + 1);
    console.log(reasonId);
    this.dataService.DeleteRefundReason(reasonId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getReasons(); //refresh item list
      },
      (error) => {
        console.error('Error deleting reason with ID ', reasonId, error);
      }
    );

    this.closeDeleteModal();
  }

  //--------------------UPDATE REASON LOGIC----------------
  openUpdateModal(reasonId: number) {
    //get item and display data
    this.dataService.GetRefundReason(reasonId).subscribe(
      (result) => {
        console.log('Refund reason to update: ', result);        
        this.updateReasonForm.setValue({          
          uDescription: result.description
        }); //display data;
      },
      (error) => {
        console.error(error);
      }
    );

    //Open the modal manually
    this.updateModal.nativeElement.classList.add('show');
    this.updateModal.nativeElement.style.display = 'block';
    this.updateModal.nativeElement.id = 'updateReason-' + reasonId; //pass item ID into modal ID so I can use it to update later
    //Fade background when modal is open.
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "block"};
    document.body.style.overflow = 'hidden'; //prevent scrolling web page body
  }

  closeUpdateModal() {
    //Close the modal manually
    this.updateModal.nativeElement.classList.remove('show');
    this.updateModal.nativeElement.style.display = 'none';
    //Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "none"};
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

  updateReason() {
    this.submitClicked = true;
    if (this.updateReasonForm.valid) {
      //get refund reason ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let reasonId = id.substring(id.indexOf('-') + 1);
      console.log(reasonId);

      //get form data
      const formValues = this.updateReasonForm.value;
      let updatedReason = {        
        description: formValues.uDescription
      };
      console.log(updatedReason);

      //update item
      this.dataService.UpdateRefundReason(reasonId, updatedReason).subscribe(
        (result: any) => {
          console.log('Updated reasons', result);
          this.getReasons(); //refresh item list
          this.submitClicked = false; //rest submission status
        },
        (error) => {
          console.error('Error updating items:', error);
        }
      );

      this.closeUpdateModal();
    }
    
  }

  //---------------------------VALIDATION ERRORS LOGIC-----------------------
  //methods to show validation error messages on reactive forms. NT that the form will not submit if fields are invalid whether or not 
  //the folowing methods are present. This is just to improve user experience
  get description() { return this.addReasonForm.get('description'); }
  get uDescription() { return this.updateReasonForm.get('uDescription'); }

}
