import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  // ========================================= Password Validation =============================================
  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // ========================================= Login =============================================

  submitForm() {
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;

    const loginData = {
      emailaddress: emailInput.value,
      password: passwordInput.value
    };

    // Call the AuthService to perform login
    this.authService.login(loginData).subscribe(
      (response: any) => {
        this.authService.getTwoFactorStatus(loginData.emailaddress).subscribe(
          (twoFactorResponse: any) => {
            console.log('Two-Factor Response:', twoFactorResponse); // Log the entire response
            if (twoFactorResponse.twoFactorEnabled === true) {
              this.router.navigate(['/two-factor-auth', { email: loginData.emailaddress }]);
            } else {
              console.log('Login successful:', response);
              localStorage.setItem("access_token", response.token);
              this.handleSuccessfulLogin(response);
            }
          },
          (twoFactorError: any) => {
            console.error('Error getting TwoFactorEnabled status:', twoFactorError);
          }
        )
      },
      (error: any) => {
        // Login failed
        console.error('Login failed:', error);
      }
    );        
  }

  private handleSuccessfulLogin(response: any) {
    const token = response.token;
    const userRole = this.getUserRoleFromToken(token);
    const userId = response.userId;

    if (userId !== null) {
      // Save the user ID to localStorage
      localStorage.setItem('user_id', userId);
    } else {
      console.error('User ID not available in the JWT token');
    }
  

    if (userRole == 'Admin' || 'Employee') {
      // Redirect to the dashboard for admin
      this.router.navigate(['/dashboard']);
    } else if (userRole === 'Customer') {
      // Redirect to the customer homepage for customers
      this.router.navigate(['/customer-homepage']);
    } else {
      // If the user role is unknown or not specified, you can handle it accordingly.
    }
  }

  private getUserRoleFromToken(token: string): string | null {
    try {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/userid']; // Replace 'userid' with the actual claim name for user ID
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }
  

}
