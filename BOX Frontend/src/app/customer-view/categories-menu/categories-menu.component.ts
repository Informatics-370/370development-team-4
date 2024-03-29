import { Component, Renderer2 } from '@angular/core';
import { DataService } from '../../services/data.services';
import { CategoryVM } from '../../shared/category-vm';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-categories-menu',
  templateUrl: './categories-menu.component.html',
  styleUrls: ['./categories-menu.component.css']
})
export class CategoriesMenuComponent {
  categories: CategoryVM[] = []; //used to get all categories
  categoryCount: number = -1; //keep track of how many categories there are in the DB
  currentCategoryID = -1;

  constructor(private dataService: DataService, private router: Router, private renderer: Renderer2, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCategories();
    //Retrieve the category ID from url
    this.activatedRoute.paramMap.subscribe(params => {
      //category with id 2 and description 'single wall' will come as '2-single-wall' so split it into array that is ['2', 'single-wall']
      let id = params.get('category')?.split('-', 1);
      if (id) this.currentCategoryID = parseInt(id[0]);
    });
  }

  getCategories() {
    try {
      this.dataService.GetCategories().subscribe((result: any[]) => {
        let allCategories: any[] = result;
        this.categories = []; //empty array
        allCategories.forEach((category) => {
          this.categories.push(category);
        });

        this.categoryCount = this.categories.length; //update the number of categories

        this.displayCategories();
      });
    } catch (error) {
      console.error(error);
    }
  }

  displayCategories() {
    let menu = document.getElementById('category-menu') as HTMLElement;
    menu.innerHTML = '';

    //create li and a element for removing filter
    let noFilterListItem: HTMLLIElement = document.createElement('li');
    let noFilterLink: HTMLAnchorElement = document.createElement('a');
    noFilterLink.classList.add('category-link');
    noFilterLink.innerHTML = 'All categories';

    if (this.currentCategoryID == -1 && location.href.includes('/products')) noFilterLink.classList.add('active-category'); //add active class to all categories link

    //redirect to products page and remove filter
    this.renderer.listen(noFilterLink, 'click', () => {
      this.redirectToProducts();
    });

    //add to categories menu
    noFilterListItem.appendChild(noFilterLink);
    menu.appendChild(noFilterListItem);

    if (this.categoryCount != 0) {
      this.categories.forEach(cat => {
        //create li and a elements
        let categoryListItem: HTMLLIElement = document.createElement('li');
        let categoryLink: HTMLAnchorElement = document.createElement('a');
        //add classes for styling
        categoryListItem.classList.add('category-list-item');
        categoryLink.classList.add('category-link');

        //add class for styling active category
        if (this.currentCategoryID == cat.categoryID) {
          categoryLink.classList.add('active-category');
        }

        categoryLink.innerHTML = cat.categoryDescription;
        //redirect to products page and filter by category on click
        this.renderer.listen(categoryLink, 'click', () => {
          this.redirectToProducts(cat.categoryID, cat.categoryDescription);
        });

        //add to categories menu
        categoryListItem.appendChild(categoryLink);
        menu.appendChild(categoryListItem);
      });
    }
  }

  //redirect to products page and filter by category
  redirectToProducts(categoryID?: number, categoryDescription?: string) {
    //url is expecting product with id 2 and description 'product description' to be '2-product-description', so combine string into that
    if (categoryID && categoryDescription) {
      let urlParameter = categoryID + '-' + categoryDescription?.replaceAll(' ', '-');
      //update menu to display active category and filter as necessary
      window.location.href = '/products/' + urlParameter;
    }
    else {
      window.location.href = '/products';
    }
  }
}
