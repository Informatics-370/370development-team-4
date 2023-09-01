import { Component } from '@angular/core';
import { CreditApplication } from '../shared/creditApplication';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare var $: any; 

@Component({
  selector: 'app-admin-credit-application',
  templateUrl: './admin-credit-application.component.html',
  styleUrls: ['./admin-credit-application.component.css']
})

export class AdminCreditApplicationComponent {
  CreditApplications: CreditApplication[] = []; //used to store all estimate durations
  filteredCrApp: CreditApplication[] = []; //used to hold all the estimate durations that will be displayed to the user
  specificCrApp!: CreditApplication; //used to get a specific estimate duration
  CreditAppCount: number = -1; //keep track of how many cr apps there are in the DB
  
  //search functionality
  searchTerm: string = '';
  submitClicked = false; //keep track of when submit button is clicked in forms, for validation errors
  loading = true; //show loading message while data loads

  constructor(private dataService: DataService) {}
  ngOnInit(): void {
    this.getCreditApplications();
  }

  getCreditApplications() { //get all cr apps
    this.dataService.GetCreditApplications().subscribe((result: any[]) => {
      let allCrApp: any[] = result;
      this.filteredCrApp = []; //empty item array
      allCrApp.forEach((CreditApplication) => {
        this.filteredCrApp.push(CreditApplication);
      });
      this.CreditApplications = this.filteredCrApp; //store all the Cr App someplace before searching below
      this.CreditAppCount = this.filteredCrApp.length; //update the number of items

      console.log('All credit applications array: ', this.filteredCrApp);
      this.loading = false; //stop displaying loading message
    });
}
  //--------------------SEARCH BAR LOGIC----------------
  searchCrApp(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredCrApp = []; //clear array
    for (let i = 0; i < this.CreditApplications.length; i++) {
      let currentCreditApplication: string = this.CreditApplications[i].ApplicationFile;
      if (currentCreditApplication.toString().includes(this.searchTerm))
      {
        this.filteredCrApp.push(this.CreditApplications[i]);
      }
    }
    this.CreditAppCount = this.filteredCrApp.length; //update duration count so message can be displayed if no durations are found
    console.log(this.filteredCrApp);
  }


}
