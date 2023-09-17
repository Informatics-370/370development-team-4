import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { EmailService } from '../services/email.service';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;
import { QuoteVM } from '../shared/quote-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import { VAT } from '../shared/vat';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css'],
  providers: [DatePipe]
})
export class QuotesComponent {
  quotes: QuoteVMClass[] = []; //hold all quotes
  filteredQuotes: QuoteVMClass[] = []; //quotes to show user
  selectedQuote!: QuoteVMClass; //specific quote to show user
  oldQuote!: QuoteVM; //quote which was rejected that user wants to recreate with diff prices
  allVATs: VAT[] = [];
  quoteDuration: any;
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
  5 Expired
  6 Rejected; Successfully renegotiated */

  constructor(private dataService: DataService, private emailService: EmailService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getDataFromDB();
  }

  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getQuotesPromise = lastValueFrom(this.dataService.GetAllQuotes().pipe(take(1)));
      const getQuoteDurationPromise = lastValueFrom(this.dataService.GetQuoteDuration(1).pipe(take(1)));

      const [allVAT, allQuotes, duration] = await Promise.all([
        getVATPromise,
        getQuotesPromise,
        getQuoteDurationPromise
      ]);

      //put results from DB in global arrays
      this.allVATs = allVAT;
      this.quoteDuration = duration;
      console.log(this.quoteDuration);

      //put quotes in quote class
      this.filteredQuotes = []; //empty array
      allQuotes.forEach((quote: QuoteVM) => {
        let applicableVAT = this.getApplicableVAT(quote.dateGenerated); //get vat applicable to that date
        let quoteClassObj = new QuoteVMClass(quote, quote.lines, applicableVAT);
        this.filteredQuotes.push(quoteClassObj);
      });

