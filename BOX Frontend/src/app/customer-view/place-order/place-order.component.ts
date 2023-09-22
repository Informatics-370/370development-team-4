import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.services';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../../shared/order-vm';
import { OrderLineVM } from '../../shared/order-line-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { VAT } from '../../shared/vat';
import { EmailAttachmentVM } from '../../shared/email-attachment-vm';
import Swal from 'sweetalert2';
import { Users } from '../../shared/user';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Md5 } from 'ts-md5';
import { UntypedFormBuilder } from '@angular/forms'
import { environment } from 'src/environments/environment';
declare function payfast_do_onsite_payment(param1 : any, callback: any): any;
declare var $: any;

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  //tabs
  tab = 1;
  progress = 0;

  //handle credit customers
  creditAllowed = true;
  creditBalanceDate: Date = new Date(Date.now());
  creditBalanceDue: Date = new Date();

  //customer
  customerID = '';
  customer!: Users;

  //quote and order
  currentVAT!: VAT;
  quoteID = 0;
  quote!: QuoteVMClass;
  placedOrder!: OrderVM;

  //forms logic
  placeOrderForm: FormGroup;

  orderBtnText = 'Order >';

  //invoice info
  invoice: any = null;

  // Create a new instance of jsPDF
  pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private httpComms: HttpClient,
    private activatedRoute: ActivatedRoute, private authService: AuthService, private emailService: EmailService,
    private buildForm: UntypedFormBuilder) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['Pick up', Validators.required],
      shippingAddress: ['123 Fake Road, Pretoria North', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
    });
    console.log('production ' + environment.production);
  }

  ngOnInit() {
    //Retrieve the quote ID that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //product with id 2 and description 'product description' will come as '2-product-description' so split it into array that is ['2', 'product-description']
      let id = params.get('quoteID');
      if (id) this.quoteID = this.decodeQuoteID(id);
    });

    //get customer ID
    const token = localStorage.getItem('access_token')!;
    let id = this.authService.getUserIdFromToken(token);
    if (id) this.customerID = id;
    this.getCustomerData();

    this.getDataFromDB();
    this.getCreditDueDate();
  }

  async getCustomerData() {
    const token = localStorage.getItem('access_token')!;
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.customer = await this.authService.getUserByEmail(email);
    }
  }

  //decode quote ID from url
  decodeQuoteID(gibberish: string): number {
    var sensible = atob(gibberish);
    let sensibleArr = sensible.split('-');
    return parseInt(sensibleArr[1]);
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetVAT().pipe(take(1)));
      const getQuotePromise = lastValueFrom(this.dataService.GetQuote(this.quoteID).pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling next method
      That's what the Promise.all method is supposed to be doing.*/
      const [currentVAT, quote] = await Promise.all([
        getVATPromise,
        getQuotePromise
      ]);

      //put results from DB in global attributes
      this.currentVAT = currentVAT;
      console.log('Applicable VAT', this.currentVAT);

      this.checkForCheating(quote);

      //put quote in class
      let quoteLines: any[] = [];
      quote.lines.forEach(line => {
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

      this.quote = new QuoteVMClass(quote, quoteLines, this.currentVAT);
      console.log('Quote to order from: ', this.quote);
      //check if customer can buy on credit
      this.creditAllowed = this.checkCredit();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  /*checks if:
 - quote is accepted. If it is then the customer is trying to order from a quote they've already ordered from before
 - quote belongs to the customer currently logged in. If not, then the customer is trying to order off someone else's quote
  */
  checkForCheating(quote: QuoteVM): boolean {
    if (quote.quoteStatusID != 1 || this.customer.id != quote.customerId) { //doesn't have status of generated or not right customer
      //error message
      Swal.fire({
        icon: 'error',
        title: "Oops...",
        html: "Something went wrong and, for security reasons, we cannot allow you to place this order. Please try again in a few minutes. If the problem persists, contact Mega Pack support.",
        timer: 8000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        this.cancel();
      });
    }
    else {
      console.log('Right user with ID: ' + this.customer.id);
      return true;
    }

    return false;
  }

  //check if user is approved for credit and sufficient credit left to place this order
  checkCredit(): boolean {
    //check if user is approved for credit

    //check for sufficient credit balance
    let creditBalance = 2000000;
    if (this.quote.getTotalAfterVAT() > creditBalance) return false;

    return true;
  }

  getCreditDueDate() {
    let dueDate = this.creditBalanceDate.setDate(this.creditBalanceDate.getDate() + 30);
    this.creditBalanceDate = new Date(dueDate);
  }

  //go to previous/next tab
  changeTab(direction: string) {
    if (direction == 'next') this.tab++;
    else this.tab--;


    switch (this.tab) {
      case 0 || 1:
        this.tab = 1;
        this.progress = 0;
        break;

      case 2:
        this.progress = 33;
        break;

      case 3 || 4:
        this.progress = 66;
        break;

      /* case 4 || 5:
        this.tab = 4;
        this.progress = 100;
        break; */

      default:
        this.tab = 1;
        this.progress = 0;
        break;
    }

    if (this.paymentType?.value == 'Credit') this.orderBtnText = 'Order >';
    else this.orderBtnText = 'Make payment >';

    //update progress bar
    $('#bar').css('width', this.progress + '%');
  }

  //cancel placing of order (not the same as cancel order UC; this is an alt step in place order)
  cancel() {
    //Navigate to 'My quotes' page
    this.router.navigate(['my-quotes']);
    /* try {
      //statusID 1 = 'Generated'
      this.dataService.UpdateQuoteStatus(this.quoteID, 1).subscribe((result) => {
        console.log("Result", result);
        //email customer to ignore previous invoice email
        let customerName = this.customer.title ? this.customer.title + ' ' + this.customer.firstName + ' ' + this.customer.lastName : this.customer.firstName + ' ' + this.customer.lastName;
        let emailBody = `<p>We hope you're well. Please ignore the previous email which contained your Invoice for Quotation #
                            ${this.quoteID}. Since you cancelled the order before you could finish paying the deposit, that invoice is no longer valid.</p>
                            <p>If you cancelled by mistake, just accept the quote again to restart the process.</p>`;

        this.emailService.sendEmail(this.customer.email, 'Order not placed', customerName, emailBody);

        //Navigate to 'My quotes' page
        this.router.navigate(['my-quotes']);
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    } */
  }

  //---------------------------------------- PLACE ORDER ----------------------------------------
  async choosePaymentMethod() {
    let amount = 0;
    //decrease credit balance for credit customers
    if (this.paymentType?.value == "Credit") {

      let successMessage = "Your credit balance has been updated!";
      this.placeOrder(successMessage)
    }
    else if (this.paymentType?.value == "Cash on delivery") {
      amount = this.quote.totalBeforeVAT * 0.2;
      console.log(amount);
      await this.doOnSitePayment(amount);
    }
    else if (this.paymentType?.value == "Pay immediately") {
      amount = this.quote.getTotalAfterVAT();
      console.log(amount);
      await this.doOnSitePayment(amount);
    }
  }

  async placeOrder(successMessage: string) {
    //update user address with shipping address

    //create order vm for order
    let newOrder: OrderVM = {
      customerOrderID: 0,
      quoteID: this.quoteID,
      orderStatusID: 0,
      orderStatusDescription: '',
      date: new Date(),
      deliveryScheduleID: 0,
      deliveryDate: new Date(),
      deliveryTypeID: 1,
      deliveryType: this.deliveryType?.value,
      deliveryPhoto: '',
      customerId: this.customerID,
      customerFullName: '',
      orderLines: []
    };

    //create order lines for each cart item
    this.quote.lines.forEach(line => {
      let ol: OrderLineVM = {
        customerOrderLineID: 0,
        customerOrderID: 0,
        fixedProductID: line.isFixedProduct ? line.productID : 0,
        fixedProductDescription: '',
        customProductID: !line.isFixedProduct ? line.productID : 0,
        customProductDescription: '',
        confirmedUnitPrice: line.confirmedUnitPrice,
        quantity: line.quantity,
        customerReturnID: 0
      }

      newOrder.orderLines.push(ol);
    });

    console.log('Order before posting', newOrder);

    try {
      //post to backend
      this.dataService.AddCustomerOrder(newOrder).subscribe(async (result) => {
        //Send invoice via email
        await this.createInvoice(this.quote);

        //success message
        Swal.fire({
          icon: 'success',
          title: "Order placed successfully!",
          html: successMessage,
          timer: 3000,
          timerProgressBar: true,
          confirmButtonColor: '#32AF99'
        }).then((result) => {
          console.log(result);
        });

        this.placedOrder = result;
        this.router.navigate(['/order-history']); //redirect to order history page        
      });
    } catch (error) {
      //error message
      Swal.fire({
        icon: 'error',
        title: "Oops...",
        html: "Something went wrong and we could not process your order.",
        timer: 3000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        console.log(result);
      });

      console.error('Error submitting order: ', error);
    }
  }

  //Make payment methods from PayFast
  getSignature(data: Map<string, string>): string {
    let tmp = new URLSearchParams();
    data.forEach((v, k) => {
      tmp.append(k, v)
    });
    let queryString = tmp.toString();
    let sig = Md5.hashStr(queryString);
    return sig;
  }

  async doOnSitePayment(amount: number) {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030872")
    onSiteUserData.set("merchant_key", "ommqhfbzaejj8")

    //onSiteUserData.set('return_url', window.location.origin + '/success')
    //onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", this.customer.email);
    
    onSiteUserData.set("amount", amount.toString());
    onSiteUserData.set("item_name", '#' + this.quoteID);

    onSiteUserData.set('passphrase', 'MegapackByBox');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);

    let formData = new FormData();
    onSiteUserData.forEach((val, key) => {
      formData.append(key, val);
    }); 
    
    let response = await fetch(environment.payfastOnsiteEndpoint, {
      method: 'POST',
      body: formData,
      redirect: 'follow',
      //mode: 'no-cors'
    });
    
    console.log('response', response)
    let respJson = await response.json();
    console.log('respJson', respJson)
    let uuid = respJson['uuid'];
    console.log('uuid', uuid)
    payfast_do_onsite_payment({'uuid': uuid},  (res: any) => {
      console.log('got a response', res)
      if (res == true) {
        console.log('successful payment')
      }
      else {
        console.log('failed payment')
      }
    });
  }

  //------------------------- SEND INVOICE VIA EMAIL -------------------------
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

    let invoiceImg = document.getElementById("invoice-img") as HTMLImageElement;
    //add mega pack header to the pdf manually cos trying to html2canvas it is giving errors
    this.pdf.addImage(invoiceImg, 'JPG', 10, 10, 190, 62.301845, 'aliasIMG', 'FAST');

    //get other parts of invoice for html2canvas
    let invoiceHdLeft = document.getElementById("header-left") as HTMLElement;
    let invoiceHdRight = document.getElementById("header-right") as HTMLElement;
    let invoiceBod = document.getElementById("invoice-body") as HTMLElement;
    let invoiceFtLeft = document.getElementById("footer-left") as HTMLElement;
    let invoiceFtRight = document.getElementById("footer-right") as HTMLElement;
    //let disclaimer = document.getElementById("disclaimer") as HTMLElement;
    let invoiceParts: HTMLElement[] = [];

    invoiceParts.push(invoiceHdLeft, invoiceHdRight, invoiceBod, invoiceFtLeft, invoiceFtRight);

    // Call the html2canvas function and pass the elements as an argument also use Promise.all to wait for all calls to complete
    const invoiceCanvases = await Promise.all(invoiceParts.map(async (part) => {
      const canvas = await html2canvas(part);
      return canvas; // Return the canvas directly
    }));

    console.log(invoiceCanvases);
    this.createPDF(invoiceCanvases, quote.quoteID);
  }

  createPDF(canvases: HTMLCanvasElement[], quoteNo: number) {
    // dimensions and positions for each part of the PDF
    const fullWidth = this.pdf.internal.pageSize.getWidth();
    const pageHeight = this.pdf.internal.pageSize.getHeight() - 20;
    const pageWidth = this.pdf.internal.pageSize.getWidth() - 20; //add margin of 20mm
    const halfPageWidth = (fullWidth / 2) - 11.5; //account for 20mm margin and 3mm space between half page blocks. Therefore, 10 + 1.5
    const margin = 10; //margin of the page
    let yOffset = 20 + 62.301845; //used to recalculate starting y position
    
    // Add the canvases to the PDF
    canvases.forEach((canvas, index) => {
      let x = 10; //give 10mm margin between left paper edge and doc content
      let y = yOffset; //give 10mm margin between top paper edge and doc content
      let width = halfPageWidth;
      let height = pageHeight / 8; //calculate height

      // Adjust x coordinates for each canvas as needed
      if (index === 1) {
        x = fullWidth - width - margin; //calculate x from the right margin not the left
      } else if (index === 2) {
        height = 8 + (this.invoice.lines.length * 8); //for each invoice line, add 8mm. And add 8mm at the start for the table headings
        width = pageWidth;
      } else if (index === 3) {
        height = pageHeight / 10;
      } else if (index === 4) {
        height = pageHeight / 10;
        x = fullWidth - width - margin; //calculate x from the right margin not the left
      }
      
      /* if (index === 0) {
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
      }
      else if (index == 6) {
        width = pageWidth * 0.8;
      } */

      console.log(index, x, y, width, height);
      this.addCanvasToPDF(canvas, x, y, width, height, index);

      // Update the yOffset for the next canvas; unless it's a half block that should have the same y position as the previous half block
      if (index === 1 || index === 2|| index === 4) yOffset = y + height + margin;
    });

    //add disclaimer text to pdf
    this.pdf.setFontSize(9); // Set the font size to be less than normal
    // Add the text
    this.pdf.text('*Note that every order contains a deposit of 20% and without this down payment, your order cannot be processed.', 10, yOffset);

    document.body.style.overflowY = 'scroll';

    //send email
    let emailBody = `<p>We hope you're well. Please see attached your invoice for Quote ${quoteNo}. 
                      Thank you for shopping with us. We really appreciate your business! </p>
                    <p>Please don't hesitate to reach out if you have any questions.</p>`;

    let pdfData = this.pdf.output("datauristring");
    var base64String = pdfData.split(',')[1];
    
    let attachment: EmailAttachmentVM = {
      fileName: 'Invoice for Quotation #' + quoteNo + '.pdf',
      fileBase64: base64String
    }

    this.emailService.sendEmail(this.customer.email, 'Invoice', this.invoice.customer, emailBody, [attachment]);

    //Save the combined PDF
    //this.pdf.save(pdfName + '.pdf');
  }

  // Function to add a canvas to the PDF with specified position and dimensions
  addCanvasToPDF(canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number, i: number) {
    const imageData = canvas.toDataURL("image/png");
    //console.log(i, imageData);
    this.pdf.addImage(imageData, 'PNG', x, y, width, height, 'alias' + i, 'FAST');
  }

  //delay action by a number of milliseconds using promise
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
