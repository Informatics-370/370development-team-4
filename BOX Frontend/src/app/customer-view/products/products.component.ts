import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

/*A NOTE:
The product tree is: category -> item -> product. But products are differentiated by sizes and it doesn't make sense to have 
15 cards for all the 15 different sizes of single wall box so it's better to have a card represent a product item. 
Then clicking on it takes the user to the specific product page which list all the possible sizes for that item. */

export class ProductsComponent {
  allProductVM: ProductVM[] = []; //all products
  filteredProductVM: ProductVM[] = []; //used to hold all the products that will be displayed to the user
  productCount = -1; //keep track of how many product items there are in the DB
  items: Item[] = []; //used to store all items
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
      this.fixedProducts = fixedProducts;

      this.populateProductList();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  /*the list displayed to the user is the filteredProdList which contains item info from prod items and product photo info 
  from fixed products. This method takes that data from the various entites and puts it in the list*/
  populateProductList() {
    this.items.forEach(item => {
      let prodVM: ProductVM;
      //get product photo to use with product item because items don't have photos, products do.
      let foundProd = this.fixedProducts.find(prod => prod.itemID == item.itemID);
      console.log('product we use to get photo: ', foundProd);

      //put item and product photo info in 1 VM object
      if (foundProd) {
        prodVM = {
          itemID: item.itemID,
          categoryID: item.categoryID,
          description: item.description,
          productPhotoB64: foundProd.productPhotoB64
        }
      }
      else {
        prodVM = {
          itemID: item.itemID,
          categoryID: item.categoryID,
          description: item.description,
          productPhotoB64: ''
        }
      }
      
      this.filteredProductVM.push(prodVM); //populate list that we'll use to display products to the user
    });

    this.allProductVM = this.filteredProductVM; //store all product someplace before I sort and filter later
    this.productCount = this.filteredProductVM.length;
    console.log('all products: ', this.allProductVM, ' and filtered products: ', this.filteredProductVM)

    this.displayProducts();
  }

  //used to display products to user; can filter if necessary
  displayProducts(categoryID?: number, sortString?: string) {
    let productCardsContainer = document.getElementById('product-cards') as HTMLElement;
    let cardsContainerInnerHTML = '';

    this.filteredProductVM.forEach(prod => {
      //create card
      cardsContainerInnerHTML += '<div class="col-md-3 col-sm-6 card-container">' +
                                    '<div class="card product-card" style="border: 0.5px solid rgba(219, 219, 219, 0.25);">' +
                                      '<div class="card-img-top">' +
                                        '<img class="card-img product-card-img" style="width: auto;" src="data:image/png;base64,'
                                           + prod.productPhotoB64 +'"' + 'alt="' + prod.description + '">' +
                                      '</div>' +
                                      '<div class="card-body product-card-body">' +
                                        '<p class="card-text">' + prod.description + '</p>' +
                                      '</div>' +
                                    '</div>' +
                                  '</div>';
    });      

    productCardsContainer.innerHTML = cardsContainerInnerHTML;
  }
}
