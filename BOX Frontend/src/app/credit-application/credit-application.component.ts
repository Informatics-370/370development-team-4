import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.services';
import { CreditApplication } from '../shared/creditApplication';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-credit-application',
  templateUrl: './credit-application.component.html',
  styleUrls: ['./credit-application.component.css'],
})
export class CreditApplicationComponent 
{
  @ViewChild('pdfUpload', { static: false }) pdfUpload!: ElementRef<
    HTMLInputElement
  >;
  selectedFileName: string = '';


  constructor(private dataService: DataService, private httpClient: HttpClient, private router:  ActivatedRoute) {}

  
  displayFileName(event: any) {
    const fileInput = event.target;
    const fileName = fileInput.files[0].name;
    this.selectedFileName = `Selected File: ${fileName}`;
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
  onSubmitApplication(){
    // this.dataService
    //   // .submitApplication()
    //   // .subscribe(
    //     (result) => {
    //       // Application successfully submitted, handle accordingly
    //       console.log('Application submitted:', result);
    //       // Reset form or perform any other actions after successful submission
    //     },
    //     (error) => {
    //       // Error occurred during submission, handle accordingly
    //       console.error('Error submitting application:', error);
    //       // Display an error message or perform any other actions on error
    //     }
    //   );
  }
      
    
   

  downloadPDF() {
    // URL of your PDF file
   
    const pdfUrl = '/CreditApplicationForm';

    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = pdfUrl;
    anchor.target = '_blank'; // Open in a new tab/window

    // Set the download attribute to specify the file name
    anchor.download = 'document.pdf';

    // Programmatically click the anchor to trigger the download
    anchor.click();
  }
  
}

