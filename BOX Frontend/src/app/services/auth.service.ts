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

  sendForgotPasswordLink(forgotPasswordData: any): Observable<any> {
    return this.http.post(`${this.authUrl}ChangePassword`, forgotPasswordData);
  }
}
