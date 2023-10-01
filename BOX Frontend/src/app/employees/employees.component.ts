import { Component, OnInit } from '@angular/core';
import { Users } from '../shared/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data.services';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Role } from '../shared/role';
import { Title } from '../shared/title';

export interface EmployeeRoles {
  id: string;
  firstName :string;
  lastName :string;
  email:string;
  address :string;
  title: string;
  phoneNumber :string;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit{
  Users:Users[]=[];
  filteredUsers:Users[]=[];
  userCount:number=-1;
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads
  createEmployeeForm: FormGroup;
  roleOptions: Role[] = [];
  selectedTitle: string = '';
  titles: Title[] = [];

  constructor(private dataService: DataService, private authService: AuthService, private formBuilder: FormBuilder) {  
    this.createEmployeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailaddress: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      title: ['', Validators.required]
    });

    this.authService.getAllTitles().subscribe(
      (titles) => {
        this.titles = titles;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...something went wrong',
          text: 'An error occured when trying to collect all the titles. Please try again later.'
        });
      }
    );
  }
  
  ngOnInit(): void {
    this.getAllUsers();
    this.getRoles();
  }

  getAllUsers() { //get all Users
    this.dataService.GetEmployees().subscribe((result: any[]) => {
      let allUsers: any[] = result;
      this.filteredUsers = [];
      allUsers.forEach((user) => {
        this.filteredUsers.push(user);
      });
      this.Users = this.filteredUsers;
      this.userCount = this.filteredUsers.length;
  
      this.loading = false; //stop displaying loading message
    });
  }
  

  //--------------------SEARCH BAR LOGIC----------------
  searchUser(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredUsers = []; //clear array
    for (let i = 0; i < this.Users.length; i++) {
      let currentUser: string = String(this.Users[i].email||this.Users[i].firstName);
      if (currentUser.includes(this.searchTerm.toLowerCase()))
      {
        this.filteredUsers.push(this.Users[i]);
      }
    }
    this.userCount= this.filteredUsers.length; //update VAT count so message can be displayed if no reasons are found
    console.log(this.filteredUsers);
  }

  showDeleteConfirmation(email: string): void {
    Swal.fire({
      title: 'Confirm Delete',
      text: 'Are you sure you want to delete this employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#D6AD60',
      cancelButtonColor: '#E33131',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(email);
      }
    });
  }

  deleteUser(email: string): void {
    this.dataService.DeleteUser(email).subscribe(
      (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Employee Deleted Successfully',
          text: 'You have successfully deleted the employee.'
        });
        this.getAllUsers(); // Refresh Users list
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...something went wrong',
          text: 'An error occured when trying to delete the employee. Please try again later.'
        });
      }
    );
  }

  createEmployee() {
    Swal.fire({
      title: 'Employee Details',
      html:
        '<select id="swal-input6" class="swal2-select">' +
        '<option value="">Select Title</option>' +
        this.titles.map((title) => `<option value="${title.titleID}">${title.description}</option>`).join('') +
        '</select>' +
        '<input id="swal-input1" class="swal2-input" placeholder="First Name">' +
        '<input id="swal-input2" class="swal2-input" placeholder="Last Name">' +
        '<input id="swal-input3" class="swal2-input" placeholder="Email Address">' +
        '<input id="swal-input4" class="swal2-input" placeholder="Phone Number">' +
        '<input id="swal-input5" class="swal2-input" placeholder="Address">',
      confirmButtonText: 'Submit',
      confirmButtonColor: '#D6AD60',
      showCancelButton: true,
      cancelButtonColor: '#E33131',
      preConfirm: () => {
        const selectedTitleId = (document.getElementById('swal-input6') as HTMLSelectElement).value;
  
        return [
          (document.getElementById('swal-input1') as HTMLInputElement).value,
          (document.getElementById('swal-input2') as HTMLInputElement).value,
          (document.getElementById('swal-input3') as HTMLInputElement).value,
          (document.getElementById('swal-input4') as HTMLInputElement).value,
          (document.getElementById('swal-input5') as HTMLInputElement).value,
          selectedTitleId
        ];
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const [firstName, lastName, emailaddress, phoneNumber, address, selectedTitleId] = result.value;
  
        const employeeData = {
          firstName: firstName,
          lastName: lastName,
          emailaddress: emailaddress,
          phoneNumber: phoneNumber,
          address: address,
          title: selectedTitleId // Use the extracted titleID directly
        };
  
        console.log(employeeData);
        this.authService.registerEmployee(employeeData).subscribe(
          (response) => {
            // Handle success response, if needed
            Swal.fire({
              icon: 'success',
              title: 'Employee Created Successfully',
              text: 'You have successfully added a new employee. The new employee will receive an email with their username, password as well as a link to change their password ASAP.'
            });
            this.getAllUsers(); // Refresh the user list
          },
          (error) => {
            // Handle error response, if needed
            Swal.fire({
              icon: 'error',
              title: 'Oops...something went wrong',
              text: 'An error occured when trying to create the employee. Please ensure that you have entered all their details.'
            });
          }
        );
      }
    });
  }
  
  
  

  updateEmployee(email: string): void {
    // Fetch the user's data based on the email
    this.dataService.GetUser(email).subscribe(
      (userData) => {
        // Destructure the user's data
        const { firstName, lastName, email, phoneNumber, address, title } = userData;
  
        Swal.fire({
          title: 'Update Employee',
          html:
            `<input id="swal-input1" class="swal2-input" placeholder="First Name" value="${firstName}">` +
            `<input id="swal-input2" class="swal2-input" placeholder="Last Name" value="${lastName}">` +
            `<input id="swal-input3" class="swal2-input" placeholder="Email Address" value="${email}">` +
            `<input id="swal-input4" class="swal2-input" placeholder="Phone Number" value="${phoneNumber}">` +
            `<input id="swal-input5" class="swal2-input" placeholder="Address" value="${address}">` +
            `<input id="swal-input6" class="swal2-input" placeholder="Title" value="${title}">`,
          confirmButtonText: 'Update',
          confirmButtonColor: '#D6AD60',
          showCancelButton: true,
          cancelButtonColor: '#E33131',
          focusConfirm: false,
          preConfirm: () => {
            return [
              (document.getElementById('swal-input1') as HTMLInputElement).value,
              (document.getElementById('swal-input2') as HTMLInputElement).value,
              (document.getElementById('swal-input3') as HTMLInputElement).value,
              (document.getElementById('swal-input4') as HTMLInputElement).value,
              (document.getElementById('swal-input5') as HTMLInputElement).value,
              (document.getElementById('swal-input6') as HTMLInputElement).value
            ];
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const [updatedFirstName, updatedLastName, updatedEmailAddress, updatedPhoneNumber, updatedAddress, updatedTitle] = result.value;
      
            const updatedUser: Users = {
              id: '',
              firstName: updatedFirstName,
              lastName: updatedLastName,
              email: updatedEmailAddress,
              phoneNumber: updatedPhoneNumber,
              address: updatedAddress,
              title: updatedTitle,
            };
      
            this.dataService.UpdateUser(email, updatedUser).subscribe(
              () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Employee Updated Successfully',
                  text: 'You have successfully updated the employee details.'
                });
                this.getAllUsers(); // Refresh the user list
              },
              (error) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Oops...something went wrong',
                  text: 'An error occured when trying to update the employee. Please try again later.'
                });
              }
            );
          }
        });
      },
      (error) => {
        console.error('Error fetching user data', error);
      }
    );
  }  
  

  getRoles() {
    this.dataService.GetAllRoles().subscribe(
      (roles: Role[]) => {
        // Filter out the 'Customer' role
        this.roleOptions = roles.filter(role => role.name !== 'Customer');
      },
      (error) => {
        console.error('Error fetching roles', error);
      }
    );
  }

  updateUserRole(email: string) {
    Swal.fire({
      title: 'Update Role',
      html: `<select id="role-select" class="swal2-select">
              <option value="0">Select a Role</option>
              ${this.roleOptions.map(role => `<option value="${role.id}">${role.name}</option>`).join('')}
            </select>`,
      confirmButtonText: 'Update',
      confirmButtonColor: '#D6AD60',
      showCancelButton: true,
      cancelButtonColor: '#E33131',
      focusConfirm: false,
    }).then((result) => {
      if (result.isConfirmed) {
        const roleIdElement = document.getElementById('role-select')! as HTMLSelectElement; // Get the selected role ID
        const roleId = roleIdElement.value;
        console.log(roleId);
        if (roleId !== '0') { // Check if a valid role is selected
          // Fetch the user's data based on the email
          this.dataService.GetUser(email).subscribe(
            (userData) => {
              // Destructure the user's data
              const { firstName, lastName, email } = userData;
              console.log(email)
              // Update the user's role
              this.dataService.updateUserRole(email, roleId).subscribe(
                () => {
                  Swal.fire({
                    icon: 'success',
                    title: 'Role Updated',
                    text: `The role for has been updated.`,
                  });
                  this.getAllUsers(); // Refresh the user list
                },
                (error) => {
                  console.error('Error updating user role', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Role Update Failed',
                    text: 'Failed to update the role. Please try again.',
                  });
                }
              );
            },
            (error) => {
              console.error('Error fetching user data', error);
            }
          );
        }
      }
    });
  }
  
  
    
}