import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, 
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    HttpClientModule, 
    FormsModule, 
    ReactiveFormsModule, 
    FontAwesomeModule],
})
export class AppComponent {
  email!: string;
  showMenu: boolean = false;

  public appPages = [
    { title: 'View Reports', url: '/reporting', icon: 'download', },
    { title: 'View Stock Take', url: '/write-off', icon: 'book' },
    { title: 'Supplier', url: '/supplier', icon: 'person' },
    { title: 'Supplier Order', url: '/folder/supplier-order', icon: 'navigate' },
    { title: 'Cost Price Formula', url: '/folder/cost-price-formula-variables', icon: 'code' },
    { title: 'Product Category', url: '/product-category', icon: 'bookmark' },
    { title: 'Size Units', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
    { title: 'Fixed Products', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
    { title: 'Custom Products', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
    { title: 'Product Items', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
    { title: 'Raw Materials', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
    { title: 'Write Off Reasons', url: '/folder/cost-price-formula-variables', icon: 'bookmark' },
  ];
  public labels = ['Product Category',
                    'Size Units',
                    'Fixed Product',  
                    'Custom Products',
                    'Product Items',
                    'Raw Materials',
                    'Write-Off Reasons',
                  ];                  
  constructor(private router: Router) {
    
  }

  ngOnInit() {
    // Check for token when the app starts
    this.checkToken();

    // Subscribe to router events to re-check token after navigation
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkToken();
      }
    });
  } 
 
  // Method to check if token exists and toggle menu accordingly
  checkToken() {
    const token = localStorage.getItem('access_token')!;
    const userEmail = this.getEmailFromToken(token)!;
    this.showMenu = !!token;
    this.email = userEmail;
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

  isLoggedIn(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('/login');
  }
}
