import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

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
        Swal.fire({
          icon: 'success',
          title: 'Email Sent Successfully',
          text: 'An email was sent to you with a link to change you password.'
        });
      },
      (error: any) => {
        // Failed to send the email
        Swal.fire({
          icon: 'error',
          title: 'Oops...something went wrong',
          text: 'Something went wrong when trying to update your password and the email to change your password could not be sent. Please try agian later.'
        });
      }
    );  
  }
}
