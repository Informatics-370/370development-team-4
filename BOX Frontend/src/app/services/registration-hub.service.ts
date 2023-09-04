import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RegistrationHubService {

  private apiUrl = 'http://localhost:5116/api/Authentication';

  private hubConnection: signalR.HubConnection;

  private registerAlert = new Subject<{ messages: string }>();
  registerAlert$ = this.registerAlert.asObservable();

  getAllMessages(): Observable<any[]> {
    const url = `${this.apiUrl}/GetAllMessages`;
    return this.http.get<string[]>(url); 
  }

  clearAllMessages(): Observable<any> {
    const url = `${this.apiUrl}/ClearAllMessages`;
    return this.http.delete(url);
  }

  constructor(private http: HttpClient) {
    console.log('RegistrationHubService constructor called');

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5116/registrationHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.error('Error while starting connection: ', err));

    this.hubConnection.on("SendRegistrationAlert", (messages: string) => {
      console.log('Received registration alert:', messages);
      this.registerAlert.next({messages});
    });
  }
}
