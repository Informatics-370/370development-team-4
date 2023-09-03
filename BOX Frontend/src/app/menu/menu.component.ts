import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { RegistrationHubService } from '../services/registration-hub.service';

@Component({
  selector: '.app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  messages: string[] = [];

  @ViewChild('popoverContent', { static: true }) popoverContent!: ElementRef;

  newRegistrations: { messages: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private registrationHubService: RegistrationHubService,
  ) {}  

  ngOnInit() {    
    this.loadMessages();

    const token = localStorage.getItem('access_token');
    if (token) {
      const role = this.authService.getUserRole(token);
      console.log(role)
      // Check role and subscribe to registration updates
      if (role === 'Admin' || role === 'Employee') {
        this.registrationHubService.registerAlert$.subscribe(registration => {
          this.newRegistrations.push(registration);
          this.messages.push(registration.messages);
          console.log(this.newRegistrations);
        });
      }
    }
  }

  loadMessages(): void {
    this.registrationHubService.getAllMessages()
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    // Clear the local storage token
    localStorage.removeItem('access_token');
    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}
