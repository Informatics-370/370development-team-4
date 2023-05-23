import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Size } from '../shared/Size';
import { CategoryVM } from '../shared/category-vm';
import { Item } from '../shared/item';
import { ItemVM } from '../shared/item-vm';
import { RefundReason } from '../shared/refund-reason';

imports:[
  HttpClientModule
]
@Injectable({
  providedIn: 'root'
})
export class DataService {

  apiUrl = 'http://localhost:5116/api/'

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { 
  }

  GetSizes(): Observable<any>{
    return this.httpClient.get(`${this.apiUrl}Size/GetAllSizes`)
    .pipe(map(result => result))
  }

  getSize(sizeId: number): Observable<Size> {
    return this.httpClient.get<Size>(`${this.apiUrl}Size/GetSize/${sizeId}`)
      .pipe(map(result => result));
  }

  AddSize(size: Size): Observable<Size> {
    return this.httpClient.post<Size>(
      `${this.apiUrl}Size/AddSize`,
      size,
      this.httpOptions
    );
  }
  

DeleteSize(sizeId:number):Observable<Size[]>{
  console.log(sizeId);
  return this.httpClient.delete<Size[]>(`${this.apiUrl}Size/DeleteSize/${sizeId}`,this.httpOptions)
}
EditSize(sizeId: number, size: Size): Observable<Size[]> {
  return this.httpClient.put<Size[]>(
    `${this.apiUrl}Size/EditSize/${sizeId}`,
    size,
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

  UpdateRefundReason(customerrefundreasonId: number, refundreasonModel: any): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}RefundReason/EditCustomerRefundReason/${customerrefundreasonId}`, refundreasonModel, this.httpOptions);
  }

}