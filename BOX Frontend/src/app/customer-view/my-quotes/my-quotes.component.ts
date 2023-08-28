import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Customer } from '../../shared/customer';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from '../../shared/custom-product-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { Route, Router } from '@angular/router';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;

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
  //searchTerm: string = '';

  //data from DB
  allVATs: VAT[] = [];
  fixedProducts: FixedProductVM[] = [];
  customProducts: CustomProductVM[] = [];
  rejectReasons: {
    rejectReasonID: number,
    description: string
  }[] = [];

  //customer info
  customer!: Customer;
  customerID: string | null = '';

  //reject quote
  showForm = false;
  noFileSelected = true;
  rejectBtnText = 'Request new quote';
  rejectReasonId = 1;
  rejectQuoteForm: FormGroup;

  /*Status list: no need to retrieve this from the backend because it's static:
  1 Generated
  2 Accepted
  3 Rejected
  4 Rejected and will renegotiate
  5 Expired */

  constructor(private dataService: DataService, private router: Router, private authService: AuthService, private formBuilder: FormBuilder) {
    this.rejectQuoteForm = this.formBuilder.group({
      quoteID: [0, Validators.required],
      rejectReasonID: [1, Validators.required],
      priceMatchFileB64: [],
    });
  }

  ngOnInit(): void {
    //get customer data
    const token = localStorage.getItem('access_token')!;
    this.customerID = this.authService.getUserIdFromToken(token);
    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      if (this.customerID) {//turn Observables that retrieve data from DB into promises
        const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
        const getCustomProductsPromise = lastValueFrom(this.dataService.GetAllCustomProducts().pipe(take(1)));
        const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
        const getActiveQuoteRequestPromise = lastValueFrom(this.dataService.CheckForActiveQuoteRequest(this.customerID).pipe(take(1)));
        const getRejectReasonsPromise = lastValueFrom(this.dataService.GetAllRejectReasons().pipe(take(1)));
  
        /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
        That's what the Promise.all method is supposed to be doing.*/
        const [allFixedProducts, allCustomProducts, allVAT, activeQR, allRejectReasons] = await Promise.all([
          getFixedProductsPromise,
          getCustomProductsPromise,
          getVATPromise,
          getActiveQuoteRequestPromise,
          getRejectReasonsPromise
        ]);
  
        //put results from DB in global arrays
        this.fixedProducts = allFixedProducts;
        this.customProducts = allCustomProducts;
        this.allVATs = allVAT;
        if (activeQR != null) this.quoteRequestFromBackend = activeQR;
        this.rejectReasons = allRejectReasons;
  
        await this.getCustomerQuotesPromise();
      }      
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  //separate functionality of getting quotes so I can call it separately whenever an quote is updated
  async getCustomerQuotesPromise() {
    this.loading = true;
    try {
      if (this.customerID) {
        this.customerQuotes = await lastValueFrom(this.dataService.GetQuotesByCustomer(this.customerID).pipe(take(1)));
        
        //sort quotes by quote ID so later quotes are first
        this.customerQuotes.sort((currentQuote, nextQuote) => {
          return nextQuote.quoteID - currentQuote.quoteID;
        });

        this.displayCustomerQuotes(); //Execute only after data has been retrieved from the DB otherwise error
      }
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
        let customProdDescription = '';

        if (isFixedProduct) {
          fixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        }
        else {
          customProduct = this.customProducts.find(prod => prod.customProductID == line.customProductID);
          customProdDescription = customProduct?.label != '' ? ' with printing on ' + customProduct?.sides + ' side(s)' : '';
        }

        let b64 = isFixedProduct ? fixedProduct?.productPhotoB64 : customProduct?.label;

        let quoteLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? fixedProduct?.fixedProductID : customProduct?.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription + customProdDescription,
          productFileB64: b64,
          fileType: this.determineFileType(b64 ? b64 : ''),
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
        let customProdDescription = '';

        if (isFixedProduct) {
          fixedProduct = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        }
        else {
          customProduct = this.customProducts.find(prod => prod.customProductID == line.customProductID);
          customProdDescription = customProduct?.label != '' ? ' with printing on ' + customProduct?.sides + ' side(s)' : '';
        }

        let b64 = isFixedProduct ? fixedProduct?.productPhotoB64 : customProduct?.label;

        let quoteLine: any = {
          lineID: isFixedProduct ? line.fixedProductID : line.customProductID,
          isFixedProduct: isFixedProduct,
          productID: isFixedProduct ? fixedProduct?.fixedProductID : customProduct?.customProductID,
          productDescription: isFixedProduct ? line.fixedProductDescription : line.customProductDescription + customProdDescription,
          productFileB64: b64,
          fileType: this.determineFileType(b64 ? b64 : ''),
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
  /* searchQuotes(event: Event) {
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
  } */

  //--------------------------------------------- ACCEPT ---------------------------------------------- 
  //ACCEPT QUOTE aka BUY NOW
  acceptQuote(quoteId: number) {
    try {
      //statusID 2 = 'Accepted'
      this.dataService.UpdateQuoteStatus(quoteId, 2).subscribe((result) => {
        console.log("Result", result);
        //email customer their invoice

        //Navigate to PLACE ORDER page and send quote ID encoded in URL:
        let gibberish = this.encodeQuoteID(quoteId);
        this.router.navigate(['place-order', gibberish]);
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  //create invoice PDF

  //I want to send quote ID in url to order page but don't want to send the ID as is
  encodeQuoteID(quoteID: number): string {
    let now = new Date(Date.now());
    var gibberish = btoa('customer-' + quoteID + '-places-order-on-' + now.toLocaleDateString());

    return gibberish;
  }

  //--------------------------------------------- REJECT ----------------------------------------------
  openRejectModal(id: number) {
    this.rejectQuoteForm.get("quoteID")?.setValue(id);
    $('#rejectQuote').modal('show');
  }

  changedRejectReason() {
    if (this.rejectReasonId == 1)
      this.rejectBtnText = 'Request new quote';
    else
      this.rejectBtnText = 'Reject quote';
  }

  //function to display image name since I decided to be fancy with a custom input button
  showImageName(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const chosenFile = inputElement.files?.[0];
    let imageName = document.getElementById('imageName') as HTMLSpanElement;

    if (chosenFile) { //if there is a file chosen
      imageName.innerHTML = chosenFile.name; //display file name
      imageName.style.display = 'inline-block';
      this.noFileSelected = false;
    }
    else {
      imageName.style.display = 'none';
      this.noFileSelected = true;
    }
  }

  //convert image to B64
  convertToBase64(img: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        resolve(base64String.substring(base64String.indexOf(',') + 1)); // Resolve the promise with the base64 string; get rid of the data:image/... that auto appends itself to the B64 string
      };
      reader.onerror = (error) => {
        reject(error); // Reject the promise if an error occurs
      };
      reader.readAsDataURL(img);
    });
  }

  async rejectQuote() {
    //get form data
    const formData = this.rejectQuoteForm.get("quoteID")?.value;
    let priceMatchFileB64 = '';
    
    //only get file if they want to renegotiate
    if (this.rejectReasonId == 1) {
      //form data makes the image a string with a fake url which I can't convert to B64 so I must get the actual value of the file input      
      const inputElement = document.getElementById('priceMatchFileB64') as HTMLInputElement;
      const formImage = inputElement.files?.[0];
      priceMatchFileB64 = formImage ? await this.convertToBase64(formImage) : ''; //convert to B64 if there's an image selected, otherwise, empty string
    }

    //put data in qoute VM
    let quoteVM: QuoteVM = {
      quoteID: formData,
      rejectReasonID: this.rejectReasonId,
      priceMatchFileB64: priceMatchFileB64,
      quoteRequestID: 0,
      quoteStatusID: 0,
      quoteStatusDescription: '',
      quoteDurationID: 0,
      quoteDuration: 0,
      rejectReasonDescription: '',
      dateRequested: new Date(),
      dateGenerated: new Date(),
      customerId: '',
      customerFullName: '',
      customerEmail: '',
      lines: []
    }

    //don't let them reject they say they want to renegotiate but didn't upload a file
    if (this.rejectReasonId == 1 && priceMatchFileB64 == '') {
      console.error('Error in form data');
    }
    else {
      try {
        this.dataService.RejectQuote(quoteVM).subscribe((result) => {
          $('#rejectQuote').modal('hide');
          console.log("Result", result);
          this.getCustomerQuotesPromise(); //refresh list
        });
      } catch (error) {
        console.error('Error rejecting quote: ', error);
      }
    }
  }

  //--------------------------------------------- DOWNLOAD CUSTOM PROD FILE ---------------------------------------------
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
}
