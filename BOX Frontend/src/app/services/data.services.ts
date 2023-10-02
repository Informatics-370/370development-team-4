import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Observer, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Size } from '../shared/Size';
import { CategoryVM } from '../shared/category-vm';
import { Item } from '../shared/item';
import { ItemVM } from '../shared/item-vm';
import { CustomProductVM } from '../shared/custom-product-vm';
import { ReturnReason } from '../shared/return-reason';
import { WriteOffReason } from '../shared/write-off-reason';
import { VAT } from '../shared/vat';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { QuoteDuration } from '../shared/quote-duration';
import { SizeVM } from '../shared/size-vm';
import { Supplier } from '../shared/supplier';
import { Customer } from '../shared/customer';
import { CostPriceFormulaVariables } from '../shared/cost-price-formula-variables';
import { Role } from '../shared/role';
import { SupplierOrderVM } from '../shared/supplierOrder-vm';
import { Discount } from '../shared/discount';
import { Users } from '../shared/user';
import { OrderVM } from '../shared/order-vm';
import { QuoteVM } from '../shared/quote-vm';
import { WriteOffItem } from '../shared/write-off-item';
import { AllCustomerDetailsVM } from '../shared/all-customer-details-vm';

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

  //------------CUSTOMER RETURN REASON------------ [Give it its own service?]
  GetReturnReasons(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}ReturnReason/GetAllCustomerReturnReasons`)
      .pipe(map(result => result))
  }

  GetReturnReason(customerreturnreasonId: number): Observable<ReturnReason> {
    return this.httpClient.get<ReturnReason>(`${this.apiUrl}ReturnReason/GetCustomerReturnReason/${customerreturnreasonId}`)
      .pipe(map(result => result));
  }

  AddReason(rrvm: any): Observable<ReturnReason> {
    return this.httpClient.post<ReturnReason>(
      `${this.apiUrl}ReturnReason/AddReturnReason`, rrvm, this.httpOptions
    );
  }

  DeleteReturnReason(customerreturnreasonId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}ReturnReason/DeleteCustomerReturnReason/${customerreturnreasonId}`, this.httpOptions);
  }

  UpdateReturnReason(customerreturnreasonId: number, returnreasonModel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}ReturnReason/EditCustomerReturnReason/${customerreturnreasonId}`, returnreasonModel, this.httpOptions);
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
    return this.httpClient.get(`${this.apiUrl}VAT/GetAllVAT`)
      .pipe(map(result => result))
  }

  GetVAT(): Observable<VAT> {
    return this.httpClient.get<VAT>(`${this.apiUrl}VAT/GetVAT`)
      .pipe(map(result => result));
  }

  AddVAT(newVAT: VAT): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}VAT/AddVAT`, newVAT, this.httpOptions
    );
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

  //------------QUOTE DURATION------------
  GetQuoteDuration(quotedurationId: number): Observable<QuoteDuration> {
    return this.httpClient.get<QuoteDuration>(`${this.apiUrl}QuoteDuration/GetQuoteDuration/${quotedurationId}`)
      .pipe(map(result => result));
  }

  UpdateQuoteDuration(quotedurationId: number, quotedurationModel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}QuoteDuration/EditQuoteDuration/${quotedurationId}`, quotedurationModel, this.httpOptions);
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
  /* GetCustomer(customerId: number): Observable<Customer> {
     return this.httpClient.get<Customer>(`${this.apiUrl}Customer/GetCustomer/${customerId}`)
       .pipe(map(result => result));
  } */

  //------------------------------------------ QUOTE ------------------------------------------
  GetAllQuotes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Quote/GetAllQuotes`)
      .pipe(map(result => result))
  }

  GetQuote(quoteId: number): Observable<QuoteVM> {
    return this.httpClient.get<QuoteVM>(`${this.apiUrl}Quote/GetQuote/${quoteId}`)
      .pipe(map(result => result));
  }

  GetQuotesByCustomer(customerId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Quote/GetQuoteByCustomer/${customerId}`).pipe(map(result => result));
  }

  GetCustomerMostRecentQuote(customerId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}Quote/GetCustomerMostRecentQuote/${customerId}`).pipe(map(result => result));
  }

  AddQuote(quoteViewModel: QuoteVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}Quote/AddQuote`, quoteViewModel, this.httpOptions
    );
  }

  RejectQuote(quoteVM: QuoteVM): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Quote/RejectQuote`, quoteVM, this.httpOptions);
  }
  
  UpdateQuoteStatus(quoteId: number, statusId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}Quote/UpdateQuoteStatus/${quoteId}/${statusId}`, this.httpOptions);
  }
  
  GetAllRejectReasons(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Quote/GetAllRejectReasons`)
      .pipe(map(result => result))
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
  GetRole(roleId: string): Observable<Role> {
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
  AddSupplierOrder(newSupplierOrder: SupplierOrderVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}SupplierOrder/AddSupplierOrder`, newSupplierOrder, this.httpOptions
    );
  }

  GetAllSupplierOrders(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}SupplierOrder/GetAllSupplierOrders`)
      .pipe(map(result => result))
  }




  //------------DISCOUNTS------------ 
  GetDiscounts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}BulkDiscount/GetAllDiscounts`)
      .pipe(map(result => result))
  }


  GetDiscount(discountId: number): Observable<Discount> {
    return this.httpClient.get<Discount>(`${this.apiUrl}BulkDiscount/GetDiscount/${discountId}`)
      .pipe(map(result => result));
  }

  AddDiscount(rrvm: any): Observable<Discount> {
    return this.httpClient.post<Discount>(
      `${this.apiUrl}BulkDiscount/AddDiscount`, rrvm, this.httpOptions
    );
  }

  DeleteDiscount(discountId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}BulkDiscount/DeleteDiscount/${discountId}`, this.httpOptions);
  }

  UpdateDiscount(discountId: number, discountModel: Discount): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}BulkDiscount/EditDiscount/${discountId}`, discountModel, this.httpOptions);
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

   
  GetUser(email: string): Observable<Users> {
    return this.httpClient.get<Users>(`${this.apiUrl}User/GetUserByEmail/${email}`)
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
    return this.httpClient.get<any>(`${this.apiUrl}CustomerOrder/GetAllCustomerOrders`)
      .pipe(map(result => result))
  }

  GetOrder(customerOrderId: number): Observable<OrderVM> {
    return this.httpClient.get<OrderVM>(`${this.apiUrl}CustomerOrder/GetOrder/${customerOrderId}`)
      .pipe(map(result => result));
  }

  GetOrdersByCustomer(customerId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}CustomerOrder/GetOrdersByCustomer/${customerId}`).pipe(map(result => result));
  }

  AddCustomerOrder(customerOrderViewModel: OrderVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}CustomerOrder/AddCustomerOrder`, customerOrderViewModel, this.httpOptions
    );
  }

  ProcessOrderLine(orderLineId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}CustomerOrder/ProcessOrderLine/${orderLineId}`, this.httpOptions);
  }

  UpdateOrderStatus(customerOrderId: number, customerOrderStatusId: number): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}CustomerOrder/UpdateCustomerOrderStatus/${customerOrderId}/${customerOrderStatusId}`, this.httpOptions);
  }

  updateDeliveryDate(orderId: number, newDeliveryDate: Date): Observable<any> {
    const url = `${this.apiUrl}CustomerOrder/UpdateDeliveryDate/${orderId}`;
    return this.httpClient.put(url, { newDeliveryDate });
  }

  GetOrderByCode(alphanumericcode: string): Observable<OrderVM> {
    return this.httpClient.get<OrderVM>(`${this.apiUrl}CustomerOrder/GetOrderByCode/${alphanumericcode}`)
      .pipe(map(result => result));
  }

  DeliverOrder(customerOrderId: number, deliveredOrder: OrderVM): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}CustomerOrder/DeliverOrder/${customerOrderId}`, deliveredOrder, this.httpOptions);
  }

  //-------------------------------------------------------Custom PRODUCT-------------------------------------------------------
  GetAllCustomProducts(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}CustomProduct/GetAllCustomProducts`)
      .pipe(map(result => result))
  }

  GetCustomProduct(customProductId: number): Observable<CustomProductVM> {
    return this.httpClient.get<CustomProductVM>(`${this.apiUrl}CustomProduct/GetCustomProduct/${customProductId}`)
      .pipe(map(result => result));
  }

  AddCustomProduct(customProductViewModel: CustomProductVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}CustomProduct/CreateCustomProduct`, customProductViewModel, this.httpOptions
    );
  }

  DeleteCustomProduct(customProductId: number): Observable<any> {
    return this.httpClient.delete<any>(`${this.apiUrl}CustomProduct/DeleteCustomProduct/${customProductId}`, this.httpOptions);
  }

  //-------------------------------------------------------QUOTE REQUESTS-------------------------------------------------------
  GetAllActiveQuoteRequests(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}QuoteRequest/GetAllActiveQuoteRequests`)
      .pipe(map(result => result))
  }

  GetQuoteRequest(quoteRequestId: number): Observable<QuoteVM> {
    return this.httpClient.get<QuoteVM>(`${this.apiUrl}QuoteRequest/GetQuoteRequest/${quoteRequestId}`)
      .pipe(map(result => result));
  }

  CheckForActiveQuoteRequest(customerId: string): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}QuoteRequest/CheckForActiveQuoteRequest/${customerId}`)
      .pipe(map(result => result));
  }

  AddQuoteRequest(quoteRequestViewModel: QuoteVM): Observable<any> {
    return this.httpClient.post<any>(
      `${this.apiUrl}QuoteRequest/AddQuoteRequest`, quoteRequestViewModel, this.httpOptions
    );
  }

  //---------------------------------------- Confirm Email ----------------------------------------
  confirmEmail(token: string, email: string): Observable<any> {
    const encodedToken = encodeURIComponent(token);
    const encodedEmail = encodeURIComponent(email);
    const url = `${this.apiUrl}Authentication/ConfirmEmail?token=${encodedToken}&email=${encodedEmail}`;
    console.log(url);
    return this.httpClient.get(url);
  }
  
  //---------------------------------------- Employees ----------------------------------------
  GetEmployees(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Employee/GetAllEmployees`)
      .pipe(map(result => result))
  }

  //---------------------------------------- Customers ----------------------------------------
  GetCustomers(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}User/GetAllCustomers`);
  }
  
  GetCustomerByUserId(userId: string): Observable<AllCustomerDetailsVM> {
    return this.httpClient.get<AllCustomerDetailsVM>(`${this.apiUrl}User/GetCustomerByUserId/${userId}`);
  }

  //---------------------------------------- REPORTS ----------------------------------------
  GetSalesByCategoryReport(stringStartDate: string, stringEndDate: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Reports/GetSalesByCategoryReport/${stringStartDate}/${stringEndDate}`);
  }
  
  GetInactiveCustomerList(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Reports/GetInactiveCustomerList`);
  }
  
  GetSupplierListReport(productId: number, isFixedProduct: string): Observable<Supplier[]> {
    return this.httpClient.get<Supplier[]>(`${this.apiUrl}Reports/GetSupplierListReport/${productId}/${isFixedProduct}`);
  }

  getWriteOffReport(): Observable<WriteOffItem[]> {
    return this.httpClient.get<WriteOffItem[]>(`${this.apiUrl}WriteOffReason/GetWriteOffReport`);
  }
  
  UpdateUserRoleAndNotifyAdmin(email: string, roleId: string): Observable<any> {
    const url = `${this.apiUrl}User/UpdateUserRoleAndNotifyAdmin`;
    const body = { email: email, roleId: roleId };
    return this.httpClient.put(url, body);
  }

  getAllMessages(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Authentication/GetAllMessages`);
  }

  clearAllMessages(): Observable<string> {
    return this.httpClient.delete<string>(`${this.apiUrl}Authentication/ClearAllMessages`);
  }

  //------------------------------------------------------- EMAIL -------------------------------------------------------
  SendEmail(email: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}Email/SendEmail`, email, this.httpOptions);
  }
}