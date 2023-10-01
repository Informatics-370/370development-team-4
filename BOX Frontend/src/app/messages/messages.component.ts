import { Component } from '@angular/core';
import { RegistrationHubService } from '../services/registration-hub.service';
import { DataService } from '../services/data.services';
import Swal from 'sweetalert2';

export interface Message {
  messageId: number,
  message: string,
  messageDate: Date
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

  refreshMessages(): void {
    this.loadMessages(); 
  }

  clearMessages(): void {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action will delete all messages. Are you sure you want to proceed?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete all messages',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked on "Yes, delete all messages", so proceed with clearing messages
        this.messageDataService.clearAllMessages().subscribe(
          (response) => {
            console.log(response);
            this.refreshMessages(); // Refresh messages after clearing
          },
          (error) => {
            console.error('Error clearing messages:', error);
          }
        );
      }
    });
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
