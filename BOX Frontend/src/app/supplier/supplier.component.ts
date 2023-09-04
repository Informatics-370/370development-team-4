import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Supplier } from '../shared/supplier';
import { Category } from '../shared/category';
import { SupplierVM } from '../shared/supplier-vm';
import { MapsService } from '../services/maps.service';


declare var $: any; 

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent  {
  Suppliers: Supplier[]=[];
  filteredSuppliers: Supplier[]=[];
  specificSupplier!:Supplier;
  supplierCount:number=-1;
  filteredCategories: Category[] = []; //used to hold all the categories that will be displayed to the user

  //forms
  addSupplierForm:FormGroup;
  updateSupplierForm:FormGroup;
  categoryCount:number=-1 //Keep tracks of how many categories are in the DB
  categories:Category[]=[]//Used to store all categories
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads


constructor(private dataService: DataService, private formBuilder: FormBuilder, private mapsService: MapsService ) {
  this.addSupplierForm = this.formBuilder.group({
    name:['', Validators.required],
    address:['', Validators.required],
    number:['', Validators.required],
    email: ['', Validators.required]
  });

  this.updateSupplierForm = this.formBuilder.group({
    uname:['', Validators.required],
    uaddress:['', Validators.required],
    unumber:['', Validators.required],
    uemail: ['', Validators.required]  })
}
ngOnInit(): void {
  this.getSuppliers();  
  this.getCategories();
  this.initAutocomplete(this.addressInput);
}


  @ViewChild('address', { static: true })
  addressInput!: ElementRef<HTMLInputElement>;

initAutocomplete(addressInput: ElementRef<HTMLInputElement>) {
  this.mapsService.initAutocomplete(addressInput);
}


getSuppliers() {
  this.dataService.GetAllSuppliers().subscribe((result: any[]) => {
    let allSuppliers: any[] = result;
    this.filteredSuppliers = []; //empty item array
    allSuppliers.forEach((supplierfromDB) => {
      this.filteredSuppliers.push(supplierfromDB);
    });
    
    this.Suppliers = this.filteredSuppliers; //store all the items someplace before I search below
    this.supplierCount = this.filteredSuppliers.length; //update the number of items

    console.log('All Suppliers array: ', this.filteredSuppliers);
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
searchSuppliers(event: Event) {
  this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  this.filteredSuppliers = []; // clear array
  for (let i = 0; i < this.Suppliers.length; i++) {
    let suppliername: string = String(this.Suppliers[i].name).toLowerCase();

    if (suppliername.includes(this.searchTerm)) {
      this.filteredSuppliers.push(this.Suppliers[i]);
    }
  }
  this.supplierCount = this.filteredSuppliers.length; // update supplier count so the message can be displayed if no suppliers are found
  console.log(this.filteredSuppliers);
}




//--------------------ADD Supplier LOGIC----------------
addSupplier() {
  this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
  if (this.addSupplierForm.valid) {
    const formData = this.addSupplierForm.value;
    let newSupplier: any = {
      'name': formData.name,
      'phone_Number': formData.number,
      'address': formData.address,
      'email': formData.email

    };
    
    this.dataService.AddSupplier(newSupplier).subscribe(
      (result: any) => {
        console.log('New Supplier!', result);

        this.getSuppliers(); //refresh Supplier list
        this.addSupplierForm.reset();
        this.submitClicked = false; //reset submission status
        $('#addSupplier').modal('hide');
      }
    );
  }
  else {
    console.log('Invalid data');
  }
}

  //--------------------DELETE ITEM LOGIC----------------
  openDeleteModal(supplierID: number) {
    //get category and display data
    this.dataService.GetSupplier(supplierID).subscribe(
      (result) => {
        this.specificSupplier = result;
        console.log(this.specificSupplier);
        const deleteDescription = document.getElementById('deleteDescription');
        if (deleteDescription) {
          deleteDescription.innerHTML = this.specificSupplier.name.toString();
        }

        //Open the modal manually only after data is displayed
        this.deleteModal.nativeElement.classList.add('show');
        this.deleteModal.nativeElement.style.display = 'block';
        this.deleteModal.nativeElement.id = 'deleteSupplier-' + supplierID;
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

  deleteSupplier() {
    //get supplier ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let supplierID = id.substring(id.indexOf('-') + 1);
    console.log(supplierID);
    this.dataService.DeleteSupplier(supplierID).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getSuppliers(); //refresh item list
      },
      (error) => {
        console.error('Error deleting item with ID ', supplierID, error);
      }
    );

    this.closeDeleteModal();
  }

  
  //--------------------UPDATE ITEM LOGIC----------------
  openUpdateModal(supplierID: number) {
    //get item and display data
    this.dataService.GetSupplier(supplierID).subscribe(
      (result) => {
        console.log('Supplier to update: ', result);        
        this.updateSupplierForm.setValue({
          uname: result.name,
          uaddress:result.address,
          unumber:result.contact_Number,
          uemail:result.email
        }); //display data; Reactive forms are so powerful. All the item data passed with one method

        //Open the modal manually only after the data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateSupplier-' + supplierID; //pass item ID into modal ID so I can use it to update later
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

  updateSupplier() {
    if (this.updateSupplierForm.valid) {
      let id = this.updateModal.nativeElement.id;
      let supplierID = id.substring(id.indexOf('-') + 1);
      console.log(supplierID);

      //get form data
      const formValues = this.updateSupplierForm.value;
      let updatedSupplier : Supplier = {
        supplierID:supplierID,
        name: formValues.uname,
        address:formValues.uaddress,
        email:formValues.uemail,
        contact_Number:formValues.unumber

      };

      //update item
      this.dataService.UpdateSupplier(supplierID, updatedSupplier).subscribe(
        (result: any) => {
          console.log('Updated Supplier', result);
          this.getSuppliers(); //refresh item list
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
  get name() { return this.addSupplierForm.get('name'); }
  get address() { return this.addSupplierForm.get('address'); }
  get email() { return this.addSupplierForm.get('email'); }
  get number() { return this.addSupplierForm.get('number'); }

  get uname() { return this.addSupplierForm.get('uname'); }
  get uaddress() { return this.addSupplierForm.get('uaddress'); }
  get uemail() { return this.addSupplierForm.get('uemail'); }
  get unumber() { return this.addSupplierForm.get('unumber'); }
}
