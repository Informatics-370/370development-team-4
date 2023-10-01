import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WriteOffReason } from '../shared/write-off-reason';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { Router } from '@angular/router';

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
  selector: 'app-write-off',
  templateUrl: './write-off.page.html',
  styleUrls: ['./write-off.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class WriteOffPage implements OnInit {
  apiUrl = 'http://localhost:5116/api/'
  inventory: InventoryItem[] = [];
  showWriteOffSection = false;
  writeOffReasons: WriteOffReason[] = [];
  isWriteOffClicked = false;
  isCancelClicked = false;
  
  constructor(private httpClient: HttpClient, private router: Router) { }

  //----------------------------------- Authentication ------------------------------------
  getUserRole(token: string): string | null {
    if (token) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  getEmailFromToken(token: string): string | null {
    try {
        const jwtData = token.split('.')[1];
        const decodedJwtJsonData = window.atob(jwtData);
        const decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData['sub'];
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      // return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/Id'];
      return decodedJwtData['UserId'];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  //----------------------------------- Stock Take ----------------------------------------
  writeOff(stockTakeViewModel: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}StockTake/WriteOff`, stockTakeViewModel);
  }

  getAllStockTake(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}StockTake/GetAllStockTake`);
  }

  //------------------------------- Write Off Reasons --------------------------------------
  GetWriteOffReasons(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}WriteOffReason/GetAllWriteOffReasons`)
      .pipe(map(result => result))
  }

  GetWriteOffReason(writeoffreasonId: number): Observable<WriteOffReason> {
    return this.httpClient.get<WriteOffReason>(`${this.apiUrl}WriteOffReason/GetWriteOffReason/${writeoffreasonId}`)
      .pipe(map(result => result));
  }


  GetAllRawMaterials(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RawMaterials/GetAllRawMaterials`)
      .pipe(map(result => result))
  }

  GetAllFixedProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}FixedProduct/GetAllFixedProducts`)
      .pipe(map(result => result))
  }

  ngOnInit() {
    this.fetchInventoryItems();
    this.fetchWriteOffReasons();
  }

  fetchWriteOffReasons() {
    this.GetWriteOffReasons().subscribe(
      (reasons: WriteOffReason[]) => {
        this.writeOffReasons = reasons;
      },
      (error) => {
        console.error('Error fetching write-off reasons:', error);
      }
    );
  }

  fetchInventoryItems() {
    this.GetAllRawMaterials().subscribe(
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
  
    this.GetAllFixedProducts().subscribe(
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
    const token = localStorage.getItem('access_token');
    const userId = this.getUserIdFromToken(token!);
    const stockTakeViewModel = {
      UserId: 'ed2ff2bf-a212-4f09-a3e5-294cd16c5c6b',
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
    console.log(stockTakeViewModel)
    this.cancelWriteOff();
  
    // Make the HTTP POST request to the API
    this.writeOff(stockTakeViewModel).subscribe(
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

  goStockTakeTrail() {
    this.router.navigateByUrl('/stock-take-trail');
  }
}
