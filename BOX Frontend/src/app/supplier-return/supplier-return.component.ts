import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { Supplier } from '../shared/supplier';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-return.component.html',
  styleUrls: ['./supplier-return.component.css']
})
export class SupplierReturnComponent {
  public selectedValue = 'NA';
  suppliers: Supplier[] = [];
  rawMaterials: RawMaterialVM[] = [];
  fixedProducts: FixedProductVM[] = [];
  orderForm: FormGroup = new FormGroup({});
  selectedProductItemID: number | null = null;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      supplierID: ['NA', Validators.required],
      prodType: ['NA', Validators.required],
      prodItemID: ['NA', Validators.required],
      quantity: [0, Validators.required]
    });

    this.getAllSuppliers();
  }

  getAllSuppliers() {
    this.dataService.GetAllSuppliers().subscribe((result: any[]) => {
      this.suppliers = result.map((supplier: Supplier) => {
        return {
          contact_Number: supplier.contact_Number,
          supplierID: supplier.supplierID,
          name: supplier.name,
          address:supplier.address,
          email:supplier.email
        };
      });
    });
  }

  getAllRawMaterials() {
    this.dataService.GetAllRawMaterials().subscribe((result: any[]) => {
      this.rawMaterials = result.map((raw: RawMaterialVM) => {
        return {
          rawMaterialID: raw.rawMaterialID,
          description: raw.description,
          qrCodeID: raw.qrCodeID,
          qrCodeBytesB64: raw.qrCodeBytesB64,
          quantityOnHand: raw.quantityOnHand
        };
      });
    });
  }

  getAllFixedProducts() {
    this.dataService.GetAllFixedProducts().subscribe((result: any[]) => {
      this.fixedProducts = result.map((fixed: FixedProductVM) => {
        return {
          fixedProductID: fixed.fixedProductID,
          qrCodeID: fixed.qrCodeID,
          qrCodeBytesB64: fixed.qrCodeBytesB64,
          itemID: fixed.itemID,
          sizeID: fixed.sizeID,
          description: fixed.description,
          price: fixed.price,
          productPhotoB64: fixed.productPhotoB64,
          quantityOnHand: fixed.quantityOnHand
        };
      });
    });
  }

  onProductTypeChange() {
    this.rawMaterials = [];
    this.fixedProducts = [];

    if (this.orderForm.value.prodType === 'Raw Material') {
      this.getAllRawMaterials();
    } else if (this.orderForm.value.prodType === 'Fixed Product') {
      this.getAllFixedProducts();
    }
  }

  onProductItemChange() {
    this.selectedProductItemID = this.orderForm.value.prodItemID;
  }

  onSaveOrder() {
    if (this.selectedValue === 'Fixed Product') {
      // Find the selected fixed product by its ID
      const selectedFixedProduct = this.fixedProducts.find(fixed => fixed.fixedProductID ==this.selectedProductItemID);
      if (selectedFixedProduct) {
        // Update the quantity on hand for the selected fixed product
        selectedFixedProduct.quantityOnHand += this.orderForm.value.quantity;

        // Now, call the API to update the quantity on hand in the database
        this.dataService.UpdateFixedProduct(selectedFixedProduct.fixedProductID, selectedFixedProduct).subscribe(
          () => {
            console.log('Fixed product quantity updated successfully.');
            // Optionally, you may want to perform additional actions after the update is successful.
          },
          error => {
            console.error('Failed to update fixed product quantity:', error);
          }
        );
      }
    } else if (this.selectedValue === 'Raw Material') {
      // Find the selected raw material by its ID
      const selectedRawMaterial = this.rawMaterials.find(raw => raw.rawMaterialID == this.selectedProductItemID);
      console.log("Selected Raw Material:"+ selectedRawMaterial)
      console.log("The ID number for the Raw Material is:"+ this.selectedProductItemID )

      if (selectedRawMaterial) {
        // Update the quantity on hand for the selected raw material
        selectedRawMaterial.quantityOnHand += this.orderForm.value.quantity;

        // Now, call the API to update the quantity on hand in the database
        this.dataService.UpdateRawMaterialQuantity(selectedRawMaterial.rawMaterialID, selectedRawMaterial.quantityOnHand).subscribe(
          () => {
            console.log('Raw material quantity updated successfully.');
            // Optionally, you may want to perform additional actions after the update is successful.
          },
          error => {
            console.error('Failed to update raw material quantity:', error);
          }
        );
      }
    }
  }
}
