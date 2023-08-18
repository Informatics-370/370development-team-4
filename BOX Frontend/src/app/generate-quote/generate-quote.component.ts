import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteVM } from '../shared/quote-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import { VAT } from '../shared/vat';
import { FixedProductVM } from '../shared/fixed-product-vm';

@Component({
  selector: 'app-generate-quote',
  templateUrl: './generate-quote.component.html',
  styleUrls: ['./generate-quote.component.css']
})
export class GenerateQuoteComponent {
  @Input() quoteRequestID: number = 0; //Accept quote request ID from parent component
  @Output() resultEvent = new EventEmitter<boolean>(); //used to send boolean back to parent component. true = quote successfully created; false = fail
  selectedQR!: QuoteVM;
  selectedQuote!: QuoteVMClass;
  now: Date = new Date(Date.now());
  fixedProducts: FixedProductVM[] = [];
  filteredFixedProducts: FixedProductVM[] = [];
  vat!: VAT;

  //messages to user
  loading = false; //is true when data is successfully retrieved from backend
  error: boolean = false;

  //forms logic
  addQuoteLineForm: FormGroup;
  selectedProductID = 'NA';
  selectedProduct: FixedProductVM | undefined;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addQuoteLineForm = this.formBuilder.group({
      productID: [Validators.required],
      quantity: [1.00, Validators.required]
    });
  }

  ngOnInit() {
    this.getDataFromDB();
  }
  
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetVAT().pipe(take(1)));
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      That's what the Promise.all method is supposed to be doing.*/
      const [currentVAT, allProducts] = await Promise.all([
        getVATPromise,
        getProductsPromise
      ]);

      //put results from DB in global arrays
      this.vat = currentVAT;
      this.filteredFixedProducts = allProducts;
      this.fixedProducts = this.filteredFixedProducts; //store all products someplace before I filter below
      console.log('All products: ', this.fixedProducts, 'and current VAT: ', this.vat);

      await this.getQuoteRequest();
    } catch (error) {
      this.loading = false;
      this.error = true;
      console.error('Error retrieving data', error);
    }
  }

  async getQuoteRequest() {
    if (this.quoteRequestID > 0) {
      try {
        this.selectedQR = await lastValueFrom(this.dataService.GetQuoteRequest(this.quoteRequestID).pipe(take(1)));

        console.log('Successfully retrieved quote request with ID: ' + this.quoteRequestID, this.selectedQR);

        let quoteLines: any[] = [];
        this.selectedQR.lines.forEach(line => {
          let isFixedProduct: boolean = line.fixedProductID != 0; //first determine if it's a fixed product

          let qrline = {
            lineID: line.quoteRequestLineID,
            isFixedProduct: isFixedProduct,
            productID: isFixedProduct ? line.fixedProductID : line.customProductID,
            productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription,
            suggestedUnitPrice: line.suggestedUnitPrice,
            confirmedUnitPrice: line.confirmedUnitPrice,
            quantity: line.quantity
          };

          quoteLines.push(qrline);
        });

        this.selectedQuote = new QuoteVMClass(this.selectedQR, quoteLines, this.vat, false);      
      } catch (error) {
        console.error('Error retrieving quote request with ID of ' + this.quoteRequestID, error);
      }
    }
  }
}
