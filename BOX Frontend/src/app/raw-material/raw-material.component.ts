import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterial } from '../shared/rawMaterial';
import { rmVM } from '../shared/rawMaterialVM';


@Component({
  selector: 'app-raw-material',
  templateUrl: './raw-material.component.html',
  styleUrls: ['./raw-material.component.css']
})
export class RawMaterialComponent {
  rawMaterial: RawMaterial[] = [];
  filteredRawMaterial: RawMaterial[] = [];
  specificRawMaterial!: rmVM;

  rawMaterialCount: number = this.filteredRawMaterial.length;
  addRawMaterialForm: FormGroup;
  updateRawMaterialForm!: FormGroup;

  @ViewChild('addModal') addModal: any;
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;

  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder)
  {
    this.addRawMaterialForm = this.formBuilder.group({
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRawMaterials();    
  }

  getRawMaterials() {
    this.dataService.GetAllRawMaterials().subscribe((result: any[]) => {
      let allRawMaterials: any[] = result;
      this.filteredRawMaterial = []; 
      allRawMaterials.forEach((rawMaterial) => {
        this.filteredRawMaterial.push(rawMaterial);
      });

      this.rawMaterial = this.filteredRawMaterial;
      this.rawMaterialCount = this.filteredRawMaterial.length;

      console.log('All categories array: ', this.filteredRawMaterial);
    },
    (error) => { console.log(error) }
    );
  }

  addRM() {
    if (this.addRawMaterialForm.valid) {
      let newRawMaterial : rmVM = this.addRawMaterialForm.value;
      console.log(newRawMaterial);
      this.dataService.AddRawMaterial(newRawMaterial).subscribe(
        (result: any) => {
          console.log('new raw material!', result);
  
          this.getRawMaterials(); //refresh raw material list          
        }
      );
    }
  }

  openAddModal() {
    //Open the modal manually
    this.addModal.nativeElement.classList.add('show');
    this.addModal.nativeElement.style.display = 'block';
    //Fade background when modal is open.
    //I want to cry
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "block"};
    document.body.style.overflow = 'hidden'; //prevent scrolling web page body
  }

  closeAddModal() {
    //Close the modal manually
    this.addModal.nativeElement.classList.remove('show');
    this.addModal.nativeElement.style.display = 'none';
    //Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "none"};
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

  deleteRawMaterial() {
    //get category ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let rawMaterialId = id.substring(id.indexOf('-') + 1);
    console.log(rawMaterialId);
    this.dataService.DeleteRawMaterial(rawMaterialId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getRawMaterials(); //refresh category list
      },
      (error) => {
        console.error('Error deleting category with ID ', rawMaterialId, error);
      }
    );

    this.closeDeleteModal();
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

  openDeleteModal(rawMaterialId: number) {
    //get category and display data
    this.dataService.GetRawMaterial(rawMaterialId).subscribe(
      (result) => {
        this.specificRawMaterial.description = result.description;
        //display data; I know there's a better was to do this, but I can't find it.
        const deleteDescription = document.getElementById('description')
        if (deleteDescription) deleteDescription.innerHTML = this.specificRawMaterial.description;

      }
    );

    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteRawMaterial-' + rawMaterialId;
    //Fade background when modal is open.
    //I wanted to do this in 1 line but Angular was giving a 'Object is possibly null' error. Angular, my bru, who gives a damn?!!!
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "block"};
    document.body.style.overflow = 'hidden'; //prevent scrolling web page body
  }

  //--------------------UPDATE RAW MATERIAL----------------
  openUpdateModal(rawMaterialId: number) {
    //get category and display data
    this.dataService.GetRawMaterial(rawMaterialId).subscribe(
      (result) => {
        this.specificRawMaterial = result;
        console.log('Category to update: ', this.specificRawMaterial);        
        this.updateRawMaterialForm.setValue({
          uRawMaterialDescription: this.specificRawMaterial.description
        }); //display data; Reactive forms are so powerful. All the categoryVM data passed with one method
      }
    );

    //Open the modal manually
    this.updateModal.nativeElement.classList.add('show');
    this.updateModal.nativeElement.style.display = 'block';
    this.updateModal.nativeElement.id = 'updateRawMaterial-' + rawMaterialId;
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

  updateRawMaterial() {
    if (this.updateRawMaterialForm.valid) {
      //get raw material ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let rawMaterialId = id.substring(id.indexOf('-') + 1);
      console.log(rawMaterialId);

      //get form data
      const formValues = this.updateRawMaterialForm.value;
      let updatedRM : rmVM = {
        description: formValues.uRawMaterialDescription
      };

      //update raw material
      this.dataService.UpdateRawMaterial(rawMaterialId, updatedRM).subscribe(
        (result: any) => {
          console.log('Updated Raw Material', result);
          this.getRawMaterials(); //refresh category list
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );

      this.closeUpdateModal();
    }
    
  }

}
