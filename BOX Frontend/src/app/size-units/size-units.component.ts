import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { CategoryVM } from '../shared/category-vm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Size } from '../shared/Size';
import { SizeVM } from '../shared/size-vm';
declare var $: any; 



@Component({
  selector: 'app-size-units',
  templateUrl: './size-units.component.html',
  styleUrls: ['./size-units.component.css']
})
export class SizeUnitsComponent {
  sizeUnits: Size[] = []; //used to store all size units
  filteredSizeUnits: Size[] = []; //used to hold all the sizes that will be displayed to the user

  specificSize!: Size; //used to get a specific size (not always necessary)
  sizeCount: number = -1; //keep track of how many sizes there are in the DB
  categoryCount:number=-1 //Keep tracks of how many categories are in the DB
  categories:CategoryVM[]=[]//Used to store all categories
  //forms
   addSizeForm: FormGroup;
  updateSizeForm: FormGroup; 
  isDisabled=true;
  public selectedValue='NA';

  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked=false;
  loading=true; //Show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addSizeForm = this.formBuilder.group({
      sizeLength: [0, Validators.required],
      sizeWidth: [0, Validators.required],
      sizeHeight: [0, Validators.required],
      sizeWeight: [0, Validators.required],
      sizeVolume: [0, Validators.required],
      categoryID: [{value: 'NA'}, Validators.required]
    });

    this.updateSizeForm = this.formBuilder.group({
      usizeLength: [0, Validators.required],
      usizeWidth: [0, Validators.required],
      usizeHeight: [0, Validators.required],
      usizeWeight: [0, Validators.required],
      usizeVolume: [0, Validators.required],  
      uCategoryID: [{value: '7'}, Validators.required]
    });
  }  

 
  ngOnInit(): void {
    this.getSizes();  
    this.getCategories();
  }

  getSizes() {
    this.dataService.GetSizes().subscribe((result: any[]) => {
      let allSizes: any[] = result;
      this.filteredSizeUnits = []; //empty item array
      allSizes.forEach((sizefromDB) => {
        this.filteredSizeUnits.push(sizefromDB);
      });
      
      this.sizeUnits = this.filteredSizeUnits; //store all the items someplace before I search below
      this.sizeCount = this.filteredSizeUnits.length; //update the number of items

      console.log('All Size Units array: ', this.filteredSizeUnits);
    });
  }

  //get all categories for create and update modals
  getCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      let allCategories: any[] = result;
      this.categories = []; //empty array
      allCategories.forEach((category) => {
        this.categories.push(category);
      });

      console.log('All categories array: ', this.categories);
      this.loading = false; //stop displaying loading message
    });
  } 


 //--------------------SEARCH BAR LOGIC----------------
 searchCategories(event: Event) {    
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredSizeUnits=[];
    for (let i = 0; i < this.sizeUnits.length; i++) {
      let notCaseSensitive: string =String(this.sizeUnits[i].categoryDescription+this.sizeUnits[i].height+this.sizeUnits[i].weight +this.sizeUnits[i].length+this.sizeUnits[i].volume+ this.sizeUnits[i].width).toLowerCase();
      if (notCaseSensitive.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredSizeUnits.push(this.sizeUnits[i]);
      }
    }
    this.sizeCount = this.filteredSizeUnits.length;
    console.log(this.filteredSizeUnits);
  }
//Add Size units Logic

addSize() {
  this.submitClicked = true;
  if (this.addSizeForm.valid) {
    const formData = this.addSizeForm.value;
    let newSize : SizeVM = {
      sizeID: 0,
      width: formData.sizeWidth,
      length: formData.sizeLength,
      weight: formData.sizeWeight,
      height: formData.sizeHeight,
      volume: formData.sizeVolume,
      categoryID: parseInt(formData.categoryID),
      categoryDescription:''
    }
    console.log(newSize);
    
    this.dataService.AddSize(newSize).subscribe(
      (result: any) => {
        console.log('New Size Unit Created with the correct Category!', result);

        this.getSizes(); //Get the sizes and refresh the page
        this.addSizeForm.reset();
        this.submitClicked = false;
        $('#addSize').modal('hide');//Id for the add Size modal to be hiddden
      },
      (error) => {
        console.error('Error submitting form:', error);
      }
    );
  }
  else {console.log('Invalid data')}
}

