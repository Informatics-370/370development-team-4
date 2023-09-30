import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
    try {
      if (orderDetails.paymentTypeID == 3) { //credit  
        //update credit balance
        let updatedBalance = orderDetails.creditBalance - orderDetails.amount;
        return this.httpClient
          .put<any>(`${this.apiUrl}User/UpdateCustomerCreditBalance/${orderDetails.customerID}/${updatedBalance}`, this.httpOptions);
      }
      else if (orderDetails.paymentTypeID == 1 || orderDetails.paymentTypeID == 2) { //pay immediately or cash on collection / delivery
        let payment = {
          merchant_id: 0,
          merchant_key: '',
          return_url: this.encodeURL(orderDetails.paymentTypeID, orderDetails.amount, 'success'),
          cancel_url: this.encodeURL(orderDetails.paymentTypeID, orderDetails.amount, 'fail'),
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
    } catch (error) {
      // If an error occurs, return null as an observable
      return of(null);
    }
  }

  checkPaymentResult(gibberish: string): Observable<any> {
    return new Observable((observer) => {
      let relevantData = this.decodeURL(gibberish);
      let paymentTypeID = relevantData[0];
      let amount = relevantData[1];
      let result = relevantData[2];

      let payment = {
        merchant_id: 0,
        merchant_key: '',
        return_url: 'success',
        cancel_url: 'fail',
        amount: amount,
        item_name: '',
        signature: '',
        email_address: '',
        cell_number: ''
      };

      if (result == 'success') {
        this.httpClient
          .post<any>(`${this.apiUrl}CustomerOrder/HandlePaymentResult`, payment, this.httpOptions)
          .subscribe( (result) => {
            //add payment type to result
            let paymentResult = {
              amount: result.amount,
              customerOrderID: result.customerOrderID,
              customerOrder: result.customerOrder,
              date_And_Time: result.date_And_Time,
              paymentID: result.paymentID,
              paymentTypeID: paymentTypeID
            }

            console.log(paymentResult);
            observer.next(paymentResult); // Emit the result to the observer
            observer.complete(); // Complete the observable
          });
      } else {
        observer.next(false); // Emit false to the observer if result is not 'success'
        observer.complete(); // Complete the observable
      }
    });
  }

  //I want to send quote ID in url to order page but don't want to send the ID as is
  encodeURL(paymentType: number, amount: number, message: string): string {
    let now = new Date(Date.now());
    var gibberish = btoa(`success-${paymentType}-fail-${amount}-fail-${now.toLocaleDateString()}-${message}`);

    return location.href.substring(0, location.href.length - 1) + '4/' + gibberish;
  }

  decodeURL(gibberish: string): any[] {
    var sensible = atob(gibberish);
    let sensibleArr = sensible.split('-');
    let importantNumbers = [parseInt(sensibleArr[1]), parseFloat(sensibleArr[3]), sensibleArr[6]]
    return importantNumbers;
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
  creditBalance: number;
}