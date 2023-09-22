import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderVM } from '../shared/order-vm.js';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:5116/api/';
  httpOptions = {
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  };
  /*Payment types list as in database
  1	Pay immediately
  2	Cash on delivery / collection
  3	Credit */

  /* Delivery types as in database
  1	Delivery
  2	Pick up */

  constructor(private httpClient: HttpClient) { }

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

  initiatePlaceOrder(orderDetails: OrderDetails): Observable<any> {
    if (orderDetails.paymentTypeID == 3) { //credit
      this.deductCreditBalance(orderDetails.amount);
  
      //update credit balance
      return this.httpClient
        .put<any>(`${this.apiUrl}User/UpdateUser/${orderDetails.customerEmail}`, orderDetails, this.httpOptions);
    } 
    else if (orderDetails.paymentTypeID == 1 || orderDetails.paymentTypeID == 2) { //pay immediately or cash on collection / delivery
      let payment = {
        merchant_id: 0,
        merchant_key: '',
        amount: orderDetails.amount,
        item_name: 'Quote #' + orderDetails.quoteID,
        signature: '',
        email_address: orderDetails.customerEmail,
        cell_number: orderDetails.customerPhoneNo
      }
  
      return this.httpClient
        .post<any>(`${this.apiUrl}Payment/CreatePaymentRequest`, payment, this.httpOptions);
    } else {
      // If neither of the conditions is met, return null as an observable
      return of(null);
    }
  }

  deductCreditBalance(amount: number) {

  }

  completePayment(paymentTypeId: number, payment: any): boolean {
    let outcome = false;

    try {
      this.httpClient
        .post<any>(`${this.apiUrl}Payment/HandlePaymentResult/${paymentTypeId}`, payment, this.httpOptions)
        .subscribe((result) => {
          console.log(result);
          outcome = true;
        });
    } catch (error) {
      console.error(error);
      outcome = false;
    }
    
    return outcome;
  }

}

interface OrderDetails {
  customerID: string;
  customerEmail: string;
  customerPhoneNo: string;
  quoteID: number;
  amount: number;
  paymentTypeID: number;
  deliveryTypeID: number;
}