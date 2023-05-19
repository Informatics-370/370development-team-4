import { Component  } from '@angular/core';
import { DataService } from '../services/data.services';
import { Category } from '../shared/category';
import { Router } from '@angular/router';
import { CategoryVM } from '../shared/category-vm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent {
  categories: Category[] = [];
  addCategoryForm: FormGroup;

  constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
    this.addCategoryForm = this.formBuilder.group({
      CategoryDescription: ['', Validators.required],
      Length: [false],
      Width: [false],
      Height: [false],
      Weight: [false],
      Volume: [false],
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

      console.log('All categories array: ', this.categories);
    });
  }  

  //--------------------ADD CATEGORY LOGIC----------------
  addCategory() {
    if (this.addCategoryForm.valid) {
      let newCategory : CategoryVM = this.addCategoryForm.value;
      console.log('New category before I post: ', newCategory);
      
      this.dataService.AddCategory(newCategory).subscribe(
        (result: any) => {
          console.log('new category!', result);    

          this.getCategories(); //refresh category list          
          this.addCategoryForm.reset(); //reset form
        },
        (error) => {
          console.error('Error submitting form:', error);
        }
      );
    }
  }

}
