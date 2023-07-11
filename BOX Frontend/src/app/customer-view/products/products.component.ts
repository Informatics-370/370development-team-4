import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  items: Item[] = []; //used to store all items
  filteredItems: Item[] = []; //used to hold all the product items that will be displayed to the user
  itemCount = -1; //keep track of how many product items there are in the DB
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getItemsPromise = lastValueFrom(this.dataService.GetItems().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing. However, the console logs are executing in order, which raises questions.
      But that could just be because they're outside the Promise.all. IDC!!!!! I'm tired of trying to find alternatives for this. 
      And data is being retrieved faster that how I had it work before so I'm moving on with my life*/
      const [allItems, fixedProducts] = await Promise.all([
        getItemsPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.items = allItems;
      this.filteredItems = this.items
      this.itemCount = this.items.length;
      console.log('All product items:', this.items);
      this.fixedProducts = fixedProducts;
      console.log('All fixed products:', this.fixedProducts);

      //this.displayProducts();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  displayProducts(categoryID?: number, sortString?: string) {
    let productCardsContainer = document.getElementById('product-cards') as HTMLElement;
    let cardsContainerInnerHTML = '';

    this.filteredItems.forEach(item => {
      /* cardsContainerInnerHTML += '<div class="col-md-3 col-sm-6 card-container">' +
                                    '<div class="card product-card" style="border: 0.5px solid rgba(219, 219, 219, 0.25);">' +
                                      '<div class="card-img-top">' +
                                        '<img class="card-img product-card-img" style="width: auto;" src="data:image/png;base64,'
                                           + product.productPhotoB64 +'"' + 'alt="' + product.description + '">' +
                                      '</div>' +
                                      '<div class="card-body product-card-body">' +
                                        '<p class="card-text">' + product.description + '</p>' +
                                      '</div>' +
                                    '</div>' +
                                  '</div>'; */
    });

    productCardsContainer.innerHTML = cardsContainerInnerHTML;
  }
}
