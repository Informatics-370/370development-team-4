import { Component } from '@angular/core';
import { RegistrationHubService } from '../services/registration-hub.service';
import { DataService } from '../services/data.services';

export interface Message {
  messageId: number,
  message: string
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  messages: any[] = [];

  constructor(private messageDataService: DataService) { }

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageDataService.getAllMessages().subscribe(
      (messages: any[]) => {
        this.messages = messages;
      },
      (error) => {
        console.error('Error loading messages:', error);
      }
    );
  }

  clearAllMessages(): void {
    this.messageDataService.clearAllMessages().subscribe(
      (response) => {
        console.log(response);
        this.loadMessages(); // Refresh messages after clearing
      },
      (error) => {
        console.error('Error clearing messages:', error);
      }
    );
  }
}
