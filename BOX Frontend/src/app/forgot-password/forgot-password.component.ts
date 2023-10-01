import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  passwordVisible = false;
  confirmPasswordVisible = false;
  passwordsMatch = true;
  private token: string = '';
  private email: string = '';

  constructor (private route: ActivatedRoute, private authService: AuthService ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

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



  ChangePassword() {
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
      Email: this.email,
      Token: this.token
    };

    // Call the AuthService to trigger the forgot password email
    this.authService.ChangePassword(forgotPasswordData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Password Changed Successfully',
          text: 'Your password has been sucessfuly changed.'
        });
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...something went wrong',
          text: 'An error occured when trying to reset your password. Please ensure that you enter at least 1 lowercase letter, 1 uppercase letter and 1 digit into your password which should have a length of 8 characters.'
        });
      }
    );  
  }
}
