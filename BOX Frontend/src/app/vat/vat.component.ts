import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; 
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.css']
})
export class VatComponent {
  VATs: VAT[] = []; //used to store all VAT
  filteredVATs: VAT[] = []; //used to hold all the VAT that will be displayed to the user
  specificVAT!: VAT; //used to get a specific VAT
  vatCount: number = -1; //keep track of how many VAT there are in the DB
  //forms
  addVATForm: FormGroup;
  updateVATForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addVATForm = this.formBuilder.group({
      percentage: [1, Validators.required]
    });

    this.updateVATForm = this.formBuilder.group({
      uPercentage: [1, Validators.required]
    })
  }

  ngOnInit(): void {
    this.getAllVAT();
  }

  getAllVAT() { //get all VAT
    this.dataService.GetAllVAT().subscribe((result: any[]) => {
      let allVAT: any[] = result;
      this.filteredVATs = []; //empty VAT array
      allVAT.forEach((vat) => {
        let vatFromBackend: VAT = {
          vatID : vat.vatID,
          percentage: vat.percentage,
          date: new Date(vat.date)
        }
        this.filteredVATs.push(vatFromBackend);
      });
      this.VATs = this.filteredVATs; //store all the vat someplace before I search below
      this.vatCount = this.filteredVATs.length; //update the number of vat

      console.log('All vat array: ', this.filteredVATs);
      this.loading = false; //stop displaying loading message
    });
  }
  
  //--------------------SEARCH BAR LOGIC----------------
  searchVAT(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredVATs = []; //clear array
    for (let i = 0; i < this.VATs.length; i++) {
      let currentVAT: string = String(this.VATs[i].percentage);
      if (currentVAT.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredVATs.push(this.VATs[i]);
      }
    }
    this.vatCount = this.filteredVATs.length; //update VAT count so message can be displayed if no reasons are found
    console.log(this.filteredVATs);
  }

  //--------------------ADD VAT LOGIC----------------
  addVAT() {
    this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
    if (this.addVATForm.valid) {
     const formData = this.addVATForm.value;
      let newVAT: VAT = {
        vatID: 0,
        percentage: Math.floor(formData.percentage),
        date: new Date(Date.now())
      };
      
      this.dataService.AddVAT(newVAT).subscribe(
        (result: any) => {
          console.log('New VAT!', result);

          this.getAllVAT(); //refresh VAT list
          this.addVATForm.reset();
          this.submitClicked = false; //reset submission status
          $('#addVAT').modal('hide');
        }
      );
    }
    else {
      console.log('Invalid data');
    }
  }

  //--------------------UPDATE VAT LOGIC----------------
  /* openUpdateModal(vatId: number) {
    //get vat and display data
    this.dataService.GetVAT(vatId).subscribe(
      (result) => {
        console.log('VAT to update: ', result);        
        this.updateVATForm.setValue({          
          uPercentage: result.percentage
        }); //display data;

        //Open the modal manually after data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateVAT-' + vatId; //pass VAT ID into modal ID so I can use it to update later
        //Fade background when modal is open.
        const backdrop = document.getElementById("backdrop");
        if (backdrop) {backdrop.style.display = "block"};
        document.body.style.overflow = 'hidden'; //prevent scrolling web page body
      },
      (error) => {
        console.error(error);
      }
    );
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

  updateVAT() {
    this.submitClicked = true;
    if (this.updateVATForm.valid) {
      //get VAT ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let vatId = id.substring(id.indexOf('-') + 1);
      console.log(vatId);

      //get form data
      const formValues = this.updateVATForm.value;
      let updatedVAT: VAT = {
        vatID: 0,    
        percentage: Math.floor(formValues.uPercentage)
      };

      console.log(updatedVAT);

      //update item
      this.dataService.UpdateVAT(vatId, updatedVAT).subscribe(
        (result: any) => {
          console.log('Updated VAT', result);
          this.getAllVAT(); //refresh VAT list
          this.submitClicked = false; //reset submission status
        }
      );

      this.closeUpdateModal();
    }
    
  }
  

  //--------------------DELETE VAT LOGIC----------------
  openDeleteModal(vatId : number) {
    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteVAT-' + vatId; //store Id where I can access it again
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

  deleteVAT() {
    //get VAT ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let vatId = id.substring(id.indexOf('-') + 1);
    console.log(vatId);
    this.dataService.DeleteVAT(vatId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getAllVAT(); //refresh VAT list
      },
      (error) => {
        console.error('Error deleting VAT with ID ', vatId, error);
      }
    );

    this.closeDeleteModal();
  } */

  //---------------------------VALIDATION ERRORS LOGIC-----------------------
  //methods to show validation error messages on reactive forms. NT that the form will not submit if fields are invalid whether or not 
  //the folowing methods are present. This is just to improve user experience
  get percentage() { return this.addVATForm.get('percentage'); }
  get uPercentage() { return this.updateVATForm.get('uPercentage'); }
}

