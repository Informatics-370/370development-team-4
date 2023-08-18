import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { QuoteVM } from '../shared/quote-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-qoute-requests',
  templateUrl: './qoute-requests.component.html',
  styleUrls: ['./qoute-requests.component.css']
})
export class QouteRequestsComponent {
  quoteRequests: QuoteVM[] = []; //hold all quote requests
  filteredQuoteRequests: QuoteVM[] = []; //quoteRequests to show user
  selectedQuoteRequest!: QuoteVMClass; //specific quote request to show user and generate quote from
  searchTerm: string = '';
  //display messages to user
  quoteRequestCount = -1;
  loading = true;
  error: boolean = false;
  selectedQRID = 0;

  constructor(private dataService: DataService) {
    /* this.addQuoteRequestLineForm = this.formBuilder.group({
      productID: [Validators.required],
      quantity: [1.00, Validators.required]
    }); */
  }

  ngOnInit() {
    this.getQuoteRequestsPromise();
    //this.getDataFromDB();
  }

  
  //get quoteRequests separately so I can update only quoteRequests list when quoteRequest is updated to save time
  async getQuoteRequestsPromise(): Promise<any> {
    try {
      this.filteredQuoteRequests = await lastValueFrom(this.dataService.GetAllActiveQuoteRequests().pipe(take(1)));

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

  /* async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      //The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      //That's what the Promise.all method is supposed to be doing.
      const [allVAT, allProducts] = await Promise.all([
        getVATPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.allVATs = allVAT;
      this.filteredFixedProducts = allProducts;
      this.fixedProducts = this.filteredFixedProducts; //store all products someplace before I filter below
      console.log('All products: ', this.fixedProducts, 'and filtered products: ', this.filteredFixedProducts);

      await this.getQuoteRequestsPromise();
    } catch (error) {
      this.quoteRequestCount = -1;
      this.loading = false;
      this.error = true;
      console.error('Error retrieving data', error);
    }
  } */

  //Angular has some kind of issue with the date.getTime() function
  /* getTimeSince(date: Date): string {
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (years >= 1) {
      return `Over ${years} year(s) ago`;
    } else if (months >= 1) {
      return `Over ${months} month(s) ago`;
    } else if (days >= 1) {
      return `${days} day(s) ago`;
    } else if (hours >= 1) {
      return `Over ${hours} hour(s) ago`;
    } else {
      return `${minutes} minute(s) ago`;
    }
  } */
}
