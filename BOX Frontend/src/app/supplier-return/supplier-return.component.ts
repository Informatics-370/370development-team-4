import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { Supplier } from '../shared/supplier';
import { SupplierOrderLineVM } from '../shared/supplierOrderline-vm';
import { SupplierOrderComponent } from '../supplier-order/supplier-order.component';
import { SupplierOrderVM } from '../shared/supplierOrder-vm';
import { SupplierReturn } from '../shared/supplierReturn';

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
  SupplierReturnForm: FormGroup = new FormGroup({});
  selectedProductItemID: number | null = null;
  SupplierOrder: SupplierOrderVM[] = [];
  public selectedfixedprodID = 'NA';
  public selectedrawmatID = 'NA';
  public feedback: string = ''; //feedback message


  constructor(private dataService: DataService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.SupplierReturnForm = this.formBuilder.group({
      supplierID: [0, Validators.required],
      quantity: [0, Validators.required],
      prodItemID: [0, Validators.required],
      productType: ['NA', Validators.required]
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
          address: supplier.address,
          email: supplier.email
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


    if (this.SupplierReturnForm.value.productType === 'Raw Material') {
      this.getAllRawMaterials();
    } else if (this.SupplierReturnForm.value.productType === 'Fixed Product') {
      this.getAllFixedProducts();
    }
  }

  onProductItemChange() {
    this.selectedProductItemID = this.SupplierReturnForm.value.prodItemID;
  }

  // onSaveOrder() { //Reduces quanity on hand?
  //   if (this.selectedValue === 'Fixed Product') {
  //     // Find the selected fixed product by its ID
  //     const selectedFixedProduct = this.fixedProducts.find(fixed => fixed.fixedProductID ==this.selectedProductItemID);
  //     if (selectedFixedProduct) {
  //       // Update the quantity on hand for the selected fixed product
  //       selectedFixedProduct.quantityOnHand -= this.orderForm.value.quantity;

  //       // Now, call the API to update the quantity on hand in the database
  //       this.dataService.UpdateFixedProduct(selectedFixedProduct.fixedProductID, selectedFixedProduct).subscribe(
  //         () => {
  //           console.log('Fixed product quantity updated successfully.');
  //           // Optionally, you may want to perform additional actions after the update is successful.
  //         },
  //         error => {
  //           console.error('Failed to update fixed product quantity:', error);
  //         }
  //       );
  //     }
  //   } else if (this.selectedValue === 'Raw Material') {
  //     // Find the selected raw material by its ID
  //     const selectedRawMaterial = this.rawMaterials.find(raw => raw.rawMaterialID == this.selectedProductItemID);
  //     console.log("Selected Raw Material:"+ selectedRawMaterial)
  //     console.log("The ID number for the Raw Material is:"+ this.selectedProductItemID )

  //     if (selectedRawMaterial) {
  //       // Update the quantity on hand for the selected raw material
  //       selectedRawMaterial.quantityOnHand -= this.orderForm.value.quantity;

  //       // Now, call the API to update the quantity on hand in the database
  //       this.dataService.UpdateRawMaterialQuantity(selectedRawMaterial.rawMaterialID, selectedRawMaterial.quantityOnHand).subscribe(
  //         () => {
  //           console.log('Raw material quantity updated successfully.');
  //           // Optionally, you may want to perform additional actions after the update is successful.
  //         },
  //         error => {
  //           console.error('Failed to update raw material quantity:', error);
  //         }
  //       );
  //     }
  //   }
  // }
  ReturnProduct() {
    if (this.SupplierReturnForm.valid) { //&&  (this.selectedfixedprodID != 'NA' || this.selectedrawmatID != 'NA')
      //  var selectedfixedprod: FixedProductVM | undefined = undefined;
      //  var selectedrawmat: RawMaterialVM | undefined = undefined;
      const FormData = this.SupplierReturnForm.value;

      // if (this.selectedfixedprodID != 'NA')

      //   selectedfixedprod = this.fixedProducts.find(prod => prod.fixedProductID == parseInt(this.selectedfixedprodID))

      //  else  

      //       selectedrawmat = this.rawMaterials.find(mat => mat.rawMaterialID == parseInt(this.selectedrawmatID));

      if (this.selectedValue == 'Fixed Product') {
        // Find the selected fixed product by its ID
        const selectedFixedProduct = this.fixedProducts.find(fixed => fixed.fixedProductID == this.selectedProductItemID);
        if (selectedFixedProduct) {
          // Update the quantity on hand for the selected fixed product
          if (selectedFixedProduct.quantityOnHand >= this.SupplierReturnForm.value.quantity) {
            selectedFixedProduct.quantityOnHand -= this.SupplierReturnForm.value.quantity;


            this.dataService.UpdateFixedProductQuantity(selectedFixedProduct.fixedProductID, selectedFixedProduct.quantityOnHand).subscribe(
              (result: any) => {
                console.log("Successful FP: ", selectedFixedProduct.quantityOnHand);
                this.feedback = 'Successfully logged supplier return';


              },
              (error) => {
                console.log("error updating quantity");
                this.feedback = 'Failed to log a supplier return';
              }
            );
          }

          else
            console.log("Quantity FP to reduce exceeds quantity on hand,", this.SupplierReturnForm.value.quantity);
          this.feedback = 'Quantity entered exceeds quantity on hand';
        }
      } else
        if (this.selectedValue == 'Raw Material') {
          // Find the selected raw material by its ID
          const selectedRawMaterial = this.rawMaterials.find(raw => raw.rawMaterialID == this.selectedProductItemID);
          if (selectedRawMaterial) {
            // Update the quantity on hand for the selected fixed product
            if (selectedRawMaterial.quantityOnHand >= this.SupplierReturnForm.value.quantity) {
              selectedRawMaterial.quantityOnHand -= this.SupplierReturnForm.value.quantity;

              this.dataService.UpdateRawMaterialQuantity(selectedRawMaterial.rawMaterialID, selectedRawMaterial.quantityOnHand).subscribe(
                (result: any) => {
                  console.log("Successful RM: ", selectedRawMaterial.quantityOnHand);
                  this.feedback = 'Successfully logged supplier return';
                },
                (error) => {
                  console.log("error updating quantity");
                  this.feedback = 'Failed to log a supplier return';
                }
              );
            }
            else console.log("Quantity RM to reduce exceeds quantity on hand", this.SupplierReturnForm.value.quantity);
            this.feedback = 'Quantity entered exceeds quantity on hand';
          }


        }

      let productreturn: SupplierReturn = {
        // fixedProductID: selectedfixedprod ? selectedfixedprod.fixedProductID : 0 ,

        // rawMaterialID: selectedrawmat ? selectedrawmat.rawMaterialID : 0,
        supplierReturnID: 0,
        date: ' ',
        quantity: FormData.quantity
      }
      console.log("SupplierReturnLine: ", productreturn);

    }
    //Reset form
    this.SupplierReturnForm.get('quantity')?.setValue(0);
    this.selectedProductItemID = 0;
  }

  //quantityOnHand: number = this.SupplierOrder.quantity; // Initial quantity on hand

  // reduceQuantity(amount: number) {

  //   if (amount > 0 && amount <= this.quantityOnHand) {

  //     this.quantityOnHand -= amount; //amount(in form)

  //   } else {

  //     // Handle invalid quantity reduction (e.g., show an error message)

  //     console.error('Invalid quantity reduction');

  //   }

  // }



}
