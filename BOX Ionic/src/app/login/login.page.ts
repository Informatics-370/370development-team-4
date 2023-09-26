import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  private authUrl = 'http://localhost:5116/api/Authentication/'
  passwordVisible = false;
  confirmPasswordVisible = false;
  redirectURL = '';
  showSidebar = true;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.showSidebar = false;
  }

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.authUrl}Login`, loginData);
  }

  getTwoFactorStatus(email: string): Observable<any> {
    const url = `${this.authUrl}GetTwoFactorStatus?email=${encodeURIComponent(email)}`;
    return this.http.get(url);
  }

  getUserRole(token: string): string | null {
    if (token) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }

  getEmailFromToken(token: string): string | null {
    try {
        const jwtData = token.split('.')[1];
        const decodedJwtJsonData = window.atob(jwtData);
        const decodedJwtData = JSON.parse(decodedJwtJsonData);
        return decodedJwtData['sub'];
    } catch (error) {
        console.error('Error decoding JWT token:', error);
        return null;
    }
  }

  getUserIdFromToken(token: string): string | null {
    try {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      // return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/Id'];
      return decodedJwtData['UserId'];
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
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
    this.login(loginData).subscribe(
      (response: any) => {
        this.getTwoFactorStatus(loginData.emailaddress).subscribe(
          (twoFactorResponse: any) => {
            console.log('Two-Factor Response:', twoFactorResponse); // Log the entire response
            if (twoFactorResponse.twoFactorEnabled === true) {
              this.router.navigate(['/two-factor-auth']);
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
        // Handle the error, such as displaying an error message to the user
      }
    );        
  }


  private handleSuccessfulLogin(response: any) {
    const token = localStorage.getItem('access_token')!;
    const userRole = this.getUserRole(token);
    console.log(userRole)
    const userId = this.getUserIdFromToken(token);
    console.log(userId)
    const email = this.getEmailFromToken(token);
    console.log(email)

    if (userRole === 'Admin' || userRole === 'Employee') {
      // Redirect to the dashboard for admin or employee
      this.router.navigateByUrl('/reporting');
    }
    else {
      this.router.navigateByUrl('/unauthorised')
      localStorage.removeItem('access_token');
    }
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }
}
