import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.services';

@Component({
  selector: 'app-confirm-email',
  templateUrl: './confirm-email.component.html',
  styleUrls: ['./confirm-email.component.css']
})
export class ConfirmEmailComponent implements OnInit {

  emailVerified: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const emailBase64 = params['email'];

      if (token && emailBase64) {
        const email = atob(emailBase64);
        this.confirmEmail(token, email);
      }
    });
  }

  confirmEmail(token: string, email: string): void {
    console.log(token)
    console.log(email)
    this.dataService.confirmEmail(token, email).subscribe(
      response => {
        console.log('Email verified successfully', response);
        this.emailVerified = true;
        // You can show a success message or navigate to a success page
      },
      error => {
        console.error('Error confirming email', error);
        // Handle the error, e.g., show an error message
      }
    );
  }
}
