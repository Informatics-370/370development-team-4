import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Discount } from '../../shared/discount';
import { HttpClient } from '@angular/common/http';
//This is causing the code to break----import { MatSnackBar } from '@angular/material/snack-bar';
import { EstimateVM } from '../../shared/estimate-vm';
import { EstimateLineVM } from '../../shared/estimate-line-vm';
import { CartService } from '../../services/customer-services/cart.service';
import { VAT } from '../../shared/vat';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})

/*  Kuziwa: Dealing with Estimates- There shall be three main parts to the cart's functionality regarding estimates:*/

//In this section I will be retrieving from Local storage and dynamically displaying what is stored in local storage in cards to the customer. 

export class CartPageComponent {
  loading = true;
  products: Cart[] = [];
  discountList: Discount[] = []; //hold all bulk discounts
  totalQuantity: number = 0;
  applicableDiscount = 0; //bulk discount
  randomdiscount = 0; //customer discount
  totalPrice = 0;
  modal: any = document.getElementById('contactModal');
  firstName: string = '';
  lastName: string = '';
  cartTotal = 0;
  customerId = 1; // Hardcoded Customer ID, replace with your desired value
  estimateId = 3; // You may choose to hardcode this or generate it as needed

  constructor(private router: Router, private dataService: DataService, private http: HttpClient, private cartService: CartService) { }

  //showNotification(message: string): void {
  //  this.snackBar.open(message, 'Dismiss', {
  //    duration: 5000, // Duration in milliseconds
  //    verticalPosition: 'top', // Display the notification at the top of the screen
  //  });
  //}

  ngOnInit(): void {
    this.getDataFromDB();
    this.products = this.cartService.getCartItems(); //get items from cart using cart service

    this.loading = false;

    if (this.products.length > 0) {
      const firstProductDescription = this.products[0].fixedProduct.description;
      console.log('First product description:', firstProductDescription);
    }
    this.calculateTotalQuantity();
    this.generateRandomDiscount();
    this.modal = document.getElementById('contactModal');

    this.cartTotal = this.cartService.getCartTotal(this.randomdiscount);
    this.applicableDiscount = this.cartService.determineApplicableDiscount();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getDiscountPromise = lastValueFrom(this.dataService.GetDiscounts().pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
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
  }

  //This calculates the number of items that exist in the cart so that we can calculate the total price
  calculateTotalQuantity() {
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const product of this.products) {
      const quantity = +product.quantity;
      this.totalQuantity += quantity;
      this.totalPrice += quantity * +product.fixedProduct.price; // Multiply quantity by the price and add it to the total price
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






  //
  // calculateTotalPrice() {
  //   let totalPrice = 0;

  //   for (const product of this.products) {
  //     totalPrice += +product.fixedProduct.price; // Convert quantity from string to number and add it to the total
  //   console.log("Number of products in cart:",totalQuantity)
  //   }
  //   //This gets the id of the span to show the quantity in the cart
  //   const quantityElement = document.getElementById('quantity');
  //   if (quantityElement) {
  //     quantityElement.innerText = totalQuantity.toString();
  //   }
  // }



  /*---------------------------------Section 2--------------------------------- */
  //In this section I will work on the user being able to update the quantity of goods in their cart, this should allow a change in the price of what is in the cart.












  /*------------------------------Section 3------------------------------*/
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

  /*CREATE ESTIMATE */
  /* submitEstimateLine() {
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

  createEstimate() {
    //create estimate
    let newEstimate: EstimateVM = {
      estimateID: 0,
      estimateStatusID: 0,
      estimateStatusDescription: '',
      estimateDurationID: 0,
      customerID: 4,
      customerFullName: '',
      confirmedTotal: this.cartService.getCartTotal(this.randomdiscount),
      estimate_Lines: []
    }

    //create estimate lines from cart
    this.products.forEach(cartItem => {
      let estimateLine: EstimateLineVM = {
        estimateLineID: 0,
        estimateID: 0,
        fixedProductID: cartItem.fixedProduct.fixedProductID,
        fixedProductDescription: '',
        fixedProductUnitPrice: 0,
        customProductID: 0,
        customProductDescription: '',
        customProductUnitPrice: 0,
        quantity: cartItem.quantity
      }

      newEstimate.estimate_Lines.push(estimateLine);
    });
    console.log('Estimate before posting: ', newEstimate);

    try {
      //post to backend
      this.dataService.AddEstimate(newEstimate).subscribe((result) => {
        console.log('New estimate: ', result)
        this.cartService.emptyCart(); //clear cart
        this.router.navigate(['/quotes']); //redirect to estimate page
      });
    } catch (error) {
      console.error('Error submitting estimate: ', error);
    }
  }
}
