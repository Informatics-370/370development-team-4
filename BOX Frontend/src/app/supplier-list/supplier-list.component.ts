import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { Supplier } from '../shared/supplier';
import * as html2pdf from 'html2pdf.js'
@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent {  
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

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    //turn Observables that retrieve data from DB into promises
    const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
    const getRawMaterialsPromise = lastValueFrom(this.dataService.GetAllRawMaterials().pipe(take(1)));

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
      this.dataService.GetSupplierListReport(parseInt(this.selectedProductID.substring(1)), fixedProduct).subscribe((result) => {
        this.supplierList = result;
        this.supplierCount = this.supplierList.length;
        this.loading = false;
      });
    }
  }

  generatePDFReport() {
    const content = document.getElementById('pdf-content');
    
    if (content) {
      html2pdf().from(content).save();
    }
  }
}
