import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../services/data.services';
import { AuthService } from '../../services/auth.service';
import { EmailService } from '../../services/email.service';
import { OrderService } from 'src/app/services/orders';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../../shared/order-vm';
import { OrderLineVM } from '../../shared/order-line-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { VAT } from '../../shared/vat';
import { EmailAttachmentVM } from '../../shared/email-attachment-vm';
import { AllCustomerDetailsVM } from '../../shared/all-customer-details-vm';
import { Users } from '../../shared/user';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
declare var $: any;

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent {
  //tabs
  tab = 1;

  //handle credit customers
  creditAllowed = true;
  creditBalanceDate: Date = new Date(Date.now());
  creditBalanceDue: Date = new Date();

  //customer
  customer!: AllCustomerDetailsVM;

  //quote and order
  currentVAT!: VAT;
  quoteID = 0;
  quote!: QuoteVMClass;

  //forms logic
  placeOrderForm: FormGroup;
  orderBtnText = 'Order >';

  paymentResult: any;
  submitted = false;

  //invoice info
  invoice: any = null;

  // Create a new instance of jsPDF
  pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  /*Payment types list as in database
  1	Pay immediately
  2	Cash on delivery / collection
  3	Credit */

  /* Delivery types as in database
  1	Delivery
  2	Pick up */

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private authService: AuthService, private emailService: EmailService,
    private orderService: OrderService) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['Pick up', Validators.required],
      shippingAddress: ['', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
    });
  }

  ngOnInit() {
    //Retrieve the quote ID that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //get parameters from url
      let id = params.get('quoteID');
      if (id) this.quoteID = this.decodeQuoteID(id);

      this.getDataFromDB();

      let tabNo = params.get('tab');
      let response = params.get('result');
      if (tabNo && parseInt(tabNo) == 4) { //if this is tab 4 then the payment has succeeded/failed
        this.tab = 3;

        //determine whether it was a success or failure
        if (response) {
          this.orderService.checkPaymentResult(response).subscribe((result: any) => {

            this.paymentResult = result;
            console.log('paymentResult', this.paymentResult);

            //resulted in payment object with an ID
            if (this.paymentResult.paymentID > 0) { //payment succeeded
              console.log('Got this far');
              this.tab = 4;
              Swal.fire({
                icon: 'success',
                title: "Success",
                html: "Your payment has been successfully processed",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#32AF99'
              }).then((result) => {
                this.placeOrder(this.paymentResult);
              });
            }
            else { //payment failed
              Swal.fire({
                icon: 'error',
                title: "Oh no",
                html: "Your payment has not been processed.",
                timer: 3000,
                timerProgressBar: true,
                confirmButtonColor: '#32AF99'
              }).then((result) => {
              });
            }
          });
        }
      }
    });

    this.getCreditDueDate();
  }

  async getCustomerData() {
    this.customer = await this.authService.getCustomer();
    console.log('customer', this.customer);
    if (this.customer) {
      //set shipping address
      this.shippingAddress?.setValue(this.customer.address);
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
      
      //get customer
      await this.getCustomerData();

      this.checkIfAllowedToOrder(quote);

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
  checkIfAllowedToOrder(quote: QuoteVM): boolean {
    if (quote.quoteStatusID != 1 || this.customer.userId != quote.customerId) { //doesn't have status of generated or not right customer
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
    else if (!this.customer.emailConfirmed) {
      //error message
      Swal.fire({
        icon: 'error',
        title: "Oh no",
        html: "You have not confirmed your email. We emailed you a link when you registered so check your mailbox or spam. Once you confirm your email, you can place an order.",
        timer: 8000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        this.cancel();
      });
    }
    else {
      return true;
    }

    return false;
  }

  //check if user is approved for credit and sufficient credit left to place this order
  checkCredit(): boolean {
    if (this.customer.creditLimit > 0) { //check if they're approved for credit
      //check for sufficient credit balance
      let creditBalance = this.customer.creditBalance;
      if (this.quote.getTotalAfterVAT() > creditBalance) return false;

      return true;
    }
    return false;    
  }

  getCreditDueDate() {
    let dueDate = this.creditBalanceDate.setDate(this.creditBalanceDate.getDate() + 30);
    this.creditBalanceDate = new Date(dueDate);
  }

  //go to previous/next tab
  changeTab(direction: string) {
    if (direction == 'next') this.tab++;
    else this.tab--;

    if (this.tab == 0) this.tab = 1;
    window.history.pushState("stateObj", "new page", location.href.substring(0, location.href.length - 1) + this.tab);

    if (this.paymentType?.value == 'Credit') this.orderBtnText = 'Order >';
    else this.orderBtnText = 'Pay with PayFast';
  }

  //cancel placing of order (not the same as cancel order UC; this is an alt step in place order)
  cancel() {
    //Navigate to 'My quotes' page
    this.router.navigate(['my-quotes']);
  }

  //---------------------------------------- PLACE ORDER ----------------------------------------
  async initiateOrder() {
    this.submitted = true;
    let amount = 0;
    let deliveryTypeId = -1;
    let paymentTypeId = -1;

    try {
      //update customer's address
      if (this.shippingAddress?.value != this.customer.address) {
        this.customer.address = this.shippingAddress?.value;
        let user: Users = {
          id: this.customer.userId,
          firstName: this.customer.firstName,
          lastName: this.customer.lastName,
          address: this.customer.address,
          email: this.customer.email,
          title: "",
          phoneNumber: this.customer.phoneNumber
        };

        this.dataService.UpdateUser(this.customer.email, user);
      }
    } catch (error) {
      //error message
      Swal.fire({
        icon: 'error',
        title: "Oh no",
        html: "Something went wrong and we could not update your shipping address. Try updating it from your profile page.",
        timer: 8000,
        timerProgressBar: true,
        confirmButtonColor: '#32AF99'
      }).then((result) => {
      });
    }

    try {
      //get payment type ID
      switch (this.paymentType?.value) {
        case "Pay immediately":
          amount = this.quote.getTotalAfterVAT();
          paymentTypeId = 1;
          break;

        case "Cash on delivery":
          amount = this.quote.totalBeforeVAT * 0.2;
          paymentTypeId = 2;
          break;

        case "Credit":
          amount = this.quote.getTotalAfterVAT();
          paymentTypeId = 3;
          break;

        default:
          throw 'Invalid payment type chosen';
      }

      //payfast won't allow payments below R20 so the minimum we allow is R30
      if (amount < 30) throw 'Below minimum amount';

      //get delivery type ID
      switch (this.deliveryType?.value) {
        case "Delivery":
          deliveryTypeId = 1;
          break;

        case "Pick up":
          deliveryTypeId = 2;
          break;

        default:
          throw 'Invalid delivery type chosen';
      }

      let orderDetails = {
        customerID: this.customer.userId,
        customerEmail: this.customer.email,
        customerPhoneNo: this.customer.phoneNumber,
        quoteID: this.quoteID,
        amount: amount,
        paymentTypeID: paymentTypeId,
        deliveryTypeID: deliveryTypeId,
        creditBalance: this.customer.creditBalance
      }

      //return payment request VM object to post to payfast
      this.orderService.initiatePlaceOrder(orderDetails).subscribe((payfastRequest: any) => {
        if (payfastRequest === null) {
          throw 'Error initiating order';
        }
        else if (paymentTypeId == 3 && typeof payfastRequest == 'number') { //credit purchase returns new credit balance
          let payment = {
            paymentTypeId: paymentTypeId,
            paymentID: 0
          }

          Swal.fire({
            icon: 'success',
            title: "Success",
            html: "Your credit balance was successfully updated.",
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((result) => {
            this.placeOrder(payment);
          });
        }
        else { //result is payfast request
          // Create and submit the payment form 
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://sandbox.payfast.co.za/eng/process'; //change this URL for live payments
          form.target = '_self';

          for (const key in payfastRequest) {
            if (payfastRequest.hasOwnProperty(key)) {
              const hiddenField = document.createElement('input');
              hiddenField.type = 'hidden';
              hiddenField.name = key;
              hiddenField.value = payfastRequest[key];
              form.appendChild(hiddenField);
            }
          }
          document.body.appendChild(form);
          form.submit();
          this.submitted = false;
        }
      });
    } catch (error) {
      if (error == 'Below minimum amount') {
        Swal.fire({
          icon: 'error',
          title: "Amount too small",
          html: "The minimum amount for cash on delivery or collection / immediate payment is R30. Please choose a different payment type",
          timer: 8000,
          timerProgressBar: true,
          confirmButtonColor: '#32AF99'
        }).then((result) => {
          console.log(result);
        });
      }
      else {
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
      }

      console.error('Error submitting order: ', error);
      this.submitted = false;
    }
  }  

  async placeOrder(payment: any) {
    //display loading message
    document.body.classList.add('no-scroll');
    $('#processing').modal('show');

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
      customerId: this.customer.userId,
      customerFullName: '',
      paymentID: payment.paymentID,
      paymentTypeID: payment.paymentTypeID,
      paymentType: '',
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
        customerReturnID: 0,
        orderLineStatusID: 0,
        orderLineStatusDescription: ''
      }

      newOrder.orderLines.push(ol);
    });

    console.log('Order before posting', newOrder);

    try {
      //update quote status
      //statusID 2 = 'Accepted'
      this.dataService.UpdateQuoteStatus(this.quoteID, 2).subscribe((result) => {
        console.log("Result", result);

        //create new order in DB
        this.dataService.AddCustomerOrder(newOrder).subscribe(async (result) => {
          //Send invoice via email
          await this.createInvoice(this.quote, newOrder.paymentTypeID, result.customerOrderID);
          $('#processing').modal('hide');
          document.body.classList.remove('no-scroll');

          //success message
          Swal.fire({
            icon: 'success',
            title: "Order placed successfully!",
            html: "Thank you for doing business with us.",
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((result) => {
            console.log(result);
          });

          this.router.navigate(['/order-history']); //redirect to order history page
        });
      });
    }
    catch (error) {
      //error message
      Swal.fire({
        icon: 'error',
        title: "Oops...",
        html: "Payment was successful but something went wrong with processing this order. Please contact Mega Pack support.",
        confirmButtonColor: '#32AF99'
      }).then((result) => {
        this.router.navigate(['/order-history']); //redirect to order history page
      });
      console.error('Error in updating status, placing order or sending email', error);
    }
  }

  //------------------------- SEND INVOICE VIA EMAIL -------------------------
  //create invoice PDF
  async createInvoice(quote: QuoteVMClass, paymentTypeId: number, orderNo: number) {
    let address = this.customer.address.split(', ');
    let restOfAddress = '';
    let paymentTypes = ['Pay immediately', 'Cash on delivery / collection', 'Credit'];

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
      customer: this.customer.fullName,
      addressLine1: address[0],
      addressLine2: address[1],
      addressLine3: restOfAddress.substring(0, restOfAddress.length - 2),
      deposit: quote.totalBeforeVAT * 0.2,
      totalExlcudingDeposit: quote.totalBeforeVAT * 0.8,
      totalVAT: quote.totalVAT,
      total: quote.getTotalAfterVAT(),
      paymentType: paymentTypes[paymentTypeId - 1],
      number: orderNo,
      lines: invoiceLines
    }

    console.log('invoice', this.invoice);

    // Wait 1000 millisec to ensure the invoice is rendered and the data displayed before trying to screenshot and all that
    await this.delay(1000);

    let invoiceImg = document.getElementById("invoice-img") as HTMLImageElement;
    //add mega pack header to the pdf manually cos trying to html2canvas it is giving errors
    this.pdf.addImage(invoiceImg, 'JPG', 10, 10, 190, 62.301845, 'aliasIMG', 'FAST');

    //get other parts of invoice for html2canvas
    let invoiceHdLeft = document.getElementById("header-left") as HTMLElement;
    let invoiceHdRight = document.getElementById("header-right") as HTMLElement;
    let invoiceFtLeft = document.getElementById("footer-left") as HTMLElement;
    let invoiceFtRight = document.getElementById("footer-right") as HTMLElement;
    let invoiceParts: HTMLElement[] = [];

    invoiceParts.push(invoiceHdLeft, invoiceHdRight, invoiceFtLeft, invoiceFtRight);

    // Call the html2canvas function and pass the elements as an argument also use Promise.all to wait for all calls to complete
    const invoiceCanvases = await Promise.all(invoiceParts.map(async (part) => {
      const canvas = await html2canvas(part);
      document.body.appendChild(canvas);
      return canvas; // Return the canvas directly
    }));

    console.log(invoiceCanvases);
    this.createPDF(invoiceCanvases, orderNo);
  }

  createPDF(canvases: HTMLCanvasElement[], orderNo: number) {
    // dimensions and positions for each part of the PDF
    const fullWidth = this.pdf.internal.pageSize.getWidth();
    const halfPageWidth = (fullWidth / 2) - 11.5; //account for 20mm margin and 3mm space between half page blocks. Therefore, 10 + 1.5
    const margin = 10; //margin of the page
    let yOffset = 20 + 62.301845; //used to recalculate starting y position
    let ratio = 0;
    //calculate ratio to determine height
    if (canvases[0].height > canvases[1].height ) ratio = canvases[0].height / canvases[0].width;
    else { ratio = canvases[1].height / canvases[1].width; }

    this.addCanvasToPDF(canvases[0], 10, 82.301845, halfPageWidth, halfPageWidth * ratio, 0);
    console.log(`index: 0; x: 10; y: 82.301845; width: ${halfPageWidth} height: ${halfPageWidth * ratio}`);
    this.addCanvasToPDF(canvases[1], fullWidth - halfPageWidth - margin, 82.301845, halfPageWidth, halfPageWidth * ratio, 1);
    console.log(`index: 1; x: ${fullWidth - halfPageWidth - margin}; y: 82.301845; width: ${halfPageWidth} height: ${halfPageWidth * ratio}`);
    yOffset += (halfPageWidth * ratio) + margin; //adjust y offset

    //add table
    const headings = [["Description", "Quantity", "Unit price", "Total"]];
    const rows: string[][] = []
    this.invoice.lines.forEach(line => {
      rows.push([line.productDescription, line.quantity, line.confirmedUnitPrice, line.total]);
    });

    (this.pdf as any).autoTable({
      startY: yOffset,
      startX: 10,
      theme: 'plain',      
      head: headings,
      body: rows,
      didDrawPage: (d) => yOffset = d.cursor.y,
    });

    //adjust ratio
    if (canvases[2].height > canvases[3].height ) ratio = canvases[2].height / canvases[2].width;
    else { ratio = canvases[3].height / canvases[3].width; }

    this.addCanvasToPDF(canvases[2], 10, yOffset + margin, halfPageWidth, halfPageWidth * ratio, 2);
    console.log(`index: 2; x: 10; y: ${yOffset + margin}; width: ${halfPageWidth} height: ${halfPageWidth * ratio}`);
    this.addCanvasToPDF(canvases[3], fullWidth - halfPageWidth - margin, yOffset + margin, halfPageWidth, halfPageWidth * ratio, 3);
    console.log(`index: 3; x: ${fullWidth - halfPageWidth - margin}; y: ${yOffset + margin}; width: ${halfPageWidth} height: ${halfPageWidth * ratio}`);
    yOffset += (halfPageWidth * ratio) + (margin * 2);


    // Add the canvases to the PDF
    // canvases.forEach((canvas, index) => {
    //   let x = 10; //give 10mm margin between left paper edge and doc content
    //   let y = yOffset; //give 10mm margin between top paper edge and doc content
    //   let width = halfPageWidth;
    //   let height = pageHeight / 8; //calculate height

    //   // Adjust x coordinates for each canvas as needed
    //   if (index === 1) {
    //     x = fullWidth - width - margin; //calculate x from the right margin not the left
    //   } else if (index === 2) {
    //     height = 8 + (this.invoice.lines.length * 8); //for each invoice line, add 8mm. And add 8mm at the start for the table headings
    //     width = pageWidth;
    //   } else if (index === 3) {
    //     height = pageHeight / 10;
    //   } else if (index === 4) {
    //     height = pageHeight / 10;
    //     x = fullWidth - width - margin; //calculate x from the right margin not the left
    //   }

    //   console.log(index, x, y, width, height);
    //   this.addCanvasToPDF(canvas, x, y, width, height, index);

    //   // Update the yOffset for the next canvas; unless it's a half block that should have the same y position as the previous half block
    //   if (index === 1 || index === 2 || index === 4) yOffset = y + height + margin;
    // });

    //add disclaimer text to pdf
    this.pdf.setFontSize(9); // Set the font size to be less than normal
    // Add the text
    this.pdf.text('*Note that every order contains a deposit of 20% and without this down payment, your order cannot be processed.', 10, yOffset);

    //send email
    let emailBody = `<p>We are delighted that you found something you like.
                     Please see attached your invoice for Order #${orderNo}. 
                     Thank you for shopping with us. We really appreciate your business! </p>
                     <p>Please don't hesitate to reach out if you have any questions.</p>`;

    let pdfData = this.pdf.output("datauristring");
    var base64String = pdfData.split(',')[1];

    let attachment: EmailAttachmentVM = {
    fileName: 'Invoice #' + orderNo + '.pdf',
    fileBase64: base64String
    }

    this.emailService.sendEmail(this.customer.email, 'Thanks for your order!', this.invoice.customer, emailBody, [attachment]);
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

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
  get shippingAddress() { return this.placeOrderForm.get('shippingAddress'); }
}
