import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordsMatch = true;

  constructor ( private authService: AuthService ) {}

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  validatePasswords() {
    const passwordInput = document.getElementById('password') as HTMLInputElement; // gets the password input
    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement; // gets the confirm password input

    if (passwordInput.value !== confirmPasswordInput.value) {
      // check if passwords do not match
      this.passwordsMatch = false; // passwords do not match
    } else {
      this.passwordsMatch = true; // passwords match
    }
  }



  sendForgotPasswordLink() {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

    if (!this.passwordsMatch) {
      // Do not proceed if passwords don't match
      return;
    }

    const forgotPasswordData = {
      Password: password.value,
      ConfirmPassword: confirmPassword.value,
      Email: emailInput.value,
      Token: ''
    };

    // Call the AuthService to trigger the forgot password email
    this.authService.sendForgotPasswordLink(forgotPasswordData).subscribe(
      (response: any) => {
        // Email sent successfully
        console.log('Password changes successfully', response);
      },
      (error: any) => {
        // Failed to send the email
        console.error('Password changes unsuccessfully', error);
      }
    );  
  }
}
