import { Component, HostListener, OnDestroy } from '@angular/core';
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
import Swal from 'sweetalert2';
import { Users } from '../../shared/user';
import { Md5 } from 'ts-md5';
import { UntypedFormBuilder } from '@angular/forms'
import { environment } from 'src/environments/environment';
declare function payfast_do_onsite_payment(param1: any, callback: any): any;
declare var $: any;

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css']
})
export class PlaceOrderComponent implements OnDestroy {
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
  isOrderPlaced = false;

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private httpComms: HttpClient,
    private activatedRoute: ActivatedRoute, private authService: AuthService, private emailService: EmailService,
    private buildForm: UntypedFormBuilder) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['Pick up', Validators.required],
      shippingAddress: ['123 Fake Road, Pretoria North', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
    });
    console.log(environment.production);
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

  // Add ngOnDestroy method to handle component destruction.
  ngOnDestroy() {
    // Place your cleanup or trigger function here.
    if (!this.isOrderPlaced) this.onPageCloseOrNavigation(null);
  }

  @HostListener('window:beforeunload', ['$event'])
  onPageCloseOrNavigation($event: any): void {
    // This function will be triggered when the page is closed or navigated away from.
    console.log('Page is closing or navigating away.');
    
    //undo acceptance of quote
    //statusID 1 = 'Generated'
    this.dataService.UpdateQuoteStatus(this.quoteID, 1).subscribe((result) => {
      console.log("Result", result);
      //email customer to ignore previous invoice email
      let customerName = this.customer.title ? this.customer.title + ' ' + this.customer.firstName + ' ' + this.customer.lastName : this.customer.firstName + ' ' + this.customer.lastName;
      let emailBody = `<div style="width: 100%; height: 100%; background-color: rgb(213, 213, 213); padding: 0.25rem 0; font-family: Tahoma, Arial, Helvetica, sans-serif;">
                        <div style='width: 50%; margin: auto; height: 100%; background-color: white; padding: 0 1rem;'>
                          <h3>Hi ${customerName},</h3>
                          <p>We hope you're well. Please ignore the previous email which contained your Invoice for Quotation #
                          ${this.quoteID}. Since you cancelled the order before you could finish paying the deposit, that invoice is no longer valid.</p>
                          <p>If you cancelled by mistake, just accept the quote again to restart the process.</p>
                          Kind regards<br />
                          MegaPack
                        </div>
                      </div>`;

      this.emailService.sendEmail(this.customer.email, 'Order not placed', emailBody);
    });
  }

  async getCustomerData() {
    const token = localStorage.getItem('access_token')!;
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.customer = await this.authService.getUserByEmail(email);
    }
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetVAT().pipe(take(1)));
      const getQuotePromise = lastValueFrom(this.dataService.GetQuote(this.quoteID).pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [currentVAT, quote] = await Promise.all([
        getVATPromise,
        getQuotePromise
      ]);

      //put results from DB in global attributes
      this.currentVAT = currentVAT;
      console.log('Applicable VAT', this.currentVAT);

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

  //decode quote ID from url
  decodeQuoteID(gibberish: string): number {
    var sensible = atob(gibberish);
    let sensibleArr = sensible.split('-');
    return parseInt(sensibleArr[1]);
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

  //go to next tab
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
    try {
      //statusID 1 = 'Generated'
      this.dataService.UpdateQuoteStatus(this.quoteID, 1).subscribe((result) => {
        console.log("Result", result);
        //email customer to ignore previous invoice email
        let customerName = this.customer.title ? this.customer.title + ' ' + this.customer.firstName + ' ' + this.customer.lastName : this.customer.firstName + ' ' + this.customer.lastName;
        let emailBody = `<div style="width: 100%; height: 100%; background-color: rgb(213, 213, 213); padding: 0.25rem 0; font-family: Tahoma, Arial, Helvetica, sans-serif;">
                          <div style='width: 50%; margin: auto; height: 100%; background-color: white; padding: 0 1rem;'>
                            <h3>Hi ${customerName},</h3>
                            <p>We hope you're well. Please ignore the previous email which contained your Invoice for Quotation #
                            ${this.quoteID}. Since you cancelled the order before you could finish paying the deposit, that invoice is no longer valid.</p>
                            <p>If you cancelled by mistake, just accept the quote again to restart the process.</p>
                            Kind regards<br />
                            MegaPack
                          </div>
                        </div>`;

        this.emailService.sendEmail(this.customer.email, 'Order not placed', emailBody);

        //Navigate to 'My quotes' page and send quote ID encoded in URL:
        this.router.navigate(['my-quotes']);
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  /*-------------PLACE ORDER------------ */
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

  placeOrder(successMessage: string) {
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
      this.dataService.AddCustomerOrder(newOrder).subscribe((result) => {
        this.isOrderPlaced = true;
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

  async doOnSitePayment(paymentAmount: number) {
    try {
      let onSiteUserData = new Map<string, string>();
      onSiteUserData.set("merchant_id", "10030872")
      onSiteUserData.set("merchant_key", "ommqhfbzaejj8")

      //onSiteUserData.set('return_url', window.location.origin + '/order-history')
      //onSiteUserData.set('cancel_url', window.location.origin + '/my-quotes')

      onSiteUserData.set("email_address", this.customer.email);

      onSiteUserData.set("amount", paymentAmount.toString());
      onSiteUserData.set("item_name", '#' + this.quoteID);

      onSiteUserData.set('passphrase', 'MegapackByBox');

      let signature = this.getSignature(onSiteUserData);
      onSiteUserData.set('signature', signature);

      let formData = new FormData();
      onSiteUserData.forEach((val, key) => {
        formData.append(key, val);
      });

      /* let formData = {
        merchant_id: '10030872',
        merchant_key : 'ommqhfbzaejj8',
        email_address: this.customer.email,
        amount: paymentAmount.toString(),
        item_name: '#' + this.quoteID,
        passphrase: 'MegapackByBox',
        signature: signature
      }
      console.log(JSON.stringify(formData)) */

      console.log('formData', formData);

      let response = await fetch(environment.payfastOnsiteEndpoint, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
        //mode: 'no-cors'
      });

      console.log('response', response);
      let respJson = await response.json();
      //let respJson = JSON.stringify(response);
      console.log('respJson', respJson)
      let uuid = respJson['uuid'];
      
      console.log('uuid', uuid, 'not undefined')
      payfast_do_onsite_payment({ 'uuid': uuid }, (res: any) => {
        if (res == true) {
          //successful payment
          console.log('Successful payment')
          /* Swal.fire({
            icon: 'success',
            title: "Success!",
            html: 'Payment successful!',
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((result) => {
            console.log(result);
          }); */
        }
        else {
          //failed payment
          console.log('Failed payment')
          /* Swal.fire({
            icon: 'error',
            title: "Oops...",
            html: "Something went wrong and your payment could not be processed.",
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((result) => {
            console.log(result);
          }); */
        }
      });
    } catch (error) {
      console.error(error);
    }
  }

  doFormPayment(paymentAmount: number) {
    let onSiteUserData = new Map<string, string>();
    onSiteUserData.set("merchant_id", "10030872")
    onSiteUserData.set("merchant_key", "ommqhfbzaejj8")

    //onSiteUserData.set('return_url', window.location.origin)
    //onSiteUserData.set('cancel_url', window.location.origin + '/cancel')

    onSiteUserData.set("email_address", this.customer.email);

    onSiteUserData.set("amount", paymentAmount.toString());
    onSiteUserData.set("item_name", '#' + this.quoteID);

    onSiteUserData.set('passphrase', 'MegapackByBox');

    let signature = this.getSignature(onSiteUserData);
    onSiteUserData.set('signature', signature);

    let autoPaymentForm = this.buildForm.group(onSiteUserData);
    
    this.httpComms.post('https://sandbox.payfast.co.za/eng/process', onSiteUserData).subscribe(resp => {
      console.log(resp);
    });
  }

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
