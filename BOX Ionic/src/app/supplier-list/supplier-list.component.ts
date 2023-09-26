import { Component, OnInit } from '@angular/core';
import { take, lastValueFrom, Observable, map } from 'rxjs';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { Supplier } from '../shared/supplier';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SupplierListComponent  implements OnInit {

  //messages to user
  loading = false;
  supplierCount = -1;

  rawMaterials: RawMaterialVM[] = [];
  fixedProducts: FixedProductVM[] = [];
  supplierList: Supplier[] = [];
  productDropdown: {
    ID: string,
    description: string,
    isFixedProduct: boolean
  }[] = [];
  selectedProductID = 'NA';
  selectedProduct: any;
  now = new Date(Date.now()); //date report is generated
  apiUrl = 'http://localhost:5116/api/'

  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getProducts();
  }

  GetAllFixedProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}FixedProduct/GetAllFixedProducts`)
      .pipe(map(result => result))
  }

  GetAllRawMaterials(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RawMaterials/GetAllRawMaterials`)
      .pipe(map(result => result))
  }

  GetSupplierListReport(productId: number, isFixedProduct: string): Observable<Supplier[]> {
    return this.httpClient.get<Supplier[]>(`${this.apiUrl}Reports/GetSupplierListReport/${productId}/${isFixedProduct}`);
  }

  async getProducts() {
    //turn Observables that retrieve data from DB into promises
    const getFixedProductsPromise = lastValueFrom(this.GetAllFixedProducts().pipe(take(1)));
    const getRawMaterialsPromise = lastValueFrom(this.GetAllRawMaterials().pipe(take(1)));

    const [allFP, allRM] = await Promise.all([
      getFixedProductsPromise,
      getRawMaterialsPromise,
    ]);

    //put results from DB in global arrays
    this.fixedProducts = allFP;
    this.rawMaterials = allRM;

    //put fp and rm in VM for dropdown
    this.fixedProducts.forEach(prod => {
      let dropdownItem = {
        ID: 'f' + prod.fixedProductID,
        description: prod.description,
        isFixedProduct: true
      };

      this.productDropdown.push(dropdownItem);
    });

    this.rawMaterials.forEach(rm => {
      let dropdownItem = {
        ID: 'r' + rm.rawMaterialID,
        description: rm.description,
        isFixedProduct: false
      };

      this.productDropdown.push(dropdownItem);
    });
  }

  generateReport() {
    this.loading = true;
    if (this.selectedProductID != 'NA') {
      let fixedProduct = this.selectedProductID.includes('f') ? 'true' : 'false';
      this.GetSupplierListReport(parseInt(this.selectedProductID.substring(1)), fixedProduct).subscribe((result) => {
        this.supplierList = result;
        this.supplierCount = this.supplierList.length;
        this.loading = false;
      });
    }
  }

}
