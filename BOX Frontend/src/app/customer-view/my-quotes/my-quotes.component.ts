import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { CustomProductVM } from '../../shared/custom-product-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { Route, Router } from '@angular/router';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { take, lastValueFrom } from 'rxjs';
import { Users } from '../../shared/user';
declare var $: any;
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
  customer!: Users;
  customerID: string | null = '';

  //reject quote
  showForm = false;
  noFileSelected = true;
  rejectBtnText = 'Request new quote';
  rejectReasonId = 1;
  rejectQuoteForm: FormGroup;

  //invoice info
  invoice: any = null;

  // Create a new instance of jsPDF
  pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

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
    this.getCustomerData();

    this.getDataFromDB();
  }

  async getCustomerData() {
    const token = localStorage.getItem('access_token')!;
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.customer = await this.authService.getUserByEmail(email);
      console.log(this.customer);
    }
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
  acceptQuote(quote: QuoteVMClass) {
    try {
      //generate invoice
      this.createInvoice(quote);

      //statusID 2 = 'Accepted'
      /* this.dataService.UpdateQuoteStatus(quoteId, 2).subscribe((result) => {
        console.log("Result", result);
        //email customer their invoice

        //Navigate to PLACE ORDER page and send quote ID encoded in URL:
        let gibberish = this.encodeQuoteID(quoteId);
        this.router.navigate(['place-order', gibberish]);
      }); */
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  //create invoice PDF
  async createInvoice(quote: QuoteVMClass) {
    let address = this.customer.address.split(', ');
    let customerName = this.customer.title ? this.customer.title + ' ' + this.customer.firstName + ' ' + this.customer.lastName : this.customer.firstName + ' ' + this.customer.lastName;
    let restOfAddress = '';

    for (let i = 2; i < address.length; i++) {
      restOfAddress += address[i] + ', ';
    }

    let invoiceLines: any[] = [];
    quote.lines.forEach(line => {
      let invoiceL = {
        productDescription: line.productDescription,
        quantity: line.quantity,
        confirmedUnitPrice: line.confirmedUnitPrice,
        total: line.quantity * line.confirmedUnitPrice
      };

      invoiceLines.push(invoiceL);
    });

    this.invoice = {
      date: new Date(Date.now()),
      customer: customerName,
      addressLine1: address[0],
      addressLine2: address[1],
      addressLine3: restOfAddress.substring(0, restOfAddress.length - 2),
      deposit: quote.totalBeforeVAT * 0.2,
      totalExlcudingDeposit: quote.totalBeforeVAT * 0.8,
      totalVAT: quote.totalVAT,
      total: quote.getTotalAfterVAT(),
      lines: invoiceLines
    }

    // Wait 100 millisec to ensure the invoice is rendered and the data displayed before trying to screenshot and all that
    await this.delay(10);

    let invoiceImg = document.getElementById("invoice-img") as HTMLElement;
    let invoiceHdLeft = document.getElementById("header-left") as HTMLElement;
    let invoiceHdRight = document.getElementById("header-right") as HTMLElement;
    let invoiceBod = document.getElementById("invoice-body") as HTMLElement;
    let invoiceFtLeft = document.getElementById("footer-left") as HTMLElement;
    let invoiceFtRight = document.getElementById("footer-right") as HTMLElement;
    let invoiceParts = [];

    invoiceParts.push(invoiceImg, invoiceHdLeft, invoiceHdRight, invoiceBod, invoiceFtLeft, invoiceFtRight);

    // Call the html2canvas function and pass the elements as an argument also use Promise.all to wait for all calls to complete
    const invoiceCanvases = await Promise.all(invoiceParts.map(async (part) => {
      const canvas = await html2canvas(part);
      return canvas; // Return the canvas directly
      // Get the image data as a base64-encoded string
      /* const imageData = canvas.toDataURL("image/png");
 
      // Do something with the image data, such as saving it as a file or sending it to a server
      const link = document.createElement("a");
      link.setAttribute("download", "screenshot.png");
      link.setAttribute("href", imageData);
      link.click(); */
    }));

    console.log(invoiceCanvases);
    this.createPDF(invoiceCanvases, 'Invoice for Quotation #' + quote.quoteID);
  }

  createPDF(canvases: HTMLCanvasElement[], pdfName: string) {
    // dimensions and positions for each part of the PDF
    const fullWidth = this.pdf.internal.pageSize.getWidth();
    const pageWidth = this.pdf.internal.pageSize.getWidth() - 20; //add margin of 20mm
    const halfPageWidth = (fullWidth / 2) - 12.5; //account for 10mm margin and 5mm space between half page blocks
    const margin = 10; //margin between blocks that are half the page
    let yOffset = 10; //used to recalculate starting y position

    // Add the canvases to the PDF
    /* this.addCanvasToPDF(canvases[0], 0, 0, pageWidth); //Add invoiceImg (full width)
    console.log(0)
    this.addCanvasToPDF(canvases[1], margin, fullPageHeight, halfPageWidth - margin); //Add invoiceHdLeft (under, floated left)
    console.log(1)
    this.addCanvasToPDF(canvases[2], halfPageWidth, fullPageHeight, halfPageWidth - margin); // Add invoiceHdRight (floated right)
    console.log(2)
    this.addCanvasToPDF(canvases[3], 0, 2 * fullPageHeight, pageWidth); // Add invoiceBod (full width)
    console.log(3)
    this.addCanvasToPDF(canvases[4], margin, 3 * fullPageHeight, halfPageWidth - margin); // Add invoiceFtLeft (underneath, floated left)
    console.log(4)
    this.addCanvasToPDF(canvases[5], halfPageWidth, 3 * fullPageHeight, halfPageWidth - margin); // Add invoiceFtRight (floated right)
    console.log(5) */

    // Add the canvases to the PDF
    canvases.forEach((canvas, index) => {
      let x = 10; //give 10mm margin between left paper edge and doc content
      let y = yOffset; //give 10mm margin between top paper edge and doc content
      let width = halfPageWidth;

      // Adjust x and y coordinates for each canvas as needed
      if (index === 0) {
        width = pageWidth;
      }
      else if (index === 1) {
        //x = margin;
        //y = fullPageHeight;
      } else if (index === 2) {
        x = fullWidth - width - margin; //calculate x from the right margin not the left
        //y = fullPageHeight;
      } else if (index === 3) {
        //y = fullPageHeight / 2;
        width = pageWidth;
      } else if (index === 4) {
        //x = margin;
        //y = fullPageHeight / 3;
      } else if (index === 5) {
        x = fullWidth - halfPageWidth - margin; //calculate x from the right margin not the left
        //y = fullPageHeight / 3;
      }

      // Calculate the height based on the aspect ratio
      const aspectRatio = canvas.height / canvas.width;
      const height = width * aspectRatio;

      console.log(index, x, y, width, height);
      this.addCanvasToPDF(canvas, x, y, width, height, index);

      // Update the yOffset for the next canvas; unless it's a half block that should have the same y position as the previous half block
      if (index === 0 || index === 2 || index === 3) yOffset = y + height + margin;
    });

    //Save the combined PDF
    this.pdf.save(pdfName + '.pdf');
  }

  // Function to add a canvas to the PDF with specified position and dimensions
  addCanvasToPDF(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, i: number) {
    const imageData = canvas.toDataURL("image/png");
    this.pdf.addImage(imageData, 'PNG', x, y, width, height, 'alias' + i, 'FAST');
  }

  //delay action by a number of milliseconds using promise
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
    //create button to remove an uploaded pic
    let removeBtn: HTMLButtonElement = document.createElement('button');
    removeBtn.classList.add('remove-pic');
    removeBtn.setAttribute('title', 'Remove file')
    removeBtn.innerHTML = 'Remove';
    removeBtn.addEventListener('click', this.removeFile.bind(this));

    if (chosenFile) { //if there is a file chosen
      imageName.innerHTML = chosenFile.name; //display file name
      imageName.style.display = 'inline-block';
      imageName.appendChild(removeBtn);
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

  removeFile() {
    //get file input and name span from reject quote form modal
    let fileName: HTMLSpanElement = document.getElementById('imageName') as HTMLSpanElement;
    let fileInput: HTMLInputElement = document.getElementById('priceMatchFileB64') as HTMLInputElement;

    //remove file from file input
    fileInput.value = '';
    fileName.innerHTML = '';
    this.noFileSelected = true;
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
    if (this.rejectReasonId == 1 && this.noFileSelected) {
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

    if (fileType != 'undefined') {
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
