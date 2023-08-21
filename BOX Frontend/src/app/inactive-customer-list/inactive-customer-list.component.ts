import { Component } from '@angular/core';
import { DataService } from '../services/data.services';

@Component({
  selector: 'app-inactive-customer-list',
  templateUrl: './inactive-customer-list.component.html',
  styleUrls: ['./inactive-customer-list.component.css']
})
export class InactiveCustomerListComponent {
  //messages to user
  loading = false;
  userCount = -1;
  inactiveCustomers: any[] = [];
  now = new Date(Date.now()); //date report is generated

  constructor(private dataService: DataService) { }

  generateReport() {
    this.dataService.GetInactiveCustomerList().subscribe((result) => {
      this.inactiveCustomers = result;
      this.userCount = this.inactiveCustomers.length;
    });
  }
}
