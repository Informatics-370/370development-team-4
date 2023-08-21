import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { RawMaterialVM } from '../shared/rawMaterialVM';

@Component({
  selector: 'app-product-list-report',
  templateUrl: './product-list-report.component.html',
  styleUrls: ['./product-list-report.component.css']
})
export class ProductListReportComponent {
  //messages to user
  invalid = false;
  loading = false;
  productCount = -1;

  rawMaterials: RawMaterialVM[] = [];
  fixedProducts: FixedProductVM[] = [];
  totalQuantity = 0; //total quantity on hand
  now = new Date(Date.now()); //date report is generated

  constructor(private dataService: DataService) {}

  async generateReport() {
    //turn Observables that retrieve data from DB into promises
    const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
    const getRawMaterialsPromise = lastValueFrom(this.dataService.GetAllRawMaterials().pipe(take(1)));

    const [allFP, allRM] = await Promise.all([
      getFixedProductsPromise,
      getRawMaterialsPromise,
    ]);

    //put results from DB in global arrays
    this.fixedProducts = allFP;
    console.log('All fixed products:', this.fixedProducts);
    this.rawMaterials = allFP;
    console.log('All raw materials:', this.rawMaterials);
    this.productCount = this.fixedProducts.length + this.rawMaterials.length;

    this.totalQuantity = this.calculateTotal();
  }

  calculateTotal(): number {
    let qty = 0;

    this.fixedProducts.forEach(prod => {
      qty += prod.quantityOnHand;
    });

    this.rawMaterials.forEach(rm => {
      qty += rm.quantityOnHand;
    });

    return qty;
  }

}
