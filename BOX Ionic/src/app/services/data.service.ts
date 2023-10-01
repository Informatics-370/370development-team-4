import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SizeVM } from '../shared/size-vm';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  apiUrl = 'http://localhost:5116/api/'

  constructor(private httpClient: HttpClient) { }

  GetSizes(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}Size/GetAllSizes`)
      .pipe(map(result => result))
  }
  
  getSize(sizeId: number): Observable<SizeVM> {
    return this.httpClient.get<SizeVM>(`${this.apiUrl}Size/GetSize/${sizeId}`)
      .pipe(map(result => result));
  }
}
