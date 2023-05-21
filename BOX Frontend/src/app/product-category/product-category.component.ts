import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { Category } from '../shared/category';
import { CategoryVM } from '../shared/category-vm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent {
  categories: Category[] = []; //used to get all categories
  specificCategory!: CategoryVM; //used to get a specific category
  categoryCount: number = this.categories.length; //keep track of how many categories there are in the DB
  //forms
  addCategoryForm: FormGroup;
  updateCategoryForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addCategoryForm = this.formBuilder.group({
      categoryDescription: ['', Validators.required],
      length: [false],
      width: [false],
      height: [false],
      weight: [false],
      volume: [false]
    });

    this.updateCategoryForm = this.formBuilder.group({
      uCategoryDescription: ['', Validators.required],
      uLength: [false],
      uWidth: [false],
      uHeight: [false],
      uWeight: [false],
      uVolume: [false]
    });
  }

  ngOnInit(): void {
    this.getCategories();    
  }

  getCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      let allCategories: any[] = result;
      this.categories = []; //empty array
      allCategories.forEach((category) => {
        this.categories.push(category);
      });

      this.categoryCount = this.categories.length; //update the number of categories

      console.log('All categories array: ', this.categories);
    });
  }

  //--------------------ADD CATEGORY LOGIC----------------
  // addCategory() {
  //   if (this.addCategoryForm.valid) {
  //     let newCategory : CategoryVM = this.addCategoryForm.value;
      
  //     this.dataService.AddCategory(newCategory).subscribe(
  //       (result: any) => {
  //         console.log('new category!', result);    

  //         this.getCategories(); //refresh category list          
  //         this.addCategoryForm.reset(); //reset form
  //       }
  //     );
  //   }
  // }

  addCategory() {
    if (this.addCategoryForm.valid) {
      let newCategory : CategoryVM = this.addCategoryForm.value;
     
      this.dataService.AddCategory(newCategory).subscribe(
        (result: any) => {
              console.log('new category!', result);

              this.getCategories(); //refresh category list          
              this.addCategoryForm.patchValue({ length: false, width: false, height: false, weight: false, volume: false }); // set boolean values to false
        }
      );
    }
  }
  

  //--------------------DELETE CATEGORY LOGIC----------------
  openDeleteModal(categoryId: number) {
    //get category and display data
    this.dataService.GetCategory(categoryId).subscribe(
      (result) => {
        this.specificCategory = result;
        //display data; I know there's a better was to do this, but I can't find it.
        const deleteDescription = document.getElementById('deleteDescription')
        if (deleteDescription) deleteDescription.innerHTML = this.specificCategory.categoryDescription;

        const deleteLength = document.getElementById('deleteLength')
        if (deleteLength) {
          if (this.specificCategory.length) deleteLength.innerHTML = 'Enabled';
          else deleteLength.innerHTML = 'Disabled';
        }
        
        const deleteWidth = document.getElementById('deleteWidth')
        if (deleteWidth) {
          if (this.specificCategory.width) deleteWidth.innerHTML = 'Enabled';
          else deleteWidth.innerHTML = 'Disabled';
        }
        
        const deleteHeight = document.getElementById('deleteHeight')
        if (deleteHeight) {
          if (this.specificCategory.height) deleteHeight.innerHTML = 'Enabled';
          else deleteHeight.innerHTML = 'Disabled';
        }
        
        const deleteWeight = document.getElementById('deleteWeight')
        if (deleteWeight) {
          if (this.specificCategory.weight) deleteWeight.innerHTML = 'Enabled';
          else deleteWeight.innerHTML = 'Disabled';
        }
        
        const deleteVolume = document.getElementById('deleteVolume')
        if (deleteVolume) {
          if (this.specificCategory.volume) deleteVolume.innerHTML = 'Enabled';
          else deleteVolume.innerHTML = 'Disabled';
        }

      }
    );

    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteCategory-' + categoryId;
    //Fade background when modal is open.
    //I wanted to do this in 1 line but Angular was giving a 'Object is possibly null' error. Angular, my bru, who gives a damn?!!!
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

  deleteCategory() {
    //get category ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let categoryId = id.substring(id.indexOf('-') + 1);
    console.log(categoryId);
    this.dataService.DeleteCategory(categoryId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getCategories(); //refresh category list
      },
      (error) => {
        console.error('Error deleting category with ID ', categoryId, error);
      }
    );

    this.closeDeleteModal();
  }

  //--------------------UPDATE CATEGORY LOGIC----------------
  openUpdateModal(categoryId: number) {
    //get category and display data
    this.dataService.GetCategory(categoryId).subscribe(
      (result) => {
        this.specificCategory = result;
        console.log('Category to update: ', this.specificCategory);        
        this.updateCategoryForm.setValue({
          uCategoryDescription: this.specificCategory.categoryDescription,
          uLength: this.specificCategory.length,
          uWidth: this.specificCategory.width,
          uHeight: this.specificCategory.height,
          uWeight: this.specificCategory.weight,
          uVolume: this.specificCategory.volume
        }); //display data; Reactive forms are so powerful. All the categoryVM data passed with one method
      }
    );

    //Open the modal manually
    this.updateModal.nativeElement.classList.add('show');
    this.updateModal.nativeElement.style.display = 'block';
    this.updateModal.nativeElement.id = 'updateCategory-' + categoryId; //pass category ID into modal ID so I can use it to update later
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

  updateCategory() {
    if (this.updateCategoryForm.valid) {
      //get category ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let categoryId = id.substring(id.indexOf('-') + 1);
      console.log(categoryId);

      //get form data
      const formValues = this.updateCategoryForm.value;
      let updatedCategory : CategoryVM = {
        categoryDescription: formValues.uCategoryDescription,
        width: formValues.uWidth,
        length: formValues.uLength,
        height: formValues.uHeight,
        weight: formValues.uWeight,
        volume: formValues.uVolume
      };

      //update category
      this.dataService.UpdateCategory(categoryId, updatedCategory).subscribe(
        (result: any) => {
          console.log('Updated category', result);
          this.getCategories(); //refresh category list
        },
        (error) => {
          console.error('Error updating category:', error);
        }
      );

      this.closeUpdateModal();
    }
    
  }

}
