import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.services';
import Swal from 'sweetalert2';
import { Users } from '../shared/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: Users = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    title: '',
    phoneNumber: ''
  };
  isBusiness = false;
  isEditMode = false;
  token = localStorage.getItem('access_token')!;
  titleMap: { [key: number]: string } = {};

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
     this.getUserDetails();

     this.authService.getAllTitles().subscribe((titles) => {
      titles.forEach((title) => {
        this.titleMap[title.titleID] = title.description;
      });
    });
  }

  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.getUserDetails(); // Fetch user details again when entering edit mode
    }
    this.isEditMode = !this.isEditMode;
  }
  
  

  updateProfile(): void {
    const token = localStorage.getItem('access_token')!;
    const userId = this.authService.getUserIdFromToken(token)!;
    console.log(this.user)
    this.user.id = userId
    this.dataService.UpdateUser(this.user.email, this.user).subscribe(
      () => {
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been updated successfully.'
        });
        this.isEditMode = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...something went wrong',
          text: 'Some went wrong when trying to update your profile. Please try again later.'
        });
      }
    );
  }

  deleteAccount(): void {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete your account?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform account deletion logic here
        // Call authService.deleteAccount to delete the account
        this.dataService.DeleteUser(this.user.email).subscribe(
          () => {
            Swal.fire({
              title: 'Sorry to see you leave!',
              icon: 'info',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            })
            this.router.navigate(['/customer-homepage']);
          },
          (error) => {
            Swal.fire({
              title: 'Oops...!',
              icon: 'error',
              text: 'There was an unexpected error when attempting to delete your account',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'OK',
            })
          }
        );
      }
    });
  }

  private getUserDetails(): void {
    const token = localStorage.getItem('access_token')!;
    const email = this.authService.getEmailFromToken(token)!;
    this.dataService.GetUser(email).subscribe(
      (user) => {
        this.user = user;
      },
      (error) => {
        console.error('Error fetching user details', error);
      }
    );
   }

   public updateUserProfile(): void {
    if (this.isEditMode) {
      this.updateProfile();
    }
  }
  
  
}
