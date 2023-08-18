import { Component, ViewChild } from '@angular/core';
import { Discount } from '../shared/discount';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.services';
declare var $: any; 

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrls: ['./discount.component.css']
})
export class DiscountComponent {
  Discounts: Discount[] = []; //used to store all discounts
  filteredDiscounts: Discount[] = []; //used to hold all the discounts that will be displayed to the user
  specificdiscount!: Discount; //used to get a specific discounts
  discountCount: number = -1; //keep track of how many discounts there are in the DB
  //forms
  addDiscountForm: FormGroup;
  updateDiscountForm: FormGroup;

  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addDiscountForm = this.formBuilder.group({
      percentage: [0, Validators.required],
      quantity: [0, Validators.required]
    });

    this.updateDiscountForm = this.formBuilder.group({
      uPercentage: [0, Validators.required],
      uQuantity: [0, Validators.required],
    })
  }

ngOnInit(): void {
  this.getDiscounts();
}

getDiscounts() { //get all Discounts
  this.dataService.GetDiscounts().subscribe((result: any[]) => {
    let allDiscounts: any[] = result;
    this.filteredDiscounts = []; //empty item array
    allDiscounts.forEach((duration) => {
      this.filteredDiscounts.push(duration);
    });
    this.Discounts = this.filteredDiscounts; //store all the Discount someplace before searching below
    this.discountCount = this.filteredDiscounts.length; //update the number of items

    console.log('All discount array: ', this.filteredDiscounts);
    this.loading = false; //stop displaying loading message
  });
}
//--------------------SEARCH BAR LOGIC----------------
searchDiscounts(event: Event) {
  this.searchTerm = (event.target as HTMLInputElement).value;
  this.filteredDiscounts = []; //clear array
  for (let i = 0; i < this.Discounts.length; i++) {
    let currentDiscount: string = this.Discounts[i].percentage + ' ' + this.Discounts[i].quantity;
    if (currentDiscount.includes(this.searchTerm))
    {
      this.filteredDiscounts.push(this.Discounts[i]);
    }
  }
  this.discountCount = this.filteredDiscounts.length; //update Discount count so message can be displayed if no Discountd are found
  console.log(this.filteredDiscounts);
}
//--------------------ADD DURATION LOGIC----------------
addDiscount() {
  this.submitClicked = true; //display validation error message if user tried to submit form with no fields filled in correctly
  if (this.addDiscountForm.valid) {
    const formData = this.addDiscountForm.value;
    let newDiscount = {
      percentage: Math.floor(formData.percentage),
      quantity: Math.floor(formData.quantity)
    };
    console.log(newDiscount);
    
    this.dataService.AddDiscount(newDiscount).subscribe(
      (result: any) => {
        console.log('New discount!', result);

        this.getDiscounts(); //refresh item list
        this.addDiscountForm.reset();
        this.submitClicked = false; //reset submission status
        $('#addDiscount').modal('hide');
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

//--------------------DELETE DISCOUNT LOGIC----------------
openDeleteModal(discountId: number) {
  //Open the modal manually
  this.deleteModal.nativeElement.classList.add('show');
  this.deleteModal.nativeElement.style.display = 'block';
  this.deleteModal.nativeElement.id = 'deleteDiscount-' + discountId; //store Id where I can access it again
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

deleteDiscount() {
  //get duration ID which I stored in modal ID
  let id = this.deleteModal.nativeElement.id;
  let discountId = id.substring(id.indexOf('-') + 1);
  console.log(discountId);
  this.dataService.DeleteDiscount(discountId).subscribe(
    (result) => {
      console.log("Successfully deleted ", result);
      this.getDiscounts(); //refresh item list
    },
    (error) => {
      console.error('Error deleting discounts with ID ', discountId, error);
    }
  );

  this.closeDeleteModal();
}
//--------------------UPDATE DISCOUNT LOGIC----------------
openUpdateModal(discountId: number) {
  //get item and display data
  this.dataService.GetDiscount(discountId).subscribe(
    (result) => {
      console.log('Discount to update: ', result);        
      this.updateDiscountForm.setValue({          
        uPercentage: Math.floor(result.percentage),
        uQuantity: Math.floor(result.quantity),

      }); //display data;
    },
    (error) => {
      console.error(error);
    }
  );

  //Open the modal manually
  this.updateModal.nativeElement.classList.add('show');
  this.updateModal.nativeElement.style.display = 'block';
  this.updateModal.nativeElement.id = 'updateDiscount-' + discountId; //pass item ID into modal ID so I can use it to update later
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

updateDiscount() {
  this.submitClicked = true;
  if (this.updateDiscountForm.valid) {
    //get discount ID which I stored in modal ID
    let id = this.updateModal.nativeElement.id;
    let discountId = id.substring(id.indexOf('-') + 1);
    console.log(discountId);

    //get form data
    const formValues = this.updateDiscountForm.value;
    let updatedDiscount:Discount
    ={discountID: 0,
      percentage: formValues.uPercentage,
      quantity: formValues.uQuantity,
    };
    console.log(updatedDiscount);

    //update item
    this.dataService.UpdateDiscount(discountId, updatedDiscount).subscribe(
      (result: any) => {
        console.log('Updated discounts', result);
        this.getDiscounts(); //refresh list
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
get percentage() { return this.addDiscountForm.get('percentage'); }
  get quantity() { return this.addDiscountForm.get('quantity'); }
  get uPercentage() { return this.updateDiscountForm.get('uPercentage'); }
  get uQuantity() { return this.updateDiscountForm.get('uQuantity'); }
}

