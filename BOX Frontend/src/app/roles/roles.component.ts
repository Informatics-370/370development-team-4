import { Component, ViewChild } from '@angular/core';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any;
import { Role } from '../shared/role';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent {
  roles: Role[] = []; // Used to store all Roles
  filteredRoles: Role[] = []; // Used to hold all the Roles that will be displayed to the user
  specificRole!: Role; // Used to get a specific Role
  roleCount: number = -1; // Keep track of how many Roles there are in the DB
  // Forms
  addRoleForm: FormGroup;
  updateRoleForm: FormGroup;
  // Modals
  @ViewChild('deleteModal') deleteModal: any;
  @ViewChild('updateModal') updateModal: any;
  // Search functionality
  searchTerm: string = '';
  submitClicked = false; // Keep track of when submit button is clicked in forms, for validation errors
  loading = true; // Show loading message while data loads

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addRoleForm = this.formBuilder.group({
      description: ['', Validators.required] // Update the form control name to "description"
    });

    this.updateRoleForm = this.formBuilder.group({
      uDescription: ['', Validators.required] // Update the form control name to "uDescription"
    });
  }

  ngOnInit(): void {
    this.getAllRoles();
  }

  getAllRoles() { // Get all Roles
    this.dataService.GetAllRoles().subscribe((result: any[]) => {
      this.roles = result; // Assign the received roles directly
      this.filteredRoles = this.roles; // Store all the roles in filteredRoles
      this.roleCount = this.filteredRoles.length; // Update the number of roles

      console.log('All roles array: ', this.filteredRoles);
      this.loading = false; // Stop displaying loading message
    });
  }

  //--------------------SEARCH BAR LOGIC----------------
  searchRole(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredRoles = this.roles.filter(role => role.description.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.roleCount = this.filteredRoles.length; // Update role count so message can be displayed if no roles are found
    console.log(this.filteredRoles);
  }

  //--------------------ADD ROLE LOGIC----------------
  addRole() {
    this.submitClicked = true; // Display validation error message if user tried to submit form with no fields filled in correctly
    if (this.addRoleForm.valid) {
      const formData = this.addRoleForm.value;
      let newRole: Role = {
        roleID: 0,
        description: formData.description // Update the property name to "description"
      };

      this.dataService.AddRole(newRole).subscribe(
        (result: any) => {
          console.log('New Role!', result);

          this.getAllRoles(); // Refresh Role list
          this.addRoleForm.reset();
          this.submitClicked = false; // Reset submission status
          $('#addRole').modal('hide');
        }
      );
    } else {
      console.log('Invalid data');
    }
  }

  //--------------------UPDATE ROLE LOGIC----------------
  openUpdateModal(roleId: number) {
    console.log("Received roleId:", roleId);
    // Get Role and display data
    this.dataService.GetRole(roleId).subscribe(
      (result) => {
        console.log('Role to update: ', result);
        this.updateRoleForm.setValue({
          uDescription: result.description // Update the property name to "uDescription"
        }); // Display data

        // Open the modal manually after data is retrieved and displayed
        this.updateModal.nativeElement.classList.add('show');
        this.updateModal.nativeElement.style.display = 'block';
        this.updateModal.nativeElement.id = 'updateRole-' + roleId; // Pass Role ID into modal ID so it can be used to update later
        // Fade background when modal is open
        const backdrop = document.getElementById("backdrop");
        if (backdrop) { backdrop.style.display = "block" };
        document.body.style.overflow = 'hidden'; // Prevent scrolling web page body
      },
      (error) => {
        console.error(error);
      }
    );
  }

  closeUpdateModal() {
    // Close the modal manually
    this.updateModal.nativeElement.classList.remove('show');
    this.updateModal.nativeElement.style.display = 'none';
    // Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto'; // Allow scrolling web page body again
  }

  updateRole() {
    this.submitClicked = true;
    if (this.updateRoleForm.valid) {
      // Get Role ID which is stored in modal ID
      let id = this.updateModal.nativeElement.id;
      let roleId = id.substring(id.indexOf('-') + 1);
      console.log(roleId);

      // Get form data
      const formValues = this.updateRoleForm.value;
      let updatedRole: Role = {
        roleID: 0,
        description: formValues.uDescription // Update the property name to "description"
      };

      console.log(updatedRole);

      // Update item
      this.dataService.UpdateRole(roleId, updatedRole).subscribe(
        (result: any) => {
          console.log('Updated Role', result);
          this.getAllRoles(); // Refresh Role list
          this.submitClicked = false; // Reset submission status
        }
      );

      this.closeUpdateModal();
    }

  }

  //--------------------DELETE ROLE LOGIC----------------
  openDeleteModal(roleId: number) {
    console.log("Received roleId:", roleId);
    // Open the modal manually
    this.deleteModal.nativeElement.classList.add('show');
    this.deleteModal.nativeElement.style.display = 'block';
    this.deleteModal.nativeElement.id = 'deleteRole-' + roleId; // Store ID where it can be accessed again
    // Fade background when modal is open
    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "block" };
    document.body.style.overflow = 'hidden'; // Prevent scrolling web page body
  }

  closeDeleteModal() {
    // Close the modal manually
    this.deleteModal.nativeElement.classList.remove('show');
    this.deleteModal.nativeElement.style.display = 'none';
    // Show background as normal
    const backdrop = document.getElementById("backdrop");
    if (backdrop) { backdrop.style.display = "none" };
    document.body.style.overflow = 'auto'; // Allow scrolling web page body again
  }

  deleteRole() {
    // Get Role ID which is stored in modal ID
    let id = this.deleteModal.nativeElement.id;
    let roleId = id.substring(id.indexOf('-') + 1);
    console.log(roleId)
    this.dataService.DeleteRole(roleId).subscribe(
      (result) => {
        console.log("Successfully deleted", result);
        this.getAllRoles(); // Refresh Role list
      },
      (error) => {
        console.error('Error deleting Role with ID', roleId, error);
      }
    );

    this.closeDeleteModal();
  }

  //---------------------------VALIDATION ERRORS LOGIC-----------------------
  // Methods to show validation error messages on reactive forms. Note that the form will not submit if fields are invalid whether or not 
  // the following methods are present. This is just to improve user experience
  get description() { return this.addRoleForm.get('description'); }
  get uDescription() { return this.updateRoleForm.get('uDescription'); }
}

