import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { Customer } from '../../shared/customer';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from '../../shared/custom-product-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteLineVM } from '../../shared/quote-line-vm';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { take, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.component.html',
  styleUrls: ['./my-quotes.component.css']
})
export class MyQuotesComponent {
  customerQuotes: QuoteVM[] = []; //hold quotes from backend
  quoteRequestFromBackend!: QuoteVM; //hold quote request if the user has any
  quoteRequest!: QuoteVMClass; //hold quote request in format to display to user
  allCustomerQuotes: QuoteVMClass[] = []; //hold all quotes
  filteredQuotes: QuoteVMClass[] = []; //quotes to show user
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
      this.quoteRequest = new QuoteVMClass(this.quoteRequestFromBackend, quoteLines, applicableVAT, false);
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
      let quoteClass: QuoteVMClass = new QuoteVMClass(quote, quoteLines, applicableVAT);
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

  //--------------------------------------------- SEARCH QUOTE ---------------------------------------------
  searchQuotes(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.filteredQuotes = []; //clear array
    for (let i = 0; i < this.allCustomerQuotes.length; i++) {
      //concatenate all the searchable quote info in one variable
      let toSearch: string = String(this.allCustomerQuotes[i].quoteID + this.allCustomerQuotes[i].quoteStatusDescription).toLowerCase();

      if (toSearch.includes(this.searchTerm.toLowerCase())) {
        this.filteredQuotes.push(this.allCustomerQuotes[i]);
      }
    }

    this.quoteCount = this.filteredQuotes.length; //update quote count
    console.log('Search results:', this.filteredQuotes);
  }

}
