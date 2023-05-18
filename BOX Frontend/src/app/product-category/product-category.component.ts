import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { Category } from '../shared/category';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent {
  categories: Category[] = [];

  constructor(private dataService: DataService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCategories();    
  }

  getCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      console.log('getCategories result: ', result);
      let allCategories: any[] = result;
      allCategories.forEach((category) => {
        this.categories.push(category);
      });

      console.log('Populated category array: ', this.categories);
    });
  }

}
