import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { Customer } from '../../shared/customer';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from '../../shared/custom-product-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteLineVM } from '../../shared/quote-line-vm';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.css']
})
export class MyQuotesComponent {
  customerQuotes: QuoteVM[] = []; //hold quotes from backend
  quoteRequestFromBackend!: QuoteVM; //hold quote request if the user has any
  quoteRequest!: QuoteClass; //hold quote request in format to display to user
  allCustomerQuotes: QuoteClass[] = []; //hold all quotes
  filteredQuotes: QuoteClass[] = []; //quotes to show user
  quoteCount = -1;
  loading = true;
  allVATs: VAT[] = [];
  fixedProducts: FixedProductVM[] = [];
  customProducts: CustomProductVM[] = [];
  searchTerm: string = '';
  customer!: Customer;
  /*Status list: no need to retrieve this from the backend because it's static:
  1 Generated
  2 Accepted
  3 Rejected
  4 Rejected and will renegotiate
  5 Expired */

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getCustomProductsPromise = lastValueFrom(this.dataService.GetAllCustomProducts().pipe(take(1)));
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getActiveQuoteRequestPromise = lastValueFrom(this.dataService.CheckForActiveQuoteRequest('26865a70-5d8b-4443-be84-82cb360fba00').pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allFixedProducts, allCustomProducts, allVAT, activeQR] = await Promise.all([
        getFixedProductsPromise,
        getCustomProductsPromise,
        getVATPromise,
        getActiveQuoteRequestPromise
      ]);

      //put results from DB in global arrays
      this.fixedProducts = allFixedProducts;
      console.log('All fixed products', this.fixedProducts);
      this.customProducts = allCustomProducts;
      console.log('All custom products', this.customProducts);
      this.allVATs = allVAT;
      console.log('All VAT', this.allVATs);
      if (activeQR != null) this.quoteRequestFromBackend = activeQR;

      await this.getCustomerQuotesPromise();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //separate functionality of getting quotes so I can call it separately whenever an quote is updated
  async getCustomerQuotesPromise() {
    this.loading = true;
    try {
      this.customerQuotes = await lastValueFrom(this.dataService.GetQuotesByCustomer('26865a70-5d8b-4443-be84-82cb360fba00').pipe(take(1)));
      console.log('customerQuotes', this.customerQuotes);
      this.displayCustomerQuotes(); //Execute only after data has been retrieved from the DB otherwise error
    } catch (error) {
      console.error('An error occurred while retrieving quotes: ', error);
    }
  }

  displayCustomerQuotes() {
    //display quote request
    if (this.quoteRequestFromBackend != null) {
      //create array that holds product photo
      let quoteLines: any[] = [];

      this.quoteRequestFromBackend.lines.forEach(line => {
        let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product
        let fixedProduct: FixedProductVM | undefined;
        let customProduct: CustomProductVM | undefined;

        if (isFixedProduct) {
          fixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        }
        else {
          customProduct = this.customProducts.find(prod => prod.customProductID == line.customProductID);
        }

        let quoteLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? fixedProduct?.fixedProductID : customProduct?.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription,
          productFileB64: isFixedProduct ? fixedProduct?.productPhotoB64 : customProduct?.label,
          confirmedUnitPrice: line.suggestedUnitPrice,
          quantity: line.quantity,
        }

        quoteLines.push(quoteLine);
      });

      let applicableVAT = this.getApplicableVAT(this.quoteRequestFromBackend.dateRequested); //get vat applicable to that date
      this.quoteRequest = new QuoteClass(this.quoteRequestFromBackend, quoteLines, applicableVAT, false);
    }

    //display quotes
    this.filteredQuotes = []; //empty array
    this.allCustomerQuotes = [];

