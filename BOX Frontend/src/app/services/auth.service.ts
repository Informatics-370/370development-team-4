import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataService } from './data.services';
import { AssignEmpDTO } from '../shared/assign-emp-dto';
import { Users } from '../shared/user';
import { take, lastValueFrom } from 'rxjs';
import { AllCustomerDetailsVM } from '../shared/all-customer-details-vm';
import { Title } from '../shared/title';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = 'http://localhost:5116/api/Authentication/'

  constructor(private http: HttpClient, private dataService: DataService) { }

  getAllTitles(): Observable<Title[]> {
    const url = `${this.authUrl}GetAllTitles`;
    return this.http.get<Title[]>(url);
  }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.authUrl}Register`, user);
  }

  registerEmployee(email: string, user: any): Observable<any> {
    return this.http.post(`${this.authUrl}RegisterEmployee`, user);
  }  

  getTwoFactorStatus(email: string): Observable<any> {
    const url = `${this.authUrl}GetTwoFactorStatus?email=${encodeURIComponent(email)}`;
    return this.http.get(url);
  }
  
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.authUrl}Login`, loginData);
  }

  loginWithOTP(otp: string, username: string): Observable<any> {
    const body = {
      otp: otp,
      username: username
    };
    console.log(body)
    console.log(`${this.authUrl}Login2FA`, body)
    return this.http.post(`${this.authUrl}Login2FA`, body);
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

  assignEmployeeToCustomer(userId: string, assignEmpDTO: AssignEmpDTO): Observable<any> {
    const url = `${this.authUrl}AssignEmployee/${userId}`;
    return this.http.put(url, assignEmpDTO);
  }

  async getUserByEmail(email: string): Promise<Users> {
    let user: Users = {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      title: '',
      phoneNumber: ''
    };

    try {
      let result: Users = await lastValueFrom(this.dataService.GetUser(email).pipe(take(1)));
      user = result;
    } catch (error) {
      console.error('Could not retrieve user info for: ' + email);
    }
    
    return user
  }

  async getCustomer(): Promise<AllCustomerDetailsVM> {
    let customer: AllCustomerDetailsVM = {
      userId: '',
      customerId: '',
      title: '',
      fullName: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      address: '',
      employeeId: '',
      isBusiness: false,
      vatNo: '',
      creditBalance: 0,
      creditLimit: 0
    };

    const token = localStorage.getItem('access_token')!;
    let userId = this.getUserIdFromToken(token);

    try {
      if (userId) {
        let result: AllCustomerDetailsVM = await lastValueFrom(this.dataService.GetCustomerByUserId(userId).pipe(take(1)));
        customer = result;
      }
      else {
        throw 'Could not get user ID from token';
      }
    } catch (error) {
      console.error(error);
    }
    
    return customer
  }
}
