import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderVM } from '../shared/order-vm.js';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5116/api/';


  constructor(private httpClient: HttpClient) {}

  getAllCustomerOrders(): Observable<OrderVM[]> {
    return this.httpClient.get<OrderVM[]>(`${this.apiUrl}CustomerOrder/GetAllCustomerOrders`)
      .pipe(
        map(result => result)
      );
  }

  updateOrderStatus(orderId: number, newStatusId: number): Observable<any> {
    console.log('Updating order :', orderId, 'to status:', newStatusId);
    const url = `${this.apiUrl}CustomerOrder/UpdateCustomerOrderStatus/${orderId}/${newStatusId}`;
    return this.httpClient.put(url, {});
  }

  updateDeliveryDate(orderId: number, newDeliveryDate: Date): Observable<any> {
    console.log('Updating delivery date for order:', orderId, 'to:', newDeliveryDate);
    // Format the date as a string in ISO format
    const formattedDate = newDeliveryDate.toISOString();
    const url = `${this.apiUrl}CustomerOrder/UpdateDeliveryDate/${orderId}/${formattedDate}`;
    
    // Send the request
    return this.httpClient.put(url, {});
  }
  
  
  
}