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
  specificItem!: ItemVM; //used to get a specific item
  itemCount: number = this.items.length; //keep track of how many items there are in the DB
  categories: Category[] = []; //used to store all categories
  //forms
  addItemForm: FormGroup;
  // updateItemForm: FormGroup;
  //modals 
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addItemForm = this.formBuilder.group({
      itemDescription: ['', Validators.required],
      categoryID: [Validators.required]
    });
  }  

  ngOnInit(): void {
    this.getItems();  
    this.getCategories();
  }

  getItems() {
    this.dataService.GetItems().subscribe((result: any[]) => {
      let allItems: any[] = result;
      this.items = []; //empty item array
      allItems.forEach((itemFromDB) => {
        // let item: Item = {
        //   itemID = itemFromDB.itemID,
        //   description = itemFromDB.description,
        //   categoryID = itemFromDB.categoryID
        // };
        this.items.push(itemFromDB);
      });

      this.itemCount = this.items.length; //update the number of items

      console.log('All items array: ', this.items);
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

  //--------------------ADD CATEGORY LOGIC----------------
  addItem() {
    if (this.addItemForm.valid) {
      let newItem : ItemVM = this.addItemForm.value;
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
  }

}
