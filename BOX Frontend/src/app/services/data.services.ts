import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { Size } from '../shared/Size';
import { Category } from '../shared/category';

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

}


