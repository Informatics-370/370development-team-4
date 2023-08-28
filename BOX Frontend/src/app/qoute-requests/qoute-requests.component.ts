import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { QuoteVM } from '../shared/quote-vm';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-qoute-requests',
  templateUrl: './qoute-requests.component.html',
  styleUrls: ['./qoute-requests.component.css']
})
export class QouteRequestsComponent {
  quoteRequests: QuoteVM[] = []; //hold all quote requests
  filteredQuoteRequests: QuoteVM[] = []; //quote requests to show user
  searchTerm: string = '';
  //display messages to user
  quoteRequestCount = -1;
  loading = true;
  error: boolean = false;
  selectedQRID = 0;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getQuoteRequestsPromise();
  }
  
  //get quoteRequests separately so I can update only quoteRequests list when quoteRequest is updated to save time
  async getQuoteRequestsPromise(): Promise<any> {
    try {
      let allQRs: QuoteVM[] = await lastValueFrom(this.dataService.GetAllActiveQuoteRequests().pipe(take(1)));

      //date comes as string so convert back to date
      allQRs.forEach(qr => {
        qr.dateRequested = new Date(qr.dateRequested);
        this.filteredQuoteRequests.push(qr);
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
  }

  closedGenerateQuoteModal(result: boolean) {
    if (result) { //if quote was generated successfully
      //email customer
      
      //notify user
      Swal.fire({
        icon: 'success',
        title: "Quote created successfully.",
        html: 'The customer has been notified via email.',
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        console.log(result);
      });

      //refresh quote request list
      this.error = false;
      this.quoteRequestCount = -1;
      this.loading = true;
      this.getQuoteRequestsPromise();
    }
    else {      
      //notify user
      Swal.fire({
        icon: 'error',
        title: "An error occurred while trying to create the quote.",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#E33131'
      }).then((result) => {
        console.log(result);
      });
    }
  }
}
