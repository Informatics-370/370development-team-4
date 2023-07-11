import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { CategoryVM } from '../../shared/category-vm';

@Component({
  selector: 'app-categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.css']
})
export class CategoriesMenuComponent {
  categories: CategoryVM[] = []; //used to get all categories
  categoryCount: number = -1; //keep track of how many categories there are in the DB

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.displayCategories();
  }

  displayCategories() {
    this.dataService.GetCategories().subscribe((result: any[]) => {
      let allCategories: any[] = result;
      this.categories = []; //empty array
      allCategories.forEach((category) => {
        this.categories.push(category);
      });
      
      this.categoryCount = this.categories.length; //update the number of categories
      console.log('All categories array: ', this.categories);

      let menu = document.getElementById('category-menu') as HTMLElement;
      menu.innerHTML = '';

      if (this.categoryCount != 0) {
        this.categories.forEach(cat => {
          //create li and a elements
          let categoryListItem: HTMLLIElement = document.createElement('li');
          let categoryLink: HTMLAnchorElement = document.createElement('a');
          //add classes for styling
          categoryListItem.classList.add('category-list-item');
          categoryLink.classList.add('category-link');

          categoryLink.innerHTML = cat.categoryDescription;
          categoryLink.href = '#';

          //add to categories menu
          categoryListItem.appendChild(categoryLink);
          menu.appendChild(categoryListItem);
        });
      }
      else {
        //create li and a elements
        let categoryListItem: HTMLLIElement = document.createElement('li');
        let categoryLink: HTMLAnchorElement = document.createElement('a');
        categoryLink.classList.add('category-link', 'active');
        categoryLink.innerHTML = 'No categories';

        //add to categories menu
        categoryListItem.appendChild(categoryLink);
        menu.appendChild(categoryListItem);
      }
    });
  }
}
