import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.services';
import { CreditApplication } from '../shared/creditApplication';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'
import { AuthService } from '../services/auth.service';
import { Users } from '../shared/user';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-credit-application',
  templateUrl: './credit-application.component.html',
  styleUrls: ['./credit-application.component.css'],
})
export class CreditApplicationComponent {
  @ViewChild('pdfUpload', { static: false }) pdfUpload!: ElementRef<
    HTMLInputElement
  >;
  selectedFileName: string = '';
  selectedFile: any;
  customer!: Users;


  constructor(private dataService: DataService, private httpClient: HttpClient, private router: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.getCustomerData();
  }

  async getCustomerData() {
    const token = localStorage.getItem('access_token')!;
    let id = this.authService.getUserIdFromToken(token);
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.customer = await this.authService.getUserByEmail(email);
      if (id) this.customer.id = id;
      console.log(this.customer)
    }
  }

  displayFileName(event: any) {
    const fileInput = event.target;
    const fileName = fileInput.files[0].name;
    this.selectedFileName = `Selected File: ${fileName}`;
    this.onFileSelected(event);
  }

  onUploadButtonClick() {
    // Trigger the click event on the file input 
    this.pdfUpload.nativeElement.click();
    return;
  }
  // File not selected, handle accordingly (show an error message, etc.)


  //   // onDownloadApplication() {
  //   //   this.dataService.downloadApplication(file).subscribe(
  //   //     (result: any) => {
  //   //       console.log('New app!', result),
  //   //     (error) => {
  //   //       console.error('Error submitting form:', error);
  //   //     }
  //   //   );
  //   // }

  //   const file = file[0];

  //   // Create a FormData object to send the file as part of the request
  //   const formData = new FormData();
  //   formData.append('creditAppVM.CreditApplicationID', '0'); // Set the appropriate values here
  //   formData.append('creditAppVM.CreditApplicationStatusID', '0');
  //   formData.append('creditAppVM.UserName', 'nikkeshapillay@gmail.com'); // REPLACE EMAIL ADDRESS
  //   formData.append('creditAppVM.Application_Pdf64', file);

  //   //CREDIT APPLICATION STATUS
  //   /*Status list: 
  // 1	Submitted
  // 2	Accepted
  // 3	Rejected
  // */

  //   // Submit the application using the service
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0]; // Store the selected file
  }

  async onSubmitApplication() {
    if (this.selectedFile) {
      const CrAppVM: CreditApplication = {
        creditApplicationID: 0,
        creditApplicationStatusID: 0,
        userId: this.customer.id,
        application_Pdf64: await this.convertToBase64(this.selectedFile),
      };
  
      this.dataService.submitApplication(CrAppVM).subscribe(
        (result) => {
          // Application successfully submitted, show a success notification
          Swal.fire({
            title: 'Success!',
            text: 'Credit application submitted successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
  
          // Reset form or perform any other actions after successful submission
          console.log('Application submitted:', result);
        },
        (error) => {
          // Error occurred during submission, show an error notification
          Swal.fire({
            title: 'Error!',
            text: 'Error submitting credit application. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
  
          console.error('Error submitting application:', error);
          // Display an error message or perform any other actions on error
        }
      );
    } else {
      // Handle the case where no file is selected, e.g., show an error message
      Swal.fire({
        title: 'No File Selected',
        text: 'Please select a file for the credit application.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
  
      console.error('No file selected for the credit application.');
    }
  }




    // downloadPDF() {
    //   // URL of your PDF file

    //   const pdfUrl = '/CreditApplicationForm';

    //   // Create a temporary anchor element
    //   const anchor = document.createElement('a');
    //   anchor.href = pdfUrl;
    //   anchor.target = '_blank'; // Open in a new tab/window

    //   // Set the download attribute to specify the file name
    //   anchor.download = 'document.pdf';

    //   // Programmatically click the anchor to trigger the download
    //   anchor.click();
    // }

  

  //convert image to B64
  convertToBase64(pdf: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        resolve(base64String.substring(base64String.indexOf(',') + 1)); // Resolve the promise with the base64 string; get rid of the data:image/... that auto appends itself to the B64 string
      };
      reader.onerror = (error) => {
        reject(error); // Reject the promise if an error occurs
      };
      reader.readAsDataURL(pdf);
    });
  }
}

