import { Component } from '@angular/core';
import { DataService } from '../../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { OrderVM } from '../../shared/order-vm';
import { OrderLineVM } from '../../shared/order-line-vm';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteVMClass } from '../../shared/quote-vm-class';
import { VAT } from '../../shared/vat';
import Swal from 'sweetalert2';
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

  //quote and order
  currentVAT!: VAT;
  quoteID = 0;
  quote!: QuoteVMClass;
  placedOrder!: OrderVM;

  //forms logic
  placeOrderForm: FormGroup;

  constructor(private router: Router, private dataService: DataService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute) {
    this.placeOrderForm = this.formBuilder.group({
      deliveryType: ['Pick up', Validators.required],
      shippingAddress: ['123 Fake Road, Pretoria North', Validators.required],
      paymentType: ['Pay immediately', Validators.required],
    });
  }

  ngOnInit() {
    //Retrieve the quote ID that leads to this order from url
    this.activatedRoute.paramMap.subscribe(params => {
      //product with id 2 and description 'product description' will come as '2-product-description' so split it into array that is ['2', 'product-description']
      let id = params.get('quoteID');
      if (id) this.quoteID = this.decodeQuoteID(id);
    });

    //get customer ID   
    let id = localStorage.getItem('user_id');
    if (id) this.customerID = id;

    this.getDataFromDB();
    this.getCreditDueDate();
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

        //Navigate to 'My quotes' page and send quote ID encoded in URL:
        this.router.navigate(['my-quotes']);
      });
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  }

  /*-------------PLACE ORDER------------ */
  placeOrder() {
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

    let successMessage = '';
    //decrease credit balance for credit customers
    if (this.paymentType?.value == "Credit") {

      successMessage = "Your credit balance has been updated!";
    }

    try {
      //post to backend
      this.dataService.AddCustomerOrder(newOrder).subscribe((result) => {
        //sucess message
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

  get deliveryType() { return this.placeOrderForm.get('deliveryType'); }
  get paymentType() { return this.placeOrderForm.get('paymentType'); }
}