    this.customerQuotes.forEach(quote => {
      //create array that holds product photo
      let quoteLines: any[] = [];
      quote.lines.forEach(line => {
        let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product
        let fixedProduct: FixedProductVM | undefined;
        let customProduct: CustomProductVM | undefined;

        if (isFixedProduct) {
          fixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        }
        else {
          customProduct = this.customProducts.find(prod => prod.customProductID == line.customProductID);
        }

        let quoteLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? fixedProduct?.fixedProductID : customProduct?.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription,
          productFileB64: isFixedProduct ? fixedProduct?.productPhotoB64 : customProduct?.label,
          confirmedUnitPrice: line.confirmedUnitPrice,
          quantity: line.quantity,
        }

        quoteLines.push(quoteLine);
      });

      let applicableVAT = this.getApplicableVAT(quote.dateGenerated); //get vat applicable to that date
      let quoteClass: QuoteClass = new QuoteClass(quote, quoteLines, applicableVAT);
      this.filteredQuotes.push(quoteClass);
    });

    this.allCustomerQuotes = this.filteredQuotes; //store all the quote someplace before I search below
    this.quoteCount = this.filteredQuotes.length; //update the number of quotes
    this.loading = false;
  }

  getApplicableVAT(date: Date): VAT {
    for (let i = this.allVATs.length - 1; i >= 0; i--) {
      if (date >= this.allVATs[i].date) {
        return this.allVATs[i];
      }
    }

    return this.allVATs[this.allVATs.length - 1]; // Fallback to the latest VAT if no applicable VAT is found
  }
}

//extend classic quote VM functionality; this is the only page where I will use this class
class QuoteClass implements QuoteVM {
  //quote request-specific info
  quoteRequestID: number;
  dateRequested: Date; //date the quote was requested

  //quote-specific info
  quoteID: number;
  quoteStatusID: number;
  quoteStatusDescription: string;
  rejectReasonID: number;
  rejectReasonDescription: string;
  priceMatchFileB64: string;
  dateGenerated: Date; //date the quote was generated
  quoteDurationID: number;
  quoteDuration: number;
  dateExpiring: Date = new Date(Date.now()); //date quote is expiring as string

  //generic info
  customerId: string;
  customerFullName: string;
  lines: any[];
  /*line = {
    lineID: 0,
    isFixedProduct: true,
    productID: 0,
    productDescription: '',
    productFileB64: '' //stores product image / pdf (for custom products) as base64 string
    confirmedUnitPrice: 0,
    quantity: 0
  }*/
  applicableVAT: VAT;
  totalBeforeVAT = 0;
  totalVAT = 0;

  constructor(quote: QuoteVM, lines: any[], applicableVAT: VAT, isQuote: boolean = true) {
    this.quoteDurationID = quote.quoteDurationID;
    this.quoteDuration = quote.quoteDuration;
    this.dateRequested = quote.dateRequested;
    this.lines = lines;
    this.applicableVAT = applicableVAT;
    this.quoteRequestID = quote.quoteRequestID;
    this.quoteID = quote.quoteID;
    this.quoteStatusID = quote.quoteStatusID;
    this.quoteStatusDescription = quote.quoteStatusDescription;
    this.rejectReasonID = quote.rejectReasonID;
    this.rejectReasonDescription = quote.rejectReasonDescription;
    this.priceMatchFileB64 = quote.priceMatchFileB64;
    this.dateGenerated = quote.dateGenerated;
    this.customerId = quote.customerId;
    this.customerFullName = quote.customerFullName;
    this.totalBeforeVAT = this.getTotalBeforeVAT();
    this.totalVAT = this.getVATAmount();
    console.log(this.dateRequested, this.dateGenerated, this.quoteDuration)
    if (isQuote) {
      this.dateExpiring = new Date(this.dateGenerated.getDate() + this.quoteDuration);
    }
  }

  getTotalBeforeVAT(): number {
    let total = 0;
    this.lines.forEach(line => {
      total += line.confirmedUnitPrice * line.quantity;
    });

    return total;
  }

  getVATAmount(): number {
    return this.totalBeforeVAT * this.applicableVAT.percentage / 100;
  }

  getTotalAfterVAT(): number {
    return this.totalBeforeVAT + this.totalVAT;
  }

  //since toDateString, toLocaleDateString, etc. throws an error, this will do it manually
  getFormattedDate(date: Date): string {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    //put date in format dd MMM yyyy hh:mm
    const yyyy = date.getFullYear();
    let mm = months[date.getMonth()]; // month is zero-based
    let dd = date.getDate().toString();
    let hh = date.getHours().toString();
    let min = date.getMinutes().toString();
    
    if (parseInt(dd) < 10) dd = '0' + dd;
    if (parseInt(hh) < 10) hh = '0' + hh;
    if (parseInt(min) < 10) min = '0' + min;
    
    let dateInCorrectFormat = dd + ' ' + mm + ' ' + yyyy + ' ' + hh + ':' + min;
    console.log('dateInCorrectFormat', dateInCorrectFormat); // 2023-07-31 18:23
    return dateInCorrectFormat;
  }
}
