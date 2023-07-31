import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5116/api/Authentication/'

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.authUrl}Register`, user);
  }

  
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.authUrl}Login`, loginData);
  }

  ChangePassword(forgotPasswordData: any): Observable<any> {
    return this.http.post(`${this.authUrl}ChangePassword`, forgotPasswordData);
  }

  sendForgotPasswordLink(emailData: any): Observable<any> {
    return this.http.post(`${this.authUrl}ForgotPassword`, emailData);
    
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  getUserRole(): string | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      const jwtData = token.split('.')[1];
      const decodedJwtJsonData = window.atob(jwtData);
      const decodedJwtData = JSON.parse(decodedJwtJsonData);
      return decodedJwtData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
    return null;
  }
}
