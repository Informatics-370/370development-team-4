import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  passwordVisible = false;
  confirmPasswordVisible = false;
  redirectURL = '';

  constructor(private authService: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {    
    //Retrieve the redirect URL from url
    this.activatedRoute.paramMap.subscribe(params => {
      //URL will come as 'redirect-' + url e.g. 'redirect-cart'
      let url = params.get('redirectTo')?.split('-');
      console.log(url ? url[1] : 'no redirect');
      if (url) this.redirectURL = url[1];
    });
  }

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
        Swal.fire({
          icon: 'error',
          title: 'Something Went Wrong...',
          text: 'Please check whether you entered your email or your password correctly.'
        });
      }
    );        
}


  private handleSuccessfulLogin(response: any) {
    const token = localStorage.getItem('access_token')!;
    const userRole = this.authService.getUserRole(token);
    console.log(userRole)
    const userId = this.authService.getUserIdFromToken(token);
    console.log(userId)
    const email = this.authService.getEmailFromToken(token);
    console.log(email)

    if (this.redirectURL != '') {
        this.router.navigate(['/' + this.redirectURL]);
    }
    else if (userRole != 'Customer') {
      // Redirect to the dashboard for admin or employee
      this.router.navigate(['/dashboard']);
    } else if (userRole === 'Customer') {
      // Redirect to the customer homepage for customers
      this.router.navigate(['/customer-homepage']);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid User Role',
        text: 'Your user role could not be identified. Please contact Mega Pack IT Support to assist you with this issue.'
      });
    }
} 

}
