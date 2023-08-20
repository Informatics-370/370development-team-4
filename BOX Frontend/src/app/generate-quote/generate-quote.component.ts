import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuoteVM } from '../shared/quote-vm';
import { QuoteLineVM } from '../shared/quote-line-vm';
import { QuoteVMClass } from '../shared/quote-vm-class';
import { VAT } from '../shared/vat';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { Customer } from '../shared/customer';
declare var $: any;

@Component({
  selector: 'app-generate-quote',
  templateUrl: './generate-quote.component.html',
  styleUrls: ['./generate-quote.component.css']
})
export class GenerateQuoteComponent implements OnChanges {
  @Input() quoteRequestID: number = 0; //Accept quote request ID from parent component
  @Output() resultEvent = new EventEmitter<boolean>(); //used to send boolean back to parent component. true = quote successfully created; false = fail
  
  selectedQR!: QuoteVM;
  selectedQuote!: QuoteVMClass;
  fixedProducts: FixedProductVM[] = [];
  filteredFixedProducts: FixedProductVM[] = [];
  vat!: VAT;
  customer!: Customer;

  //messages to user
  loading = true; //is true when data is successfully retrieved from backend
  error: boolean = false;

  //forms logic
  addQuoteLineForm: FormGroup;
  selectedProductID = 'NA';
  selectedProduct: FixedProductVM | undefined;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {
    this.addQuoteLineForm = this.formBuilder.group({
      productID: [Validators.required],
      quantity: [1, Validators.required],      
      price: [1, Validators.required]
    });
  }

  ngOnInit() {
    $('#generateQuote').modal('show');
    this.getDataFromDB();
  }

  //listen for changes to the quoteRequestID
  async ngOnChanges(changes: SimpleChanges) {
    if (changes['quoteRequestID']) {
      // The quoteRequestID input property has changed; Perform actions based on the change
      console.log('quoteRequestID changed');

      //however, when the modal opens for the first time, the ngOnChanges considers this a change too. That will cause getQuoteRequest to fire twice. We don't want that
      const previousQuoteRequestID = changes['quoteRequestID'].previousValue;
      if (previousQuoteRequestID != 0) { //if it's 0, this modal is opening for the first time
        console.log('previousQuoteRequestID', previousQuoteRequestID);
        this.error = false;
        this.loading = true;
        await this.getQuoteRequest();
      }
    }
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

        this.filterProductDropdown(this.selectedQuote); //remove products already on the quote from the products dropdown
        
        this.loading = false;
      } catch (error) {
        console.error('Error retrieving quote request with ID of ' + this.quoteRequestID, error);
      }
    }
  }

  //----------------------ADD PRODUCT TO QUOTE LOGIC---------------------
  //filter products shown in dropdown to not include products currently in quote; atm, this only accounts for fixed products
  filterProductDropdown(currentQuote: QuoteVMClass) {
    /* reset array. Just saying filteredFP = fP doesn't work because (according to ChatGPT):
    The issue you are facing is likely due to the fact that arrays in JavaScript are reference types. When you do 
    this.filteredFixedProducts = this.fixedProducts, you are not creating a new copy of the fixedProducts array; instead, you are 
    creating a new reference to the same array. As a result, any changes made to this.filteredFixedProducts will also affect 
    this.fixedProducts.
    To fix this behavior and avoid modifying the original fixedProducts array when filtering, you need to create a copy of the 
    fixedProducts array. There are several ways to do this in JavaScript/TypeScript. One common way is to use the 
    spread operator ... to create a shallow copy of the array:
    this.filteredFixedProducts = [...this.fixedProducts]; */

    //for each quote line
    currentQuote.lines.forEach(line => {
      //only remove if it's a fixed product
      if (line.isFixedProduct) {
        //find fixed product with matching ID
        let toDelete = this.filteredFixedProducts.find(prod => line.productID == prod.fixedProductID);

        //if product is found, delete it
        if (toDelete) this.filteredFixedProducts.splice(this.filteredFixedProducts.indexOf(toDelete), 1);
      }
    });
  }

  //changing product using dropdown should change the max value of the qty input field to be whatever is the product's qty on hand
  //this method handles that
  changedProduct() {
    this.selectedProduct = this.fixedProducts.find(fp => fp.fixedProductID == parseInt(this.selectedProductID));

    //display out of stock message for products that are out of stock
  }

  addQuoteLine() {
    const formData = this.addQuoteLineForm.value; //get form data

    if (this.addQuoteLineForm.valid && this.selectedProductID != 'NA' && formData.quantity > 0) {
      //REMOVE FIXED PRODUCT FROM DROPDOWN
      let toDelete = this.filteredFixedProducts.find(prod => this.selectedProduct?.fixedProductID == prod.fixedProductID); //find fixed product with matching ID
      if (toDelete) this.filteredFixedProducts.splice(this.filteredFixedProducts.indexOf(toDelete), 1); //if product is found, delete it

      //add quote line to global selectedQuote so I can easily add to backend; NT you can't add custom product quote this way
      let newQuoteLine: any = {
        lineID: 0,
        isFixedProduct: true,
        productID: this.selectedProduct ? this.selectedProduct.fixedProductID : 0,
        productDescription: this.selectedProduct ? this.selectedProduct.description : '',
        suggestedUnitPrice: this.selectedProduct ? this.selectedProduct.price : 0,
        confirmedUnitPrice: formData.price,
        quantity: formData.quantity
      };

      this.selectedQuote.addNewQuoteLine(newQuoteLine);
      console.log('Quote after adding', this.selectedQuote);

      //reset form
      this.selectedProductID = 'NA'; //reset product dropdown
      this.addQuoteLineForm.get('quantity')?.setValue(1);
      this.addQuoteLineForm.get('price')?.setValue(1);
    }
  }
  
  //-------------------CREATE QUOTE LOGIC-------------------
  generateQuote() {
    //check that no confirmed unit price is 0

    try {
      //put quote data in VM
      let newQuote: QuoteVM = {
        quoteRequestID: this.selectedQuote.quoteRequestID,
        dateRequested: this.selectedQuote.dateRequested,
        quoteID: 0,
        dateGenerated: this.selectedQuote.dateRequested,
        quoteStatusID: 0,
        quoteStatusDescription: '',
        quoteDurationID: 0,
        quoteDuration: 0,
        rejectReasonID: 0,
        rejectReasonDescription: '',
        priceMatchFileB64: '',
        customerId: this.selectedQuote.customerId,
        customerFullName: '',
        lines: []
      };

      //put quote line data in VM
      this.selectedQuote.lines.forEach(line => {
        let newQuoteLine: QuoteLineVM = {
          quoteRequestLineID: 0,
          quoteLineID: 0,
          confirmedUnitPrice: line.confirmedUnitPrice,
          suggestedUnitPrice: 0,
          fixedProductID: line.isFixedProduct ? line.productID : 0,
          fixedProductDescription: '',
          customProductID: !line.isFixedProduct ? line.productID : 0,
          customProductDescription: '',
          quantity: line.quantity
        };

        newQuote.lines.push(newQuoteLine);
      });

      console.log('New quote: ', newQuote);

      this.dataService.AddQuote(newQuote).subscribe(
        (result: any) => {
          console.log('Successfully updated quote! ', result);
          //send result back
          this.resultEvent.emit(true); // Emit the boolean parameter
        }
      );
    }
    catch (error) {
      console.error('Error creating quote', error);
      //send result back
      this.resultEvent.emit(false);
    }
  }
}