      //sort quotes by quote ID so later quotes are first
      this.filteredQuotes.sort((currentQuote, nextQuote) => {
        return nextQuote.quoteID - currentQuote.quoteID;
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
  async openviewQuote(quoteID: number) {
    await this.getQuote(quoteID);
    $('#viewQuote').modal('show');
  }

  async getQuote(quoteID: number) {    
    //get quote from backend
    let quoteVM: QuoteVM = await lastValueFrom(this.dataService.GetQuote(quoteID).pipe(take(1)));
    
    //put in quote class
    let quoteLines: any[] = [];
    for (let i = 0; i < quoteVM.lines.length; i++) {
      const line = quoteVM.lines[i];
      let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product
      let custom: any;
      let customProdDescription = '';

      //if it's a custom product, get file for printing
      if (!isFixedProduct) {
        custom = await lastValueFrom(this.dataService.GetCustomProduct(line.customProductID).pipe(take(1)));
        customProdDescription = custom.sides > 0 ? ' with printing on ' + custom.sides + ' side(s)' : ' with no label'; //add no of sides to print on to prod description
      }

      /*line = {
        lineID: 0,
        isFixedProduct: true,
        productID: 0,
        productDescription: '',
        productFileB64: '' //stores product image / pdf (for custom products) as base64 string
        confirmedUnitPrice: 0,
        quantity: 0
      } */
      let quoteLine: any = {
        lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
        isFixedProduct: isFixedProduct,
        productID: isFixedProduct ? line.fixedProductID : line.customProductID,
        productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription + customProdDescription,
        productFileB64: custom ? custom.label : '',
        confirmedUnitPrice: line.confirmedUnitPrice,
        quantity: line.quantity,
      }

      quoteLines.push(quoteLine);
    }

    quoteVM.dateGenerated = new Date(quoteVM.dateGenerated); //convert date string to date object
    let applicableVAT = this.getApplicableVAT(quoteVM.dateGenerated); //get vat applicable to that date
    this.selectedQuote = new QuoteVMClass(quoteVM, quoteLines, applicableVAT);
  }

  //--------------------- DOWNLOAD PRICE MATCH FILE AND CUSTOM PROD PIC/FILE ---------------------
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

  downloadFile(base64: string, fileName: string) {
    var arrayBuffer = this.B64ToArrayBuffer(base64);
    let fileType: string = this.determineFileType(base64);
    console.log(fileType);

    if (fileType != 'undefined')
    {
      const blob = new Blob([arrayBuffer], { type: fileType });

      //Create link; apparently, I need this even though I have a download button
      const toDownload = document.createElement('a');
      toDownload.href = URL.createObjectURL(blob);
      toDownload.download = fileName + '.' + fileType.substring(fileType.length - 3);
      //priceMatchFile.download = 'Quote #' + this.selectedQuote.quoteID + ' price match file'
      toDownload.click(); //click link to start downloading
      URL.revokeObjectURL(toDownload.href); //clean up URL object
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

  openGenerateQuoteModal(requestID: number, quoteID: number) {
    this.newQuoteQRID = requestID;
    $('#generateQuote').modal('show');
    
    //get OG quote from backend to change it's status later
    this.dataService.GetQuote(quoteID).subscribe((result) => {
      this.oldQuote = result;
      console.log('oldQuote before we try to do anything to it' ,this.oldQuote);
    });
  }

  async closedGenerateQuoteModal(result: boolean) {
    if (result) { //if quote was generated successfully      
      try {
        $('#generateQuote').modal('hide');
      console.log('oldQuote after making new quote' ,this.oldQuote);

      //change old quote status to just successfully renegotiated
      this.updateQuoteStatus(this.oldQuote.quoteID);

      //email customer; in future, add login link
      let expiryDate = new Date(Date.now());
      expiryDate.setDate(expiryDate.getDate() + this.quoteDuration.duration);

      let emailBody = `<div style="width: 100%; height: 100%; background-color: rgb(213, 213, 213); padding: 0.25rem 0; font-family: Tahoma, Arial, Helvetica, sans-serif;">
                        <div style='width: 50%; margin: auto; height: 100%; background-color: white; padding: 0 1rem;'>
                          <h3>Hi ${this.oldQuote.customerFullName},</h3>
                          <p>After reviewing the competitor's quote you provided, we have created a new
                          quotation to hopefully beat that price. You can view it on your quotes page. Hurry, because it expires on
                          ${this.datePipe.transform(expiryDate, 'EEEE, d MMMM')}. </p><br />
                          Kind regards<br />
                          MegaPack
                        </div>
                      </div>`;

      this.emailService.sendEmail(this.oldQuote.customerEmail, 'New quotation!', emailBody);

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
        window.location.reload(); //refresh quotes list
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

  updateQuoteStatus(quoteId: number) {
    try {
      //statusID 6 = 'Rejected; Successfully renegotiated'; //should be 6
      this.dataService.UpdateQuoteStatus(quoteId, 7).subscribe((result) => {
        console.log("Successfully updated quote status!");
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  //------------------------------------ UPDATE QUOTE DURATION ------------------------------------
  updateQuoteDuration() {
    //check if duration changed
    let durationInput = document.getElementById('duration') as HTMLInputElement;
    let newDuration = Math.floor(parseInt(durationInput.value));
    console.log('New ' + newDuration + ' vs old ' + this.quoteDuration.duration);

    if (newDuration != this.quoteDuration.duration) {
      //warn user
      Swal.fire({
        icon: 'warning',
        title: "Are you sure?",
        html: `<b>Every quote</b> created from this point onwards and every active quote <b>(status of 'Generated')</b> will only be valid for ${newDuration} days.`,
        confirmButtonColor: '#32AF99',
        confirmButtonText: 'Yes, update it!',
        showCancelButton: true,
        cancelButtonColor: '#E33131',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateDurationInBackend(newDuration);
        }
      });
    }
  }

  updateDurationInBackend(newDuration: number) {
    let duration = {
      duration: newDuration
    }

    this.dataService.UpdateQuoteDuration(1, duration).subscribe((result) => {
      console.log('Successfully updated quote durations to', result);
      
      //notify user
      Swal.fire({
        icon: 'success',
        title: "Updated!",
        html: `Quote duration has been updated to ${newDuration} days.`,
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        console.log(result);
      });

      this.quoteDuration.duration = newDuration;
    });
  }
}
