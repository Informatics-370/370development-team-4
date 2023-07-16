import { Component, Renderer2 } from '@angular/core';
import { Route, Router } from '@angular/router';
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
  loading = true;

  //sort and filter
  sortString = 'default';

  constructor(private dataService: DataService, private router: Router, private renderer: Renderer2) { }

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
      let foundProd: FixedProductVM | undefined;
      
      foundProd = this.fixedProducts.find(prod => prod.itemID == item.itemID && prod.productPhotoB64 != '');

      if (!foundProd) { foundProd = this.fixedProducts.find(prod => prod.itemID == item.itemID); }

      //put item and product photo info in 1 VM object
      if (foundProd) { //prevent users from trying to view product details of product items for which there are no fixed products
        prodVM = {
          itemID: item.itemID,
          categoryID: item.categoryID,
          description: item.description,
          productPhotoB64: foundProd.productPhotoB64,
          sizeStringArray: [],
          price: foundProd.price
        }
        this.filteredProductVM.push(prodVM); //populate list that we'll use to display products to the user
      }
    });

    this.allProductVM = this.filteredProductVM; //store all product someplace before I sort and filter later
    this.productCount = this.filteredProductVM.length;
    console.log('all products: ', this.allProductVM, ' and filtered products: ', this.filteredProductVM)

    this.displayProducts();
  }

  //used to display products to user; can filter if necessary; will add filtering later
  displayProducts(categoryID?: number) {
    let productCardsContainer = document.getElementById('product-cards') as HTMLElement;
    productCardsContainer.innerHTML = '';

    if (this.sortString == 'low') { //sort by price from low to high
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        return currentProd.price - nextProd.price
      });
    }
    else if (this.sortString == 'high') { //sort by price from high to low
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        return nextProd.price - currentProd.price
      });
    }
    else if (this.sortString == 'latest') { //sort by product item ID; last item ID is most recently added item; later sort by fixed prod
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        return nextProd.itemID - currentProd.itemID
      });
    }
    else if (this.sortString == 'a-z') { //sort ascending
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        if (currentProd.description.toLocaleLowerCase() < nextProd.description.toLocaleLowerCase()) { return -1; }
        if (currentProd.description.toLocaleLowerCase() > nextProd.description.toLocaleLowerCase()) { return 1; }
        return 0;
      });
    }
    else if (this.sortString == 'z-a') { //sort descending
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        if (currentProd.description.toLocaleLowerCase() > nextProd.description.toLocaleLowerCase()) { return -1; }
        if (currentProd.description.toLocaleLowerCase() < nextProd.description.toLocaleLowerCase()) { return 1; }
        return 0;
      });
    }
    else if (this.sortString == 'default') { //default sort is sorted by item ID
      console.log('About to sort by: ', this.sortString);
      this.filteredProductVM.sort((currentProd, nextProd) => {
        return currentProd.itemID - nextProd.itemID
      });
    }

    this.filteredProductVM.forEach(prod => {
      //create card dynamically
      const cardContainer = this.renderer.createElement('div');
      this.renderer.addClass(cardContainer, 'col-md-3');
      this.renderer.addClass(cardContainer, 'col-sm-6');
      this.renderer.addClass(cardContainer, 'card-container');

      const card = this.renderer.createElement('div');
      this.renderer.addClass(card, 'card');
      this.renderer.addClass(card, 'product-card');
      this.renderer.addClass(card, 'hover-animation');
      this.renderer.setStyle(card, 'border', '0.5px solid rgba(219, 219, 219, 0.25)');

      const cardImgTop = this.renderer.createElement('div');
      this.renderer.addClass(cardImgTop, 'card-img-top');
      this.renderer.addClass(cardImgTop, 'product-card-img-top');

      const img = this.renderer.createElement('img');
      this.renderer.addClass(img, 'card-img');
      this.renderer.addClass(img, 'product-card-img');
      this.renderer.setStyle(img, 'width', 'auto');
      this.renderer.setAttribute(img, 'src', 'data:image/png;base64,' + prod.productPhotoB64);
      this.renderer.setAttribute(img, 'alt', prod.description);

      const cardBody = this.renderer.createElement('div');
      this.renderer.addClass(cardBody, 'card-body');
      this.renderer.addClass(cardBody, 'product-card-body');

      const cardText = this.renderer.createElement('p');
      this.renderer.addClass(cardText, 'card-text');
      const text = this.renderer.createText(prod.description);
      this.renderer.appendChild(cardText, text);

      this.renderer.appendChild(cardImgTop, img);
      this.renderer.appendChild(cardBody, cardText);
      this.renderer.appendChild(card, cardImgTop);
      this.renderer.appendChild(card, cardBody);
      this.renderer.appendChild(cardContainer, card);
      this.renderer.appendChild(productCardsContainer, cardContainer);

      this.renderer.listen(cardContainer, 'click', () => {
        this.redirectToProductDetails(prod.itemID, prod.description);
      });

      /*The resulting code looks like this:
          <div class="col-md-3 col-sm-6 card-container">
              <div class="card product-card hover-animation" style="border: 0.5px solid rgba(219, 219, 219, 0.25);">
                  <div class="card-img-top">
                      <img class="card-img product-card-img" style="width: auto;" src="data:image/png;base64,Base64String" alt="Single wall box">
                  </div>
                  <div class="card-body product-card-body">
                      <p class="card-text">Single Wall Box</p>
                  </div>
              </div>
          </div>
      */
    });

    this.loading = false;
  }

  /*OG DISPLAY PRODUCTS CODE:
  let cardsContainerInnerHTML = '';
  this.filteredProductVM.forEach(prod => { 
    cardsContainerInnerHTML += 
        '<div class="col-md-3 col-sm-6 card-container">' +
          '<div class="card product-card" style="border: 0.5px solid rgba(219, 219, 219, 0.25);">' +
            '<div class="card-img-top">' +
              '<img class="card-img product-card-img" style="width: auto;" src="data:image/png;base64,'
                + prod.productPhotoB64 + '"' + 'alt="' + prod.description + '">' +
            '</div>' +
            '<div class="card-body product-card-body">' +
              '<p class="card-text">' + prod.description + '</p>' +
            '</div>' +
          '</div>' +
        '</div>'; 
    });
    //productCardsContainer.innerHTML = cardsContainerInnerHTML;
  */

  redirectToProductDetails(itemID: number, itemDescription: string) {
    this.router.navigate(['product-details', itemID, itemDescription.replaceAll(' ', '-')]);
  }
}
