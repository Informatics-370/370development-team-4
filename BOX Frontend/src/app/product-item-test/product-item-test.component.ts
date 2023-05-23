import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { Item } from '../shared/item';
import { ItemVM } from '../shared/item-vm';
import { Category } from '../shared/category';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-item-test',
  templateUrl: './product-item-test.component.html',
  styleUrls: ['./product-item-test.component.css']
})

export class ProductItemTestComponent {
  items: Item[] = []; //used to store all items
  filteredItems: Item[] = []; //used to hold all the categories that will be displayed to the user
  specificItem!: Item; //used to get a specific item
  itemCount: number = this.filteredItems.length; //keep track of how many items there are in the DB
  categories: Category[] = []; //used to store all categories
  //forms
  addItemForm: FormGroup;
  updateItemForm: FormGroup;
  //I need these two variables below just to display a default, disabled option in the caetgory dropdown. Can you imagine?!!
  isDisabled = true;
  public selectedValue = 'NA';
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  //search functionality
  searchTerm: string = '';

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addItemForm = this.formBuilder.group({
      itemDescription: ['', Validators.required],
      categoryID: [{value: 'NA'}, Validators.required]
    });

    this.updateItemForm = this.formBuilder.group({
      uItemDescription: ['', Validators.required],
      uCategoryID: [{value: '7'}, Validators.required]
    });
  }  

  ngOnInit(): void {
    this.getItems();  
    this.getCategories();
  }

  getItems() {
    this.dataService.GetItems().subscribe((result: any[]) => {
      let allItems: any[] = result;
      this.filteredItems = []; //empty item array
      allItems.forEach((itemFromDB) => {
        // let item: Item = {
        //   itemID = itemFromDB.itemID,
        //   description = itemFromDB.description,
        //   categoryID = itemFromDB.categoryID
        // };
        this.filteredItems.push(itemFromDB);
      });
      
      this.items = this.filteredItems; //store all the categories someplace before I search below
      this.itemCount = this.filteredItems.length; //update the number of items

      console.log('All items array: ', this.filteredItems);
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
    });
  }  

  //--------------------SEARCH BAR LOGIC----------------
  searchItems(event: Event) {
    event.preventDefault();
    this.filteredItems = []; //clear array
    for (let i = 0; i < this.items.length; i++) {
      let currentItemDescripton: string = this.items[i].description.toLowerCase();
      if (currentItemDescripton.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredItems.push(this.items[i]);
      }
      console.log(this.filteredItems);
    }
  }

  //--------------------ADD ITEM LOGIC----------------
  addItem() {
    if (this.addItemForm.valid) {
      const formData = this.addItemForm.value;
      let newItem : ItemVM = {
        itemDescription: formData.itemDescription,
        categoryID: parseInt(formData.categoryID)
      }
      console.log(newItem);
      
      this.dataService.AddItem(newItem).subscribe(
        (result: any) => {
          console.log('New item!', result);

          this.getItems(); //refresh item list
          this.addItemForm.reset();
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    }
    else {console.log('Invalid data')}
  }
  

  //--------------------DELETE ITEM LOGIC----------------
  openDeleteModal(itemId: number) {
    //get category and display data
    this.dataService.GetItem(itemId).subscribe(
      (result) => {
        this.specificItem = result;
        console.log(this.specificItem);
        const deleteDescription = document.getElementById('deleteDescription')
        if (deleteDescription) deleteDescription.innerHTML = this.specificItem.description;
      }
    );

    //Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteItem-' + itemId;
    //Fade background when modal is open.
    //I wanted to do this in 1 line but Angular was giving a 'Object is possibly null' error.
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

  deleteItem() {
    //get item ID which I stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let itemId = id.substring(id.indexOf('-') + 1);
    console.log(itemId);
    this.dataService.DeleteItem(itemId).subscribe(
      (result) => {
        console.log("Successfully deleted ", result);
        this.getItems(); //refresh item list
      },
      (error) => {
        console.error('Error deleting item with ID ', itemId, error);
      }
    );

    this.closeDeleteModal();
  }

  //--------------------UPDATE ITEM LOGIC----------------
  openUpdateModal(itemId: number) {
    //get item and display data
    this.dataService.GetItem(itemId).subscribe(
      (result) => {
        console.log('Item to update: ', result);        
        this.updateItemForm.setValue({
          uCategoryID: result.categoryID,
          uItemDescription: result.description
        }); //display data; Reactive forms are so powerful. All the item data passed with one method
      },
      (error) => {
        console.error(error);
      }
    );

    //Open the modal manually
    this.updateModal.nativeElement.classList.add('show');
    this.updateModal.nativeElement.style.display = 'block';
    this.updateModal.nativeElement.id = 'updateItem-' + itemId; //pass item ID into modal ID so I can use it to update later
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

  updateItem() {
    if (this.updateItemForm.valid) {
      //get category ID which I stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let itemId = id.substring(id.indexOf('-') + 1);
      console.log(itemId);

      //get form data
      const formValues = this.updateItemForm.value;
      let updatedItem : ItemVM = {
        categoryID: formValues.uCategoryID,
        itemDescription: formValues.uItemDescription
      };

      //update item
      this.dataService.UpdateItem(itemId, updatedItem).subscribe(
        (result: any) => {
          console.log('Updated items', result);
          this.getItems(); //refresh item list
        },
        (error) => {
          console.error('Error updating items:', error);
        }
      );

      this.closeUpdateModal();
    }
    
  }

}
