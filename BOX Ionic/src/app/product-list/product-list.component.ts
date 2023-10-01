import { Component, OnInit } from '@angular/core';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { Observable, lastValueFrom, map, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class ProductListComponent  implements OnInit {
//messages to user
loading = false;
productCount = -1;

rawMaterials: RawMaterialVM[] = [];
fixedProducts: FixedProductVM[] = [];
totalQuantity = 0; //total quantity on hand
now = new Date(Date.now()); //date report is generated
apiUrl = 'http://localhost:5116/api/'

constructor(private httpClient: HttpClient) {}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

GetAllFixedProducts(): Observable<any> {
  return this.httpClient.get(`${this.apiUrl}FixedProduct/GetAllFixedProducts`)
    .pipe(map(result => result))
}

GetAllRawMaterials(): Observable<any> {
  return this.httpClient.get(`${this.apiUrl}RawMaterials/GetAllRawMaterials`)
    .pipe(map(result => result))
}

async generateReport() {
  //turn Observables that retrieve data from DB into promises
  const getFixedProductsPromise = lastValueFrom(this.GetAllFixedProducts().pipe(take(1)));
  const getRawMaterialsPromise = lastValueFrom(this.GetAllRawMaterials().pipe(take(1)));

  const [allFP, allRM] = await Promise.all([
    getFixedProductsPromise,
    getRawMaterialsPromise,
  ]);

  //put results from DB in global arrays
  this.fixedProducts = allFP;
  console.log('All fixed products:', this.fixedProducts);
  this.rawMaterials = allRM;
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
