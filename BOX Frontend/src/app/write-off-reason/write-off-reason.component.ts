import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WriteOffReason } from '../shared/write-off-reason';
declare var $:any;

@Component({
  selector: 'app-write-off-reason',
  templateUrl: './write-off-reason.component.html',
  styleUrls: ['./write-off-reason.component.css']
})
export class WriteOffReasonComponent {
  writeOffReasons: WriteOffReason[] = []; //used to store all reasons
  filteredReasons: WriteOffReason[] = []; //used to hold all the reasons that will be displayed to the user
  specificReason!: WriteOffReason; //used to get a specific reason
  reasonCount: number = -1; //keep track of how many reasons there are in the DB
  //forms
  addReasonForm: FormGroup;
  updateReasonForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false;
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
      this.loading = false;
    });
  }
  
  //--------------------SEARCH BAR LOGIC----------------
  searchReasons(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredReasons = []; //clear array
    for (let i = 0; i < this.writeOffReasons.length; i++) {
      let currentReasonDescripton: string = this.writeOffReasons[i].description.toLowerCase();
      if (currentReasonDescripton.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredReasons.push(this.writeOffReasons[i]);
      }
    }
    this.reasonCount = this.filteredReasons.length;
  }

  //--------------------ADD REASON LOGIC----------------
  addReason() {
    this.submitClicked = true;
    if (this.addReasonForm.valid) {
      const formData = this.addReasonForm.value;
      let newReason = {
        description: formData.description
      };
      console.log(newReason);
      
      this.dataService.AddWriteOffReason(newReason).subscribe(
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
    else {console.log('Invalid data entered')}
  }
  

  //--------------------DELETE REASON LOGIC----------------
  openDeleteModal(writeoffreasonId: number) {
    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteReason-' + writeoffreasonId;
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
    this.dataService.DeleteWriteOffReason(reasonId).subscribe(
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
    //get reason and display data
    this.dataService.GetWriteOffReason(reasonId).subscribe(
      (result) => {
        console.log('Write-off reason to update: ', result);        
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
    this.updateModal.nativeElement.id = 'updateReason-' + reasonId; //pass ID into modal ID so I can use it to update later
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
    if (this.updateReasonForm.valid) {
      //get write-off reason ID which I stored in modal ID
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
      this.dataService.UpdateWriteOffReason(reasonId, updatedReason).subscribe(
        (result: any) => {
          console.log('Updated reasons', result);
          this.getReasons(); //refresh item list
        },
        (error) => {
          console.error('Error updating reason:', error);
        }
      );

      this.closeUpdateModal();
    }
    
  }

  //---------------------------VALIDATION ERRORS LOGIC-----------------------
  get description() { return this.addReasonForm.get('description'); }
  get uDescription() { return this.updateReasonForm.get('uDescription'); }
  
}
