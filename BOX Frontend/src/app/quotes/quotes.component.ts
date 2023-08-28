import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { QuoteVM } from '../shared/quote-vm';
import { QuoteLineVM } from '../shared/quote-line-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import { VAT } from '../shared/vat';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent {
  quotes: QuoteVMClass[] = []; //hold all quotes
  filteredQuotes: QuoteVMClass[] = []; //quotes to show user
  selectedQuote!: QuoteVMClass; //specific quote to show user
  allVATs: VAT[] = [];
  searchTerm: string = '';
  //display messages to user
  quoteCount = -1;
  loading = true;
  error: boolean = false;
  /*Status list: no need to retrieve this from the backend because it's static:
  1 Generated
  2 Accepted
  3 Rejected
  4 Rejected and will renegotiate
  5 Expired */

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getQuotesPromise = lastValueFrom(this.dataService.GetAllQuotes().pipe(take(1)));

      const [allVAT, allQuotes] = await Promise.all([
        getVATPromise,
        getQuotesPromise
      ]);

      //put results from DB in global arrays
      this.allVATs = allVAT;
      allQuotes.forEach((quote: QuoteVM) => {
        let applicableVAT = this.getApplicableVAT(quote.dateGenerated); //get vat applicable to that date
        let quoteClassObj = new QuoteVMClass(quote, quote.lines, applicableVAT);
        this.filteredQuotes.push(quoteClassObj);
      });
  
      this.quotes = this.filteredQuotes; //store all the quote someplace before I search below
      this.quoteCount = this.filteredQuotes.length; //update the number of quotes
      this.loading = false;

    } catch (error) {
      this.quoteCount = -1;
      this.loading = false;
      this.error = true;
      console.error('Error retrieving data:', error);
    }
  }  

  getApplicableVAT(date: Date): VAT {
    for (let i = this.allVATs.length - 1; i >= 0; i--) {
      if (date >= this.allVATs[i].date) {
        return this.allVATs[i];
      }
    }

    return this.allVATs[this.allVATs.length - 1]; // Fallback to the latest VAT if no applicable VAT is found
  }

  searchQuotes(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredQuotes = []; //clear array
    for (let i = 0; i < this.quotes.length; i++) {
      //concatenate all the quote info in one variable so user can search using any of them
      let estInformation: string = String('QUO' + this.quotes[i].quoteID + ' ' +
        this.quotes[i].customerFullName + ' ' +
        this.quotes[i].quoteStatusDescription).toLowerCase();

      if (estInformation.includes(this.searchTerm.toLowerCase())) {
        this.filteredQuotes.push(this.quotes[i]);
      }
    }

    this.quoteCount = this.filteredQuotes.length; //update quotes count

    console.log('Search results:', this.filteredQuotes);
  }

  //-------------------VIEW SPECIFIC QUOTE LOGIC-------------------
  
}