//--------------------DELETE ITEM LOGIC----------------
openDeleteModal(sizeId: number) {
  //get category and display data
  this.dataService.getSize(sizeId).subscribe(
    (result) => {
      console.log(this.specificSize);
      const deleteDescription = document.getElementById('deleteDescription')
      if (deleteDescription) deleteDescription.innerHTML = result.categoryDescription +"-"+ result.length+ "X"+ result.width+ "X"+ result.height +"X"+ result.weight +"X"+ result.volume;

      //Open the modal manually only after data is displayed
      this.deleteModal.nativeElement.classList.add('show');
      this.deleteModal.nativeElement.style.display = 'block';
      this.deleteModal.nativeElement.id = 'deleteSize-' + sizeId;
      //Fade background when modal is open.
      //I wanted to do this in 1 line but Angular was giving a 'Object is possibly null' error.
      const backdrop = document.getElementById("backdrop");
      if (backdrop) {backdrop.style.display = "block"};
      document.body.style.overflow = 'hidden'; //prevent scrolling web page body
    }
  );
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

deleteSize() {
  //get item ID which I stored in modal ID
  let id = this.deleteModal.nativeElement.id;
  let sizeId = id.substring(id.indexOf('-') + 1);
  console.log(sizeId);
  this.dataService.DeleteSize(sizeId).subscribe(
    (result) => {
      console.log("Successfully deleted ", result);
      this.getSizes(); //refresh item list
    },
    (error) => {
      console.error('Error deleting item with ID ', sizeId, error);
    }
  );

  this.closeDeleteModal();
}


 //--------------------UPDATE ITEM LOGIC----------------
 openUpdateModal(sizeId: number) {
  //get item and display data
  this.dataService.getSize(sizeId).subscribe(
    (result) => {
      console.log('Size to update: ', result);        
      this.updateSizeForm.setValue({
        uCategoryID:result.categoryID,
        usizeLength:result.length,
        usizeHeight:result.height,
        usizeWidth:result.width,
        usizeWeight:result.weight,
        usizeVolume:result.volume,
              
      }); //display data; Reactive forms are so powerful. All the item data passed with one method

      //Open the modal manually only after the data is retrieved and displayed
      this.updateModal.nativeElement.classList.add('show');
      this.updateModal.nativeElement.style.display = 'block';
      this.updateModal.nativeElement.id = 'updateSize-' + sizeId; //pass item ID into modal ID so I can use it to update later
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

updateSizeUnit() {
  if (this.updateSizeForm.valid) {
    //get category ID which I stored in modal ID
    let id = this.updateModal.nativeElement.id;
    let sizeId = id.substring(id.indexOf('-') + 1);
    console.log(sizeId);

    //get form data
    const formValues = this.updateSizeForm.value;
    let updatedSize : SizeVM = {
      sizeID: 0,
      categoryID: formValues.uCategoryID,
      length: formValues.usizeLength,
      width:formValues.usizeWidth,
      weight:formValues.usizeWeight,
      volume:formValues.usizeVolume,
      height:formValues.usizeHeight,
      categoryDescription:''
    };

    //update item
    this.dataService.EditSize(sizeId, updatedSize).subscribe(
      (result: any) => {
        console.log('Updated Sizes', result);
        this.getSizes(); //refresh item list
      },
      (error) => {
        console.error('Error updating items:', error);
      }
    );

    this.closeUpdateModal();
  }












  
}
















//---------------------------VALIDATION ERRORS LOGIC-----------------------
get sizeLength() { return this.addSizeForm.get('sizeLength'); }
get sizeWidth() { return this.addSizeForm.get('sizeWidth'); }
get sizeWeight() { return this.addSizeForm.get('sizeWeight'); }
get sizeVolume() { return this.addSizeForm.get('sizeVolume'); }
get sizeHeight() { return this.addSizeForm.get('sizeHeight'); }
get categoryID() { return this.addSizeForm.get('categoryID'); }

}
