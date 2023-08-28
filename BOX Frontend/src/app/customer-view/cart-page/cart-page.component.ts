import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { CartService } from '../../services/customer-services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../shared/customer-interfaces/cart';
import { HttpClient } from '@angular/common/http';
import { QuoteVM } from '../../shared/quote-vm';
import { QuoteLineVM } from '../../shared/quote-line-vm';
import { Customer } from '../../shared/customer';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})

export class CartPageComponent {
  loading = true;
  products: Cart[] = []; //holds all items in cart
  totalQuantity: number = 0;
  productCount = -1;
  cannotRequest = false; //disables or enables request quote button
  cannotRequestReason = ''; //reason the customer is being prevented from requesting a quote
  customer!: Customer;
  customerID: string | null = '';
  /* discountList: Discount[] = []; //hold all bulk discounts
  applicableDiscount = 0; //bulk discount
  randomdiscount = 0; //customer discount
  totalPrice = 0;
  modal: any = document.getElementById('contactModal');
  firstName: string = '';
  lastName: string = '';
  cartTotal = 0; */

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private cartService: CartService,
    private authService: AuthService) { }

  //---------------------------- LOAD CART PAGE ----------------------------
  ngOnInit(): void {
    //get customer info
    const token = localStorage.getItem('access_token')!;
    this.customerID = this.authService.getUserIdFromToken(token);
    console.log(this.customerID);

    /*NB!!! BEFORE USING ANY CART SERVICE FUNCTIONS, PLEASE SUBSCRIBE TO THE GET PRODUCTS FUNCTION (like in the code below) 
    OR THE CART SERVICE WILL BREAK!!!*/
    this.cartService.getProducts().subscribe(() => {
      //only called after products have been retrieved.
      this.products = this.cartService.getCartItems(); //get items from cart using cart service
      this.checkCartStock(); //this notifies user if any product they initially wanted has now gone out of stock or if the qty on hand has reduced so much that they can't buy the original quanitity they wanted
      this.totalQuantity = this.cartService.getCartQuantity();
      this.productCount = this.cartService.getCartProductCount();
      this.checkIfAllowedToRequest();
      this.loading = false;
    });
    //this.modal = document.getElementById('contactModal');
  }

  //check if user has an active quote request or active quote
  checkIfAllowedToRequest() {
    if (this.customerID != null && this.customerID != '') {  
      try {
        //if they have an active qr (a quote request that hasn't been attended to), don't let them request a new quote
        this.dataService.CheckForActiveQuoteRequest(this.customerID).subscribe((result) => {
          console.log('active quote request', result);
          if (result != null) {
            this.cannotRequest = true;
            this.cannotRequestReason = 'Already requested';
          }
        });
  
        //if they already can't request due to already having an active QR, there's no point in checking for an quote
        if (!this.cannotRequest) {
          console.log('Got here');
          //if they have an active quote, quote with status that is 1 (Generated), or 4 (Rejected and will renegotiate)
          this.dataService.GetCustomerMostRecentQuote(this.customerID).subscribe((result) => {
            if (result.quoteStatusID == 1 || result.quoteStatusID == 4) {
              this.cannotRequest = true;
              this.cannotRequestReason = 'Already requested';          
            }
          });
        }  
      } catch (error) {
        console.error(error);
      }      
    }
  }

  //notify user of items that are out of stock or above quantity on hand when the cart page loads
  checkCartStock() {
    this.products.forEach(cartItem => {
      //only check fixed products
      if (cartItem.isFixedProduct) {
        //cart service below qty on hand function returns true if the cart item has a qty below qty on hand
        //so if it returns false, don't allow them to request quotee
        if (!this.cartService.belowQuantityOnHand(cartItem.productID, cartItem.quantity)) {
          this.cannotRequest = true;
          this.cannotRequestReason = 'Invalid quantity';
        }
      }
    });
  }

  //format whole numbers to have spaces e.g. turn 12345678 to 12 345 678
  getFormattedNumber(num: number): string {
    let arr = Array.from(num.toString());

    for (let i = arr.length; i >= 0; i -= 3) {
      arr.splice(i, 0, ' ');      
    }

    return arr.join('');
  }

  //---------------------------- MANIPULATE CART ----------------------------
  //update quantity of an item in cart
  updateCartItemQuantity(cartItem: Cart) {
    if (cartItem.quantity > 0) { //if quantity is above 0, update quantity
      //cart service update quantity method updates the qty and returns true if the new quantity is below or equal to qty on hand (for fixed products)
      if (this.cartService.updateProductQuantity(cartItem.productID, cartItem.isFixedProduct, cartItem.quantity)) {
        this.totalQuantity = this.cartService.getCartQuantity();
        this.cannotRequest = false;
      }
      else { //this means they want to order more than qty on hand
        this.cannotRequest = true;
        this.cannotRequestReason = 'Invalid quantity';
      }
    }
    else {
      //remove from cart
      this.removeFromCart(cartItem);
    }
  }

  //remove item from cart
  removeFromCart(cartItem: Cart) {
    this.cartService.removeFromCart(cartItem);
    this.refreshCart();
  }

  //clear cart
  clearCart() {
    this.cartService.emptyCart();
    this.refreshCart();
  }  

  //---------------------------- REQUEST QUOTE ----------------------------
  //create quote request
  requestQuote() {
    //redirect user to login if they're not logged in yet
    if (this.customerID == null || this.customerID == '') {
      //url is expecting redirectTo variable as 'redirect-' + 'url to redirect to' i.e 'redirect-cart'
      this.router.navigate(['login', 'redirect-cart']);
    }
    else {
      //create quote request
      let newQR: QuoteVM = {
        quoteRequestID: 0,
        dateRequested: new Date(Date.now()),
        quoteID: 0,
        dateGenerated: new Date(Date.now()),
        quoteStatusID: 0,
        quoteStatusDescription: '',
        quoteDurationID: 0,
        quoteDuration: 0,
        rejectReasonID: 0,
        rejectReasonDescription: '',
        priceMatchFileB64: '',
        customerId: this.customerID ? this.customerID : '',
        customerFullName: '',
        lines: []
      }

      //create QR lines
      this.products.forEach(cartItem => {
        let qrLine: QuoteLineVM = {
          quoteRequestLineID: 0,
          suggestedUnitPrice: 0,
          quoteLineID: 0,
          confirmedUnitPrice: 0,
          fixedProductID: cartItem.isFixedProduct ? cartItem.productID : 0,
          fixedProductDescription: '',
          customProductID: !cartItem.isFixedProduct ? cartItem.productID : 0,
          customProductDescription: '',
          quantity: cartItem.quantity
        }

        newQR.lines.push(qrLine); //put quote request line in QR
      });

      console.log('new quote request before posting', newQR);

      //post to backend
      try {
        this.dataService.AddQuoteRequest(newQR).subscribe((result) => {
          console.log('New QR: ', result);
          this.cartService.emptyCart(); //clear cart
          this.refreshCart();

          //notify user
          Swal.fire({
            icon: 'success',
            title: "Requested",
            html: "You've successfully requested a quote! An employee from MegaPack will contact you soon.",
            timer: 3000,
            timerProgressBar: true,
            confirmButtonColor: '#32AF99'
          }).then((result) => {
            console.log(result);
          });

          this.router.navigate(['/my-quotes']); //redirect to quotes page
        });
      } catch (error) {
        console.error('Error submitting quote: ', error);
      }
    }
  }
  
  //-------------------------- REFRESH PAGE VARIABLES WHENEVER THERE IS A CHANGE TO THE CART --------------------------
  refreshCart() {
    this.totalQuantity = this.cartService.getCartQuantity();
    this.productCount = this.cartService.getCartProductCount();
    this.products = this.cartService.getCartItems();
  }

  //function to get data from DB asynchronously (and simultaneously)
  /* async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getDiscountPromise = lastValueFrom(this.dataService.GetDiscounts().pipe(take(1)));

      //The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      //That's what the Promise.all method is supposed to be doing.
      const [allVAT, allDiscounts] = await Promise.all([
        getVATPromise,
        getDiscountPromise
      ]);

      //put results from DB in global arrays
      let vat = allVAT[0];
      this.discountList = allDiscounts;

      this.cartService.setGlobalVariables(this.discountList, vat);
      this.cartTotal = this.cartService.getCartTotal(this.randomdiscount);
      this.applicableDiscount = this.cartService.determineApplicableDiscount();
    } catch (error) {
      console.error('An error occurred:', error);
    }
  } */

  //This calculates the number of items that exist in the cart so that we can calculate the total price
  /* calculateTotalQuantity() {
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const product of this.products) {
      const quantity = +product.quantity;
      this.totalQuantity += quantity;
      //this.totalPrice += quantity * +product.fixedProduct.price; // Multiply quantity by the price and add it to the total price
    }


    // Format the total price to 2 decimal places
    const formattedPrice = this.totalPrice.toFixed(2);

    // This code updates the quantity and price on the front-end HTML
    const quantityElement = document.getElementById('quantity');
    const priceElement = document.getElementById('price');
    if (quantityElement && priceElement) {
      quantityElement.innerText = this.totalQuantity.toString();
      priceElement.innerText = formattedPrice;
    }


    for (const discount of this.discountList) {
      if (this.totalQuantity >= discount.quantity) {
        this.applicableDiscount = discount.percentage;
      } else {
        break; // Stop iterating once the quantity requirement is not met
      }
    }

    return this.applicableDiscount;
  }

  generateRandomDiscount(): void {
    const min = 10;
    const max = 40;
    this.randomdiscount = Math.floor(Math.random() * (max - min + 1)) + min;

    const discountElement = document.getElementById('customerdiscount');
    if (discountElement) {
      discountElement.innerText = this.randomdiscount.toString();
    }
  }

  //Get Bulk Discount to calculate the total discount:
  getBulkDiscount(): number {
    for (const discount of this.discountList) {
      if (this.totalQuantity >= discount.quantity) {
        return discount.percentage;
      }
    }
    return 0; // Return 0 if no bulk discount is applicable
  }

  calculateTotalDiscount(): number {
    const bulkDiscount = this.getBulkDiscount();
    const customerDiscount = this.applicableDiscount;
    return this.randomdiscount + customerDiscount;
  }

  //Calculate Final Total Estimated Price which considers the Discounts

  calculateFinalEstimatedTotalPrice(): number {
    const totalDiscount = this.calculateTotalDiscount() / 100; // Convert the discount percentage to a decimal value

    const discountedPrice = this.totalPrice - (this.totalPrice * totalDiscount);
    return discountedPrice;
  }

  calculateFinalDiscount(): number {
    const totalDiscount = this.calculateTotalDiscount() / 100; // Convert the discount percentage to a decimal value

    const discountAmount = this.totalPrice * totalDiscount;
    return discountAmount;
  }

  updateTotalPrice(): void {
    // Recalculate the total price for all products in the cart
    //   for (const product of this.products) {
    //     product.totalPrice = product.fixedProduct.price * +product.quantity;
    //   }
    // }




  }

  calculateTotalPrice() {
    let totalPrice = 0;

    for (const product of this.products) {
    totalPrice += +product.fixedProduct.price; // Convert quantity from string to number and add it to the total
    console.log("Number of products in cart:",totalQuantity)
    }
    //This gets the id of the span to show the quantity in the cart
    const quantityElement = document.getElementById('quantity');
    if (quantityElement) {
      quantityElement.innerText = totalQuantity.toString();
    }
  } */

  /*---------------------------------Section 2--------------------------------- */
  //In this section I will work on the user being able to update the quantity of goods in their cart, this should allow a change in the price of what is in the cart.

  /* //------------------------------Section 3------------------------------
  //This section deals with the Get-in contact with us Modal, It can be further subdivided into 2 main sections

  //In the following lines, I will be dealing with some of the smaller details of functionality, e.g closing a modal when the X button is clicked and also when the user clicks outside the modal

  showGetInTouchWithUsModal(): void {
    this.modal.style.display = 'block';
    window.addEventListener('click', this.clickOutsideModal.bind(this));

    // Add an event listener to close the modal when the user clicks on the close button
    const closeButton = this.modal.querySelector('.close');
    if (closeButton) {
      closeButton.addEventListener('click', this.closeModal.bind(this));
    }
  }
  clickOutsideModal(event: MouseEvent): void {
    if (event.target == this.modal) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.modal.style.display = 'none';

    // Remove the event listeners
    window.removeEventListener('click', this.clickOutsideModal.bind(this));
    const closeButton = this.modal.querySelector('.close');
    if (closeButton) {
      closeButton.removeEventListener('click', this.closeModal.bind(this));
    }
  }

  //Section 3.1:
  //This deals with the actual frontend representation of the modal with user input fields for negotiation of the price charged.

  showUsersName(): string {

    return this.firstName + ' ' + this.lastName;
  }

  //Section 3.2 :
  //This deals with sending an email to the Employee responsible for the customer once the submit button is pressed. As of 13 July 2023, for now it will be sent to the admin. employee-customer assignment will be finalised at a later stage

  //CREATE ESTIMATE
  submitEstimateLine() {
      // Prepare the data for creating a new Estimate Line.
      const estimateLineData = {
        customerID: this.customerId,
        estimateID: this.estimateId,
        AdminID: 1, // Replace with the actual AdminID value
        FixedProductID: 1, // Replace with the actual FixedProductID value
        Confirmed_Unit_Price: 0, // Replace with the actual Confirmed_Unit_Price value
      };
    
      // Call the AddEstimateLine function from your data service
      this.dataService.AddEstimateLine(estimateLineData).subscribe(
        (response) => {
          console.log('API call successful, response:', response);
          const newEstimateId = response.estimateID; // Replace 'EstimateID' with the actual property name in the API response
         // this.showNotification('New estimate created successfully'); // Display success notification
  
          // Set the Estimate Status ID to 1 (Pending Review) and navigate to the "Estimate" page.
          
        },
        (error) => {
          console.error('Error creating Estimate Line:', error);
        //  this.showNotification('Failed to create estimate'); // Display error notification
  
        }
      );
  
   // Add the code to send the email here
   const toEmail = 'recipient@example.com'; // Replace with the email address of the recipient
   const subject = 'Email Subject'; // Get the subject from your form
   const body = 'Email Body'; // Get the email body from your form
  
   // Access the file input element and get selected files
   const fileInput: HTMLInputElement = document.getElementById('attachments') as HTMLInputElement;
   const attachments:any = fileInput.files;
  
   // Create a FormData object to send the data to the API
   const formData = new FormData();
   formData.append('recipientEmail', toEmail);
   formData.append('subject', subject);
   formData.append('body', body);
  
   // Append each selected file to the FormData
   for (let i = 0; i < attachments.length; i++) {
     formData.append('attachments', attachments[i]);
   }
  
   // Make the POST request to your C# API endpoint
   this.http.post("http:localhost:5116/api/GetInContactEmail/SendEmail"
   , formData).subscribe(
     () => {
       // Handle success
       console.log('Email sent successfully');
     //  this.showNotification('Email sent successfully'); // Display success notification
  
       // Add any additional logic or feedback to the user
     },
     (error) => {
       // Handle error
       console.error('Error sending email:', error);
     //  this.showNotification('Failed to send email'); // Display error notification
  
       // Add any additional error handling or feedback to the user
     }
   );
  
      this.router.navigate(['/estimate']);
    } */
}
