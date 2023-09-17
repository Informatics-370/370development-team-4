import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: '.app-customer-navbar',
  templateUrl: './customer-navbar.component.html',
  styleUrls: ['./customer-navbar.component.css']
})
export class CustomerNavbarComponent {
  constructor(private authService: AuthService, private router: Router) { }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    // Perform logout logic here, e.g., clearing the token and redirecting to the login page
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  testSwal() {
    Swal.fire({
      title: 'Oops...!',
      icon: 'error',
      text: 'There was an unexpected error when attempting to delete your account',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }
}