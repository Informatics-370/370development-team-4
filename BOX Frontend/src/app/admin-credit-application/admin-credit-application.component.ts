import { Component } from '@angular/core';
import { CreditApplication } from '../shared/creditApplication';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  selectedFile: any;

  constructor(private dataService: DataService, private http: HttpClient) {}
  ngOnInit(): void {
    this.getCreditApplications();
  }

//   uploadCreditApplication(formData: FormData)
// {
//   const file = fileInput.files[0];

//     if (!file) {
//       console.error('No file selected.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('creditApplicationFile', file);


//     const uploadUrl = 'CreditApplication/UploadApplication';

//     this.http.post
// }

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0]; // Store the selected file
}
uploadCreditApplication() {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.dataService.uploadApplication(formData).subscribe(
      (result) => {
        // Handle the response, e.g., show a success message
        console.log('File upload successful:', result);
      },
      (error) => {
        // Handle the error, e.g., display an error message
        console.error('File upload failed:', error);
      }
    );
  } else {
    // Handle the case where no file is selected, e.g., show an error message
    console.error('No file selected for upload.');
  }
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


// const express = require('express');

// const multer = require('multer');

// const path = require('path');



// const app = this.express();



// // Set up multer for handling file uploads

// const storage = this.multer.diskStorage({

//  destination: (req, file, callback) => {

//   // Specify the folder where documents will be stored

//   callback(null, './uploads/documents');

//  },

//  filename: (req, file, callback) => {

//   // Rename the file to prevent naming conflicts

//   const timestamp = Date.now();

//   callback(null, `${timestamp}-${file.originalname}`);

//  },

// });



// const upload = this.multer({ Storage });



// // Handle the file upload

// try {
//   this.dataService.UploadApplication('/upload', upload.single('document'), (req, res) => {

//  // File has been uploaded successfully

//  res.status(200).json({ message: 'Document uploaded successfully' });

// });}
// catch {
//   console.log("Error in uploading document"); }
 

}
