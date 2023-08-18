import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Observer, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Size } from '../shared/Size';
import { CategoryVM } from '../shared/category-vm';
import { Item } from '../shared/item';
import { ItemVM } from '../shared/item-vm';
import { RefundReason } from '../shared/refund-reason';
import { WriteOffReason } from '../shared/write-off-reason';
import { VAT } from '../shared/vat';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { EstimateDuration } from '../shared/estimate-duration';
import { SizeVM } from '../shared/size-vm';
import { Supplier } from '../shared/supplier';
import { Customer } from '../shared/customer';
import { CostPriceFormulaVariables } from '../shared/cost-price-formula-variables';
import { EstimateVM } from '../shared/estimate-vm';
import { Role } from '../shared/role';
import { SupplierOrderVM } from '../shared/supplierOrder-vm';
import { Discount } from '../shared/discount';
import { Users } from '../shared/user';
import { OrderVM } from '../shared/order-vm';

imports: [
  HttpClientModule
]
@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'http://localhost:5116/api/'

  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) {
  }

  //--------------------------------Size Units------------------------------------//

  GetSizes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Size/GetAllSizes`)
      .pipe(map(result => result))
  }

  getSize(sizeId: number): Observable<SizeVM> {
    return this.httpClient.get<SizeVM>(`${this.apiUrl}Size/GetSize/${sizeId}`)
      .pipe(map(result => result));
  }

  AddSize(SizeVM: SizeVM): Observable<SizeVM> {
    return this.httpClient.post<SizeVM>(
      `${this.apiUrl}Size/AddSizeUnit`,
      SizeVM,
      this.httpOptions
    );
  }

  DeleteSize(sizeId: number): Observable<Size[]> {
    console.log(sizeId);
    return this.httpClient.delete<Size[]>(`${this.apiUrl}Size/DeleteSize/${sizeId}`, this.httpOptions)
  }
  EditSize(sizeId: number, SizeVM: SizeVM): Observable<SizeVM> {
    return this.httpClient.put<SizeVM>(
      `${this.apiUrl}Size/EditSize/${sizeId}`,
      SizeVM,
      this.httpOptions
    );
  }

  //------------PRODUCT CATEGORY------------ [Give it its own service?]
  GetCategories(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ProductCategory/GetAllCategories`)
      .pipe(map(result => result))
  }

  GetCategory(categoryId: number): Observable<CategoryVM> {
    return this.httpClient.get<CategoryVM>(`${this.apiUrl}ProductCategory/GetCategory/${categoryId}`)
      .pipe(map(result => result));
  }

  AddCategory(catVM: CategoryVM): Observable<CategoryVM> {
    return this.httpClient.post<CategoryVM>(
      `${this.apiUrl}ProductCategory/AddCategory`, catVM, this.httpOptions
    );
  }

  DeleteCategory(categoryId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ProductCategory/DeleteCategory/${categoryId}`, this.httpOptions);
  }

  UpdateCategory(categoryId: number, categoryVM: CategoryVM): Observable<CategoryVM> {
    return this.httpClient.put<CategoryVM>(`${this.apiUrl}ProductCategory/UpdateCategory/${categoryId}`, categoryVM, this.httpOptions);
  }

  //------------PRODUCT ITEM------------ [Give it its own service?]
  GetItems(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ProductItem/GetAllItems`)
      .pipe(map(result => result))
  }

  GetItem(itemId: number): Observable<Item> {
    return this.httpClient.get<Item>(`${this.apiUrl}ProductItem/GetItem/${itemId}`)
      .pipe(map(result => result));
  }

  AddItem(itemVM: ItemVM): Observable<ItemVM> {
    return this.httpClient.post<ItemVM>(
      `${this.apiUrl}ProductItem/AddItem`, itemVM, this.httpOptions
    );
  }

  DeleteItem(itemId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ProductItem/DeleteItem/${itemId}`, this.httpOptions);
  }

  UpdateItem(itemId: number, itemVM: ItemVM): Observable<ItemVM> {
    return this.httpClient.put<ItemVM>(`${this.apiUrl}ProductItem/UpdateItem/${itemId}`, itemVM, this.httpOptions);
  }

  //------------CUSTOMER REFUND REASON------------ [Give it its own service?]
  GetRefundReasons(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RefundReason/GetAllCustomerRefundReasons`)
      .pipe(map(result => result))
  }

  GetRefundReason(customerrefundreasonId: number): Observable<RefundReason> {
    return this.httpClient.get<RefundReason>(`${this.apiUrl}RefundReason/GetCustomerRefundReason/${customerrefundreasonId}`)
      .pipe(map(result => result));
  }

  AddReason(rrvm: any): Observable<RefundReason> {
    return this.httpClient.post<RefundReason>(
      `${this.apiUrl}RefundReason/AddRefundReason`, rrvm, this.httpOptions
    );
  }

  DeleteRefundReason(customerrefundreasonId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}RefundReason/DeleteCustomerRefundReason/${customerrefundreasonId}`, this.httpOptions);
  }

  UpdateRefundReason(customerrefundreasonId: number, refundreasonModel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}RefundReason/EditCustomerRefundReason/${customerrefundreasonId}`, refundreasonModel, this.httpOptions);
  }

  //----------WRITE-OFF REASON---------------
  GetWriteOffReasons(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}WriteOffReason/GetAllWriteOffReasons`)
      .pipe(map(result => result))
  }

  GetWriteOffReason(writeoffreasonId: number): Observable<WriteOffReason> {
    return this.httpClient.get<WriteOffReason>(`${this.apiUrl}WriteOffReason/GetWriteOffReason/${writeoffreasonId}`)
      .pipe(map(result => result));
  }

  AddWriteOffReason(worvm: any): Observable<WriteOffReason> {
    return this.httpClient.post<WriteOffReason>(
      `${this.apiUrl}WriteOffReason/AddWriteOffReason`, worvm, this.httpOptions
    );
  }

  DeleteWriteOffReason(writeoffreasonId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}WriteOffReason/DeleteWriteOffReason/${writeoffreasonId}`, this.httpOptions);
  }

  UpdateWriteOffReason(writeoffreasonId: number, writeoffreasonmodel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}WriteOffReason/EditWriteOffReason/${writeoffreasonId}`, writeoffreasonmodel, this.httpOptions);
  }

  //------------VAT------------
  GetAllVAT(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}VAT/GetAllVATs`)
      .pipe(map(result => result))
  }

  GetVAT(vatId: number): Observable<VAT> {
    return this.httpClient.get<VAT>(`${this.apiUrl}VAT/GetVat/${vatId}`)
      .pipe(map(result => result));
  }

  AddVAT(newVAT: VAT): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}VAT/AddVat`, newVAT, this.httpOptions
    );
  }

  DeleteVAT(vatId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}VAT/DeleteVat/${vatId}`, this.httpOptions);
  }

  UpdateVAT(vatId: number, updatedVAT: VAT): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}VAT/EditVat/${vatId}`, updatedVAT, this.httpOptions);
  }

  //-------------------------------------------------------FIXED PRODUCT-------------------------------------------------------
  GetAllFixedProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}FixedProduct/GetAllFixedProducts`)
      .pipe(map(result => result))
  }

  GetFixedProduct(fixedProductId: number): Observable<FixedProductVM> {
    return this.httpClient.get<FixedProductVM>(`${this.apiUrl}FixedProduct/GetFixedProduct/${fixedProductId}`)
      .pipe(map(result => result));
  }

  AddFixedProduct(fixedProductViewModel: FixedProductVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}FixedProduct/CreateFixedProduct`, fixedProductViewModel, this.httpOptions
    );
  }

  UpdateFixedProduct(fixedProductId: number, fixedProductViewModel: FixedProductVM): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}FixedProduct/UpdateFixedProduct/${fixedProductId}`, fixedProductViewModel, this.httpOptions);
  }

  DeleteFixedProduct(fixedProductId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}FixedProduct/DeleteFixedProduct/${fixedProductId}`, this.httpOptions);
  }

  //------------ESTIMATE DURATION------------ 
  GetEstimateDurations(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}EstimateDuration/GetAllEstimateDurations`)
      .pipe(map(result => result))
  }

  GetEstimateDuration(estimatedurationId: number): Observable<EstimateDuration> {
    return this.httpClient.get<EstimateDuration>(`${this.apiUrl}EstimateDuration/GetEstimateDuration/${estimatedurationId}`)
      .pipe(map(result => result));
  }

  AddEstimateDuration(rrvm: any): Observable<EstimateDuration> {
    return this.httpClient.post<EstimateDuration>(
      `${this.apiUrl}EstimateDuration/AddEstimateDuration`, rrvm, this.httpOptions
    );
  }

  DeleteEstimateDuration(estimatedurationId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}EstimateDuration/DeleteEstimateDuration/${estimatedurationId}`, this.httpOptions);
  }

  UpdateEstimateDuration(estimatedurationId: number, estimatedurationModel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}EstimateDuration/EditEstimateDuration/${estimatedurationId}`, estimatedurationModel, this.httpOptions);
  }

  //----------RAW MATERIAL---------------
  GetAllRawMaterials(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}RawMaterials/GetAllRawMaterials`)
      .pipe(map(result => result))
  }

  GetRawMaterial(rawmaterialId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}RawMaterials/GetRawMaterial/${rawmaterialId}`)
      .pipe(map(result => result));
  }

  AddRawMaterial(rawMaterialDescription: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}RawMaterials/AddRawMaterial/${rawMaterialDescription}`, this.httpOptions
    );
  }

  DeleteRawMaterial(rawmaterialId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}RawMaterials/DeleteRawMaterial/${rawmaterialId}`, this.httpOptions);
  }

  UpdateRawMaterial(rawmaterialId: number, rawMaterialDescription: string): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}RawMaterials/EditRawMaterial/${rawmaterialId}/${rawMaterialDescription}`, this.httpOptions);
  }

  UpdateRawMaterialQuantity(rawId: number, rawQuantity: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}EditRawMaterialQuantity/{rawmaterialId}/{rawMaterialQuantityOnHand}`, this.httpOptions);
  }


  //------------------------------Supplier--------------------------//
  GetAllSuppliers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Supplier/GetAllSuppliers`)
      .pipe(map(result => result))
  }

  GetSupplier(supplierId: number): Observable<Supplier> {
    return this.httpClient.get<Supplier>(`${this.apiUrl}Supplier/GetSupplier/${supplierId}`)
      .pipe(map(result => result));
  }

  AddSupplier(svm: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}Supplier/AddSupplier`, svm, this.httpOptions
    );
  }

  DeleteSupplier(supplierId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Supplier/DeleteSupplier/${supplierId}`, this.httpOptions);
  }

  UpdateSupplier(supplierId: number, svm: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Supplier/UpdateSupplier/${supplierId}`, svm, this.httpOptions);
  }

  //---------------------------------------Customer--------------------------------------------
  // GetCustomer(customerId: number): Observable<Customer> {
  //   return this.httpClient.get<Customer>(`${this.apiUrl}Customer/GetCustomer/${customerId}`)
  //     .pipe(map(result => result));
  // }

  //---------------------------------------ESTIMATE----------------------------------
  GetAllEstimates(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Estimate/GetAllEstimates`)
      .pipe(map(result => result))
  }

  GetEstimate(estimateId: number): Observable<EstimateVM> {
    return this.httpClient.get<EstimateVM>(`${this.apiUrl}Estimate/GetEstimate/${estimateId}`)
      .pipe(map(result => result));
  }

  GetEstimatesByCustomer(customerId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Estimate/GetEstimateByCustomer/${customerId}`).pipe(map(result => result));
  }

  AddEstimate(estimateViewModel: EstimateVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}Estimate/AddEstimate`, estimateViewModel, this.httpOptions
    );
  }

  UpdateEstimate(estimateId: number, estimateViewModel: EstimateVM): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Estimate/UpdateEstimate/${estimateId}`, estimateViewModel, this.httpOptions);
  }

  UpdateEstimateStatus(estimateId: number, statusId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Estimate/UpdateEstimateStatus/${estimateId}/${statusId}`, this.httpOptions);
  }

  DeleteEstimate(estimateId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Estimate/DeleteEstimate/${estimateId}`, this.httpOptions);
  }

  //-----------------------------COST PRICE FORMULA VARIABLES-----------------------------
  GetAllFormulaVariables(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}CostPriceFormulaVariables/GetAllFormulaVariables`)
      .pipe(map(result => result))
  }

  GetFormulaVariables(formulaId: number): Observable<CostPriceFormulaVariables> {
    return this.httpClient.get<CostPriceFormulaVariables>(`${this.apiUrl}CostPriceFormulaVariables/GetFormulaVariables/${formulaId}`)
      .pipe(map(result => result));
  }

  UpdateFormulaVariables(formulaId: number, updatedCPFV: CostPriceFormulaVariables): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}CostPriceFormulaVariables/EditFormulaVariables/${formulaId}`, updatedCPFV, this.httpOptions);
  }

      // Get all Roles
  GetAllRoles(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(`${this.apiUrl}Roles/GetAllRoles`)
      .pipe(map(result => result));
  }

  // Get a specific Role by ID
  GetRole(roleId: number): Observable<Role> {
    return this.httpClient.get<Role>(`${this.apiUrl}Roles/GetRole/${roleId}`)
      .pipe(map(result => result));
  }

  // Add a new Role
  AddRole(newRole: Role): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}Roles/CreateRole`, newRole, this.httpOptions
    );
  }

  // Delete a Role by ID
  DeleteRole(roleId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Roles/DeleteRole/${roleId}`, this.httpOptions);
  }

  // Update a Role by ID
  UpdateRole(roleId: number, updatedRole: Role): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Roles/UpdateRole/${roleId}`, updatedRole, this.httpOptions);
  }

//Supplier Orders
AddSupplierOrder(newSupplierOrder:SupplierOrderVM):Observable<any>{
  return this.httpClient.post<any>(
    `${this.apiUrl}SupplierOrder/AddSupplierOrder`, newSupplierOrder, this.httpOptions
  );
}


  //------------DISCOUNTS------------ 
  GetDiscounts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Discount/GetAllDiscounts`)
      .pipe(map(result => result))
  }


  GetDiscount(discountId: number): Observable<Discount> {
    return this.httpClient.get<Discount>(`${this.apiUrl}Discount/GetDiscount/${discountId}`)
      .pipe(map(result => result));
  }

  AddDiscount(rrvm: any): Observable<Discount> {
    return this.httpClient.post<Discount>(
      `${this.apiUrl}Discount/AddDiscount`, rrvm, this.httpOptions
    );
  }

  DeleteDiscount(discountId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}Discount/DeleteDiscount/${discountId}`, this.httpOptions);
  }

  UpdateDiscount(discountId: number, discountModel: Discount): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Discount/EditDiscount/${discountId}`, discountModel, this.httpOptions);
  }
  //------------------------------------------------------Users----------------------------------------------------------
  GetUsers(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}User/GetAllUsers`)
      .pipe(map(result => result))
  }


   DeleteUser(emailOrPhoneNumber: string): Observable<any> {
     return this.httpClient.delete<any>(`${this.apiUrl}User/DeleteUser/${emailOrPhoneNumber}`, this.httpOptions);
   }

   UpdateUser(email: string, updatedUser: Users): Observable<any> {
     return this.httpClient.put<any>(`${this.apiUrl}User/UpdateUser/${email}`, updatedUser, this.httpOptions);
   }

   
  GetUser(emailOrPhoneNumber: string): Observable<Users> {
    return this.httpClient.get<Users>(`${this.apiUrl}User/GetUserByEmailOrPhoneNumber/${emailOrPhoneNumber}`)
      .pipe(map(result => result));
  }

  //----------------------------------- Stock Take ----------------------------------------
  writeOff(stockTakeViewModel: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}StockTake/WriteOff`, stockTakeViewModel);
  }

  getAllStockTake(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}StockTake/GetAllStockTake`);
  }
  //---------------------------------------ORDER----------------------------------
  GetAllCustomerOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}CustomerOrder/GetAllCustomerOrders`)
      .pipe(map(result => result))
  }

  GetOrder(customerOrderId: number): Observable<OrderVM> {
    return this.httpClient.get<OrderVM>(`${this.apiUrl}CustomerOrder/GetOrder/${customerOrderId}`)
      .pipe(map(result => result));
  }

  GetOrdersByCustomer(customerId: number): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}CustomerOrder/GetOrderByCustomer/${customerId}`).pipe(map(result => result));
  }

  AddCustomerOrder(customerOrderViewModel: OrderVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}CustomerOrder/AddCustomerOrder`, customerOrderViewModel, this.httpOptions
    );
  }

  UpdateOrderStatus(customerOrderId: number, customerOrderStatusId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}CustomerOrder/UpdateCustomerOrderStatus/${customerOrderId}/${customerOrderStatusId}`, this.httpOptions);
  }

}