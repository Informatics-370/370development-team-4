import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrls: ['./two-factor-auth.component.css']
})
export class TwoFactorAuthComponent implements OnInit {
  email!: string;
  otp: string = '';

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit(): void {
    // Retrieve the email from the route parameters
    this.route.paramMap.subscribe(params => {
      this.email = params.get('email') || ''; // Ensure email is assigned a value
    });
    console.log(this.email);
  }

  verifyOTP() {
    this.authService.loginWithOTP(this.otp, this.email).subscribe(
      (response: any) => {
        console.log('OTP verification successful:', response);
        // Handle successful OTP verification, e.g., navigate to the appropriate page
      },
      (error: any) => {
        console.error('OTP verification failed:', error);
        // Handle OTP verification failure, e.g., display an error message
      }
    );
  }
}
