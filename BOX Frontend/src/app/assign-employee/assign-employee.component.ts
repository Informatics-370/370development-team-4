import { Component, Input } from '@angular/core';
import { DataService } from '../services/data.services';
import { Customer, Employee } from '../shared/customer';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { AssignEmpDTO } from '../shared/assign-emp-dto';

@Component({
  selector: 'app-assign-employee',
  templateUrl: './assign-employee.component.html',
  styleUrls: ['./assign-employee.component.css']
})
export class AssignEmployeeComponent {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  customerCount: number = -1;
  searchTerm: string = '';
  loading = true;
  @Input()
  customer!: Customer;

  newCreditLimit!: number;
  newCreditBalance!: number;

  constructor(private dataService: DataService, private authService: AuthService) { }
  
  ngOnInit(): void {
    this.getAllCustomers();
  }  

  
  getAllCustomers() {
    this.dataService.GetCustomers().subscribe((result: Customer[]) => {
      this.filteredCustomers = result;
      this.customers = this.filteredCustomers;
      this.customerCount = this.filteredCustomers.length;
      this.loading = false;
    });
  }

  searchUser(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.user.email.toLowerCase().includes(this.searchTerm) ||
      customer.user.firstName.toLowerCase().includes(this.searchTerm)
    );
    this.customerCount = this.filteredCustomers.length;
  }

  openAssignEmployeeModal(customer: Customer) {
    this.dataService.GetEmployees().subscribe((result: Employee[]) => {
      console.log('Employees data:', result);
      const employeeOptions = result.map(emp => ({
        value: emp.employeeId,
        text: `${emp.title} ${emp.firstName} ${emp.lastName}`
      }));

      Swal.fire({
        title: 'Assign New Employee',
        html: `<select id="employee-dropdown" class="form-control">${employeeOptions
          .map(option =>
            `<option value="${option.value}">${option.text}</option>`
          )
          .join('')}</select>`,
        showCancelButton: true,
        confirmButtonText: 'Assign',
        focusConfirm: false,
        preConfirm: () => {
          const selectedEmployeeId = (
            document.getElementById('employee-dropdown') as HTMLSelectElement
          ).value;
          if (selectedEmployeeId) {
            const assignEmpDTO: AssignEmpDTO = {
              employeeId: selectedEmployeeId 
            };
            console.log(assignEmpDTO)
            this.authService.assignEmployeeToCustomer(customer.userId, assignEmpDTO).subscribe(
              () => {
                const updatedCustomerIndex = this.customers.findIndex(cust => cust.userId === customer.userId);
                if (updatedCustomerIndex !== -1) {
                  this.customers[updatedCustomerIndex].employeeId = selectedEmployeeId;
                }
                this.getAllCustomers();
                Swal.fire('Success', 'Employee assigned successfully!', 'success');
              },
              error => {
                Swal.fire('Error', 'An error occurred while assigning employee.', 'error');
              }
            );
          } else {
            Swal.showValidationMessage('Please select an employee');
          }
        }
      });
    });
  }

  openUpdateCreditDialog(customer: Customer) {
    if (!customer) {
      // Handle the case where customer is undefined
      console.error('Customer is undefined');
      return;
    }
    Swal.fire({
      title: 'Update Credit Information',
      html: `
        <input type="number" [(ngModel)]="newCreditLimit" placeholder="New Credit Limit" class="form-control mb-3">
        <input type="number" [(ngModel)]="newCreditBalance" placeholder="New Credit Balance" class="form-control">
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        // Update the credit limit and balance in the backend
        this.dataService
          .updateCustomerCredit(
            customer.user.email,
            this.newCreditLimit,
            this.newCreditBalance
          )
          .subscribe(
            () => {
              console.log(customer.user.email)
              console.log(this.newCreditLimit)
              console.log(this.newCreditBalance)
              Swal.fire(
                'Success',
                'Credit information updated successfully!',
                'success'
              );
            },
            (error) => {
              Swal.fire('Error', 'An error occurred while updating credit information.', 'error');
            }
          );
      },
    });
  }
}
