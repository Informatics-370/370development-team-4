import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { RegistrationHubService } from '../services/registration-hub.service';
import { Users } from '../shared/user';
import { DataService } from '../services/data.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  user!: Users;
  
  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private registrationHubService: RegistrationHubService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('access_token')!;
    const email = this.authService.getEmailFromToken(token);

    if (email) {

      this.dataService.GetUser(email).subscribe(
        (user: Users) => {
          this.user = user;
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
    }
  }

}
