import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { EmailService } from '../services/email.service';
import { take, lastValueFrom } from 'rxjs';
import { QuoteVM } from '../shared/quote-vm';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'app-qoute-requests',
  templateUrl: './qoute-requests.component.html',
  styleUrls: ['./qoute-requests.component.css'],
  providers: [DatePipe]
})
export class QouteRequestsComponent {
  quoteRequests: QuoteVM[] = []; //hold all quote requests
  filteredQuoteRequests: QuoteVM[] = []; //quote requests to show user
  oldQuoteRequest!: QuoteVM; //store quote request user wants to generate a quote from
  searchTerm: string = '';
  quoteDuration: any;

  //display messages to user
  quoteRequestCount = -1;
  loading = true;
  error: boolean = false;
  selectedQRID = 0;

  constructor(private dataService: DataService, private emailService: EmailService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getQuoteRequestsPromise();
  }
  
  //get quoteRequests separately so I can update only quoteRequests list when quoteRequest is updated to save time
  async getQuoteRequestsPromise(): Promise<any> {
    try {
      this.quoteDuration = await lastValueFrom(this.dataService.GetQuoteDuration(1).pipe(take(1)));
      let allQRs: QuoteVM[] = await lastValueFrom(this.dataService.GetAllActiveQuoteRequests().pipe(take(1)));

      //date comes as string so convert back to date
      allQRs.forEach(qr => {
        qr.dateRequested = new Date(qr.dateRequested);
        this.filteredQuoteRequests.push(qr);

        //if user currently logged in is an emloyee, filter quote requests to only be for customers assigned to that employee
      });

      this.quoteRequests = this.filteredQuoteRequests; //store all the quote requests someplace before I search below
      this.quoteRequestCount = this.filteredQuoteRequests.length; //update the number of quote requests

      console.log('All quote requests array: ', this.filteredQuoteRequests);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.quoteRequestCount = -1;
      this.error = true;
      console.error('An error occurred while retrieving quote requests: ', error);
    }
  }

  getTimeSince(date: Date): string {
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years >= 1) {
      return date.toDateString();
    } 
    else if (months >= 1) {
      if (months == 1) {
        return `${months} month ago`;
      }
      return `${months} months ago`;
    } 
    else if (days >= 1) {
      if (days == 1) {
        return `${days} day ago`;
      }
      return `${days} days ago`;
    } 
    else if (hours >= 1) {
      if (hours == 1) {
        return `${hours} hour ago`;
      }
      return `${hours} hours ago`;
    } 
    else {
      if (minutes == 1) {
        return `${minutes} minute ago`;
      }
      else if (minutes == 0) {
        return `Just now`;
      }
      return `${minutes} minutes ago`;
    }
  }

  searchQuoteRequests(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredQuoteRequests = []; //clear array
    for (let i = 0; i < this.quoteRequests.length; i++) {
      //concatenate all the quote request info in one variable so user can search using any of them
      let estInformation: string = String('QR' + this.quoteRequests[i].quoteRequestID + ' ' +
        this.quoteRequests[i].customerFullName).toLowerCase();

      if (estInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredQuoteRequests.push(this.quoteRequests[i]);
      }
    }

    this.quoteRequestCount = this.filteredQuoteRequests.length; //update quoteRequests count

    console.log('Search results:', this.filteredQuoteRequests);
  }

  openGenerateQuoteModal(id: number) {
    this.selectedQRID = id;
    $('#generateQuote').modal('show');
    
    //get OG quote from backend to change it's status later
    this.dataService.GetQuoteRequest(id).subscribe((result) => {
      this.oldQuoteRequest = result;
      console.log('old QR before we try to do anything to it' ,this.oldQuoteRequest);
    });
  }

  closedGenerateQuoteModal(result: boolean) {
    if (result) { //if quote was generated successfully
      try {
        $('#generateQuote').modal('hide');
      
        //email customer; in future, add login link
        let expiryDate = new Date(Date.now());
        expiryDate.setDate(expiryDate.getDate() + this.quoteDuration.duration);

        let emailBody = `<div style="width: 100%; height: 100%; background-color: rgb(213, 213, 213); padding: 0.25rem 0; font-family: Tahoma, Arial, Helvetica, sans-serif;">
                          <div style='width: 50%; margin: auto; height: 100%; background-color: white; padding: 0 1rem;'>
                            <h3>Hi ${this.oldQuoteRequest.customerFullName},</h3>
                            <p>Your quote is ready! We worked tirelessly to give you the best price. You can view it on your quotes page. 
                            Hurry, because it expires on ${this.datePipe.transform(expiryDate, 'EEEE, d MMMM')}. </p><br />
                            Kind regards<br />
                            MegaPack
                          </div>
                        </div>`;

        this.emailService.sendEmail(this.oldQuoteRequest.customerEmail, 'New quotation!', emailBody);
        
        //notify user
        Swal.fire({
          icon: 'success',
          title: "Success!",
          html: 'Quote created successfully. The customer has been notified via email.',
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: '#32AF99'
        }).then((result) => {
          console.log(result);
          window.location.reload(); //refresh quote request list
        });
      } 
      catch (error) {
        console.error(error);
        //notify user
        Swal.fire({
          icon: 'error',
          title: "Oops..",
          html: 'Something went wrong while trying to create the quote or send the email.',
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: '#E33131'
        }).then((result) => {
          console.log(result);
        });        
      }
    }
    else {
      //notify user
      Swal.fire({
        icon: 'error',
        title: "Oops..",
        html: 'Something went wrong while trying to create the quote or send the email.',
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#E33131'
      }).then((result) => {
        console.log(result);
      });
    }
  }
}
