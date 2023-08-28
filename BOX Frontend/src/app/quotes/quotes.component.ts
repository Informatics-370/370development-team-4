import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { QuoteVM } from '../shared/quote-vm';
import { QuoteLineVM } from '../shared/quote-line-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import { VAT } from '../shared/vat';
import Swal from 'sweetalert2';

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

  //regenerate quote for customer who wants to renegotiate
  newQuoteQRID = 0; //ID of QUOTE REQUEST that you want to regenerate a quote
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
  openviewQuote(quoteID: number) {
    //get quote from backend
    let quoteVM: QuoteVM;

    this.dataService.GetQuote(quoteID).subscribe((result) => {
      console.log('result', result);
      quoteVM = result;

      //put in quote class
      let quoteLines: any[] = [];
      quoteVM.lines.forEach(line => {
        let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product
  
        /*line = {
          lineID: 0,
          isFixedProduct: true,
          productID: 0,
          productDescription: '',
          suggestedUnitPrice: 0,
          confirmedUnitPrice: 0,
          quantity: 0
        }*/
        let quoteLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? line.fixedProductID : line.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription,
          suggestedUnitPrice: line.suggestedUnitPrice,
          confirmedUnitPrice: line.confirmedUnitPrice,
          quantity: line.quantity,
        }
  
        quoteLines.push(quoteLine);
      });
  
      quoteVM.dateGenerated = new Date(quoteVM.dateGenerated); //convert date string to date object
      let applicableVAT = this.getApplicableVAT(quoteVM.dateGenerated); //get vat applicable to that date
      this.selectedQuote = new QuoteVMClass(quoteVM, quoteLines, applicableVAT);
  
      $('#viewQuote').modal('show');
    });
  }

  //download price match file
  //determine file type from base64 string
  determineFileType(base64: string): string {
    const fileTypes = [
      {
        startingChars: 'JVBERi0',
        type: "application/pdf"
      },
      {
        startingChars: 'iVBORw0KGgo',
        type: "image/png"
      },
      {
        startingChars: '/9j/',
        type: "image/jpg"
      }
    ];
    let returnString = 'undefined';

    fileTypes.forEach(ft => {
      if (base64.startsWith(ft.startingChars)) returnString = ft.type;      
    });

    return returnString;
  }

  downloadPriceMatchFile() {
    var arrayBuffer = this.B64ToArrayBuffer(this.selectedQuote.priceMatchFileB64);
    let fileType: string = this.determineFileType(this.selectedQuote.priceMatchFileB64);
    console.log(fileType);

    if (fileType != 'undefined')
    {
      const blob = new Blob([arrayBuffer], { type: fileType });

      //Create link; apparently, I need this even though I have a download button
      const priceMatchFile = document.createElement('a');
      priceMatchFile.href = URL.createObjectURL(blob);
      // priceMatchFile.href = this.selectedQuote.priceMatchFileB64;
      priceMatchFile.download = 'Quote #' + this.selectedQuote.quoteID + ' price match file.' + fileType.substring(fileType.length - 3);
      priceMatchFile.click(); //click link to start downloading
      URL.revokeObjectURL(priceMatchFile.href); //clean up URL object
    }
  }

  //need to convert to array buffer first otherwise file is corrupted
  B64ToArrayBuffer(B64String: string) {
    var binaryString = window.atob(B64String); //decodes a Base64 string into a binary string
    var binaryLength = binaryString.length;
    var byteArray = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryLength; i++) {
      var ascii = binaryString.charCodeAt(i); //retrieve the ASCII code of the character in the binary string
      byteArray[i] = ascii; //assigns ASCII code to corresponding character in byte array
    }
    return byteArray;
  }
  
}
