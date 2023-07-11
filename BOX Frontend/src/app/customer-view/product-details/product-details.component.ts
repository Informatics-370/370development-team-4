import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { SizeVM } from '../../shared/size-vm';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {
  outOfStock = false;
  qtyOnHand = 2000000;
  disableAddToCart = true;
  relatedProductsVM: ProductVM[] = []; //all products
  selectedProductVM!: ProductVM; //used to hold all the products that will be displayed to the user
  items: Item[] = []; //used to store all items
  fixedProducts: FixedProductVM[] = []; //used to store all fixed products as fixed products
  sizes: SizeVM[] = [];

  constructor(private dataService: DataService ,private route: ActivatedRoute) { }

  ngOnInit() {
    this.getDataFromDB();
    //Retrieve the item ID from url
    this.route.paramMap.subscribe(params => {
      const itemID = params.get('id');      
      console.log(itemID);
    });
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getItemsPromise = lastValueFrom(this.dataService.GetItems().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getSizesPromise = lastValueFrom(this.dataService.GetSizes().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allItems, allSizes, allFixedProducts] = await Promise.all([
        getItemsPromise,
        getSizesPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.items = allItems;
      this.fixedProducts = allFixedProducts;
      this.sizes = allSizes;
      console.log('For product details: All items: ',this.items, 'allSizes: ', this.sizes, 'and all products: ', this.fixedProducts);

      //this.populateProductList();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }


}
