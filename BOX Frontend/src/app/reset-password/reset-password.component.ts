import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  constructor (private authService : AuthService) {}

  sendForgotPasswordLink() {
    const emailInput = document.getElementById('email') as HTMLInputElement;

    const forgotPasswordData = {
      Email: emailInput.value
    };

    // Call the AuthService to trigger the forgot password email
    this.authService.sendForgotPasswordLink(forgotPasswordData).subscribe(
      (response: any) => {
        // Email sent successfully
        console.log('Email sent successfully', response);
      },
      (error: any) => {
        // Failed to send the email
        console.error('Email failed to send', error);
      }
    );  
  }
}
