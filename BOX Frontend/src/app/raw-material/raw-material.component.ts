import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterialVM } from '../shared/rawMaterialVM';
declare var $: any;

@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.css']
})
export class RawMaterialComponent {
  rawmaterials: RawMaterialVM[] = []; //used to store all material
  filteredRawMaterials: RawMaterialVM[] = []; //used to hold all the materials that will be displayed to the user
  specificrawmaterial!: RawMaterialVM; //used to get a specific raw material
  rawmaterialCount: number = -1; //keep track of how many materials there are in the DB
  //forms
  addRawMaterialForm: FormGroup;
  updateRawMaterialForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addRawMaterialForm = this.formBuilder.group({
      description: ['', Validators.required]
    });

    this.updateRawMaterialForm = this.formBuilder.group({
      uDescription: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getRawMaterials();
  }

  getRawMaterials() { //get all raw materials
    this.dataService.GetAllRawMaterials().subscribe((result: any[]) => {
      let allmaterials: any[] = result;
      this.filteredRawMaterials = []; //empty item array
      allmaterials.forEach((material) => {
        this.filteredRawMaterials.push(material);
      });
      this.rawmaterials = this.filteredRawMaterials; //store all the categories someplace before I search below
      this.rawmaterialCount = this.filteredRawMaterials.length; //update the number of items

      console.log('All raw materials array: ', this.filteredRawMaterials);
      this.loading = false; //stop displaying loading message
    });
  }


  //--------------------SEARCH BAR LOGIC----------------
  searchRawMaterials(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredRawMaterials = []; //clear array
    for (let i = 0; i < this.rawmaterials.length; i++) {
      let currentReasonDescripton: string = this.rawmaterials[i].description.toLowerCase();
      if (currentReasonDescripton.includes(this.searchTerm.toLowerCase())) {
        this.filteredRawMaterials.push(this.rawmaterials[i]);
      }
    }
    this.rawmaterialCount = this.filteredRawMaterials.length; //update raw material count so message can be displayed if no reasons are found
    console.log(this.filteredRawMaterials);
  }

  //--------------------ADD RAW MATERIAL LOGIC----------------
  addRawMaterial() {
    this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
    if (this.addRawMaterialForm.valid) {
      try {
        const formData = this.addRawMaterialForm.value;
        let description = formData.description;

        this.dataService.AddRawMaterial(description).subscribe(
          (result: any) => {
            console.log('New raw material successfully created!', result);
            this.getRawMaterials(); //refresh list
          }
        );
      }
      catch (error) {
        console.log('Error submitting form', error)
      }
    }
    else {
      console.log('Invalid data');
    }
  }

  //--------------------DELETE RAW MATERIAL LOGIC----------------
  openDeleteModal(rawmaterialId: number) {
    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteRawMaterial-' + rawmaterialId; //store Id where I can access it again
    //Fade background when modal is open.
    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "block" };
    document.body.style.overflow = 'hidden'; //prevent scrolling web page body
  }

  closeDeleteModal() {
    //Close the modal manually
    this.deleteModal.nativeElement.classList.remove('show');
    this.deleteModal.nativeElement.style.display = 'none';
    //Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

  deleteRawMaterial() {
    //get reason ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let rawmaterialId = id.substring(id.indexOf('-') + 1);
    console.log(rawmaterialId);
    this.dataService.DeleteRawMaterial(rawmaterialId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getRawMaterials(); //refresh item list
      },
      (error) => {
        console.error('Error deleting raw material with ID ', rawmaterialId, error);
      }
    );

    this.closeDeleteModal();
  }

  //--------------------UPDATE RAW MATERIAL LOGIC----------------
  openUpdateModal(rawmaterialId: number) {
    //get item and display data
    this.dataService.GetRawMaterial(rawmaterialId).subscribe(
      (result) => {
        console.log('Raw material to update: ', result);
        this.updateRawMaterialForm.setValue({
          uDescription: result.description
        }); //display data;

        //Open the modal manually only after data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateRawMaterial-' + rawmaterialId; //pass item ID into modal ID so I can use it to update later
        //Fade background when modal is open.
        const backdrop = document.getElementById("backdrop");
        if (backdrop) { backdrop.style.display = "block" };
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
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

  updateRawMaterial() {
    this.submitClicked = true;
    if (this.updateRawMaterialForm.valid) {
      //get refund reason ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let rawmaterialId = id.substring(id.indexOf('-') + 1);
      console.log(rawmaterialId);

      //get form data
      const formValues = this.updateRawMaterialForm.value;
      let updatedmaterial = {
        description: formValues.uDescription
      };
      console.log(updatedmaterial);

      //update item
      this.dataService.UpdateRawMaterial(rawmaterialId, updatedmaterial.description).subscribe(
        (result: any) => {
          console.log('Updated raw materials', result);
          this.getRawMaterials(); //refresh item list
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
  get description() { return this.addRawMaterialForm.get('description'); }
  get uDescription() { return this.updateRawMaterialForm.get('uDescription'); }

}
