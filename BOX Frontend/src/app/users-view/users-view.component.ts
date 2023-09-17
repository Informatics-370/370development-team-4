import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { Users } from '../shared/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; 

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html',
  styleUrls: ['./users-view.component.css']
})
export class UsersViewComponent {
Users:Users[]=[];
filteredUsers:Users[]=[];
userCount:number=-1;
searchTerm: string = '';
submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
loading = true; //show loading message while data loads
updateUserForm:FormGroup;
@ViewChild('updateModal') updateModal: any;
@ViewChild('deleteModal') deleteModal: any;

constructor(private dataService: DataService, private formBuilder: FormBuilder) {
  this.updateUserForm = this.formBuilder.group({
  })
  console.log(this.updateUserForm)
}



ngOnInit(): void {
  this.getAllUsers();
  this.updateUserForm.addControl('uEmail', this.formBuilder.control(''));
  this.updateUserForm.get('uEmail')?.disabled;
  this.updateUserForm.addControl('uTitle', this.formBuilder.control(''));
  this.updateUserForm.addControl('uFirstName', this.formBuilder.control(''));
  this.updateUserForm.addControl('uLastName', this.formBuilder.control(''));
  this.updateUserForm.addControl('uPhoneNumber', this.formBuilder.control(''));
  this.updateUserForm.addControl('uAddress', this.formBuilder.control(''));
}
getAllUsers() { //get all Users
  this.dataService.GetUsers().subscribe((result: any[]) => {
    let allUsers: any[] = result;
    this.filteredUsers = []; //empty VAT array
    allUsers.forEach((user) => {
      this.filteredUsers.push(user);
    });
    this.Users = this.filteredUsers; //store all the vat someplace before I search below
    this.userCount = this.filteredUsers.length; //update the number of vat

    console.log('All Users array: ', this.filteredUsers);
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

  //--------------------UPDATE USER LOGIC----------------
  openUpdateModal(emailOrPhoneNumber: string) {
    
    this.dataService.GetUser(emailOrPhoneNumber).subscribe(
      (result) => {
        console.log('User to update: ', result);        
        this.updateUserForm.setValue({
          uEmail: result.email,
          uFirstName: result.firstName,
          uLastName: result.lastName,       
          uPhoneNumber: result.phoneNumber,
          uAddress:result.address
        }); 

        //Open the modal manually after data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateUser-' + result.email; //pass User ID into modal ID so I can use it to update later

        //Fade background when modal is open.
        const backdrop = document.getElementById("backdrop");
        if (backdrop) {backdrop.style.display = "block"};
        document.body.style.overflow = 'hidden'; //prevent scrolling web page body
      },
      (error) => {
        console.error(error);
      }
    );
  }

  
  closeUpdateModal() {
    //Close the modal manually
    this.updateModal.nativeElement.classList.remove('show');
    this.updateModal.nativeElement.style.display = 'none';
    //Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) {backdrop.style.display = "none"};
    document.body.style.overflow = 'auto'; //allow scrolling web page body again
  }

 //--------------------DELETE VAT LOGIC----------------
 openDeleteModal(userId : string) {
  //Open the modal manually
  this.deleteModal.nativeElement.classList.add('show');
  this.deleteModal.nativeElement.style.display = 'block';
  this.deleteModal.nativeElement.id = 'deleteVAT-' + userId; //store Id where I can access it again
  //Fade background when modal is open.
  const backdrop = document.getElementById("backdrop");
  if (backdrop) {backdrop.style.display = "block"};
  document.body.style.overflow = 'hidden'; //prevent scrolling web page body
}

closeDeleteModal() {
  //Close the modal manually
  this.deleteModal.nativeElement.classList.remove('show');
  this.deleteModal.nativeElement.style.display = 'none';
  //Show background as normal
  const backdrop = document.getElementById("backdrop");
  if (backdrop) {backdrop.style.display = "none"};
  document.body.style.overflow = 'auto'; //allow scrolling web page body again
}

deleteUser() {
  //get User ID which I stored in modal ID
  let id = this.deleteModal.nativeElement.id;
  let email = id.substring(id.indexOf('-') + 1);
  console.log(email);
  this.dataService.DeleteUser(email).subscribe(
    (result) => {
      console.log("Successfully deleted ", result);
      this.getAllUsers(); //refresh Users list
    },
    (error) => {
      console.error('Error deleting User with ID ', email, error);
    }
  );

  this.closeDeleteModal();
}

updateUser() {
  this.submitClicked = true;
  if (this.updateUserForm.valid) {
    //get VAT ID which I stored in modal ID
    let id = this.updateModal.nativeElement.id;
    let userId = id.substring(id.indexOf('-') + 1);
    console.log(userId);

    //get form data
    const formValues = this.updateUserForm.value;
    let updatedUser: Users = {
      id: userId,
      firstName: formValues.uFirstName,
      lastName: formValues.uLastName,
      email: formValues.uEmail,
      address: formValues.uAddress,
      phoneNumber: formValues.uPhoneNumber,
      title: ''   
    };

    console.log(updatedUser);

    //update item
    this.dataService.UpdateUser(userId, updatedUser).subscribe(
      (result: any) => {
        console.log('Updated User', result);
        this.getAllUsers(); //refresh User list
        this.submitClicked = false; //reset submission status
      }
    );

    this.closeUpdateModal();
  }
  
}
}
