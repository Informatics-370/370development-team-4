import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;

  private inventoryUpdateSubject = new Subject<{ description: string, newLevel: number }>();
  inventoryUpdate$ = this.inventoryUpdateSubject.asObservable();

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5116/inventoryHub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();

    this.hubConnection.start()
      .then(() => console.log('Connection started'))
      .catch(err => console.error('Error while starting connection: ', err));

    this.hubConnection.on("ReceiveInventoryUpdate", (description: string, newLevel: number) => {
      this.inventoryUpdateSubject.next({ description, newLevel });
    });
  }
}