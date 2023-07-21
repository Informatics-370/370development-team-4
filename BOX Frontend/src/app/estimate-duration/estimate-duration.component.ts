import { Component, ViewChild } from '@angular/core';
import { EstimateDuration } from '../shared/estimate-duration';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; 

@Component({
  selector: 'app-estimate-duration',
  templateUrl: './estimate-duration.component.html',
  styleUrls: ['./estimate-duration.component.css']
})
export class EstimateDurationComponent {
  estimateDurations: EstimateDuration[] = []; //used to store all estimate durations
  filteredDurations: EstimateDuration[] = []; //used to hold all the estimate durations that will be displayed to the user
  specificduration!: EstimateDuration; //used to get a specific estimate duration
  durationCount: number = -1; //keep track of how many estimate durations there are in the DB
  //forms
  addEstimateDurationForm: FormGroup;
  updateEstimateDurationForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addEstimateDurationForm = this.formBuilder.group({
      duration: [0, Validators.required]
    });

    this.updateEstimateDurationForm = this.formBuilder.group({
      uDuration: [0, Validators.required]
    })
  }

  ngOnInit(): void {
    this.getEstimateDurations();
  }

  getEstimateDurations() { //get all estimate durations
    this.dataService.GetEstimateDurations().subscribe((result: any[]) => {
      let allDurations: any[] = result;
      this.filteredDurations = []; //empty item array
      allDurations.forEach((duration) => {
        this.filteredDurations.push(duration);
      });
      this.estimateDurations = this.filteredDurations; //store all the durations someplace before searching below
      this.durationCount = this.filteredDurations.length; //update the number of items

      console.log('All estimate durations array: ', this.filteredDurations);
      this.loading = false; //stop displaying loading message
    });
}
  //--------------------SEARCH BAR LOGIC----------------
  searchDurations(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredDurations = []; //clear array
    for (let i = 0; i < this.estimateDurations.length; i++) {
      let currentEstimateDuration: number = this.estimateDurations[i].duration;
      if (currentEstimateDuration.toString().includes(this.searchTerm))
      {
        this.filteredDurations.push(this.estimateDurations[i]);
      }
    }
    this.durationCount = this.filteredDurations.length; //update duration count so message can be displayed if no durations are found
    console.log(this.filteredDurations);
  }

  //--------------------ADD ESTIMATE DURATION LOGIC----------------
  addEstimateDuration() {
    this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
    if (this.addEstimateDurationForm.valid) {
      const formData = this.addEstimateDurationForm.value;
      let newDuration = {
        duration: formData.duration
      };
      console.log(newDuration);
      
      this.dataService.AddEstimateDuration(newDuration).subscribe(
        (result: any) => {
          console.log('New duration!', result);

          this.getEstimateDurations(); //refresh item list
          this.addEstimateDurationForm.reset();
          this.submitClicked = false; //reset submission status
          $('#addDuration').modal('hide');
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

  //--------------------DELETE ESTIMATE DURATION LOGIC----------------
  openDeleteModal(estimatedurationId: number) {
    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteDuration-' + estimatedurationId; //store Id where I can access it again
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

  deleteDuration() {
    //get duration ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let durationId = id.substring(id.indexOf('-') + 1);
    console.log(durationId);
    this.dataService.DeleteEstimateDuration(durationId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getEstimateDurations(); //refresh item list
      },
      (error) => {
        console.error('Error deleting estimate duration with ID ', durationId, error);
      }
    );

    this.closeDeleteModal();
  }

  //--------------------UPDATE ESTIMATE DURATION LOGIC----------------
  openUpdateModal(durationId: number) {
    //get item and display data
    this.dataService.GetEstimateDuration(durationId).subscribe(
      (result) => {
        console.log('Estimate duration to update: ', result);        
        this.updateEstimateDurationForm.setValue({          
          uDuration: result.duration
        }); //display data;
      },
      (error) => {
        console.error(error);
      }
    );

    //Open the modal manually
    this.updateModal.nativeElement.classList.add('show');
    this.updateModal.nativeElement.style.display = 'block';
    this.updateModal.nativeElement.id = 'updateDuration-' + durationId; //pass item ID into modal ID so I can use it to update later
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

  updateDuration() {
    this.submitClicked = true;
    if (this.updateEstimateDurationForm.valid) {
      //get estimate duration ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let durationId = id.substring(id.indexOf('-') + 1);
      console.log(durationId);

      //get form data
      const formValues = this.updateEstimateDurationForm.value;
      let updatedDuration = {        
        duration: formValues.uDuration
      };
      console.log(updatedDuration);

      //update item
      this.dataService.UpdateEstimateDuration(durationId, updatedDuration).subscribe(
        (result: any) => {
          console.log('Updated durations', result);
          this.getEstimateDurations(); //refresh list
          this.submitClicked = false; //reset submission status
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
  get duration() { return this.addEstimateDurationForm.get('duration'); }
  get uDuration() { return this.updateEstimateDurationForm.get('uDuration'); }

}
