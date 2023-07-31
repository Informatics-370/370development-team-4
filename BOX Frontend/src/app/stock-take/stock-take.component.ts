import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { HttpClient } from '@angular/common/http';
import { WriteOffReason } from '../shared/write-off-reason';

interface InventoryItem {
  fixedProductId: number;
  rawMaterialId: number;
  rawMaterialDescription: string;
  fixedProductDescription: string;
  quantity: number;
  WriteOffReasonID: number;
  saveItem: boolean;
}

@Component({
  selector: 'app-stock-take',
  templateUrl: './stock-take.component.html',
  styleUrls: ['./stock-take.component.css']
})
export class StockTakeComponent implements OnInit {
  inventory: InventoryItem[] = [];
  showWriteOffSection = false;
  writeOffReasons: WriteOffReason[] = [];
  isWriteOffClicked = false;
  isCancelClicked = false;

  constructor(private dataService: DataService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchInventoryItems();
    this.fetchWriteOffReasons();
  }

  fetchWriteOffReasons() {
    this.dataService.GetWriteOffReasons().subscribe(
      (reasons: WriteOffReason[]) => {
        this.writeOffReasons = reasons;
      },
      (error) => {
        console.error('Error fetching write-off reasons:', error);
      }
    );
  }

  fetchInventoryItems() {
    this.dataService.GetAllRawMaterials().subscribe(
      (rawMaterials: RawMaterialVM[]) => {
        this.inventory = this.inventory.concat(rawMaterials.map((rawMaterial) => ({
          fixedProductId: 0,
          rawMaterialId: rawMaterial.rawMaterialID,
          rawMaterialDescription: rawMaterial.description,
          fixedProductDescription: '',
          quantity: rawMaterial.quantityOnHand,
          WriteOffReasonID: 1,
          saveItem: false
        })));
      },
      (error) => {
        console.error('Error fetching raw materials:', error);
      }
    );
  
    this.dataService.GetAllFixedProducts().subscribe(
      (fixedProducts: FixedProductVM[]) => {
        this.inventory = this.inventory.concat(fixedProducts.map((fixedProduct) => ({
          rawMaterialId: 0,
          fixedProductId: fixedProduct.fixedProductID,
          fixedProductDescription: fixedProduct.description,
          rawMaterialDescription: '',
          quantity: fixedProduct.quantityOnHand,
          WriteOffReasonID: 1,
          saveItem: false
        })));
      },
      (error) => {
        console.error('Error fetching fixed products:', error);
      }
    );
  }
  

  toggleWriteOff() {
    this.isWriteOffClicked = true;
    this.showWriteOffSection = true;
  }

  cancelWriteOff() {
    // Reset the data and disable the Save Changes button
    this.isCancelClicked = true;
    this.inventory.forEach((item) => {
      item.saveItem = false;
      item.quantity = item.quantity;
      item.WriteOffReasonID = 1;
    });
    this.isWriteOffClicked = false;
    this.isCancelClicked = false;
    this.showWriteOffSection = false;
  }

  saveChanges() {
    const stockTakeViewModel = {
      UserId: '917744e7-dc08-4e82-8559-8c1274dba831',
      Date: new Date().toISOString(),
      WriteOffs: this.inventory
        .filter(item => item.saveItem) // Only include items with saveItem set to true
        .map(item => ({
          WriteOffReasonID: item.WriteOffReasonID,
          FixedProductId: item.fixedProductId,
          RawMaterialId: item.rawMaterialId,
          Quantity: item.quantity,
          rawMaterialDescription: item.rawMaterialDescription,
          fixedProductDescription: item.fixedProductDescription
        }))
    };

    this.cancelWriteOff();
  
    // Make the HTTP POST request to the API
    this.dataService.writeOff(stockTakeViewModel).subscribe(
      (response) => {
        console.log('Stock take successful:', response);
        // Implement any additional logic or notifications after successful write-off
      },
      (error) => {
        console.error('Error performing stock take:', error);
        // Implement any error handling or notifications in case of an error
      }
    );
  }  
}
