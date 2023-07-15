import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Discount } from '../../shared/discount';


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
  applicableDiscount = 0;
  randomdiscount=0;
  totalPrice=0;
  modal:any = document.getElementById('contactModal');
   firstName :string='';
   lastName :string='';
  







  constructor() {}

  ngOnInit(): void {
    
    const productsData = localStorage.getItem('MegaPack-cart');

    if (productsData) {
      this.products = JSON.parse(productsData) as Cart[];
      console.log('Retrieved products:', this.products);
    }
    this.loading = false;

    if (this.products.length > 0) {
      const firstProductDescription = this.products[0].fixedProduct.description;
      console.log('First product description:', firstProductDescription);
    }
    this.calculateTotalQuantity();
    this.generateRandomDiscount();
    this.modal = document.getElementById('contactModal');
    
 
  }
  cartIcon = faShoppingCart; //This ensures we have a shopping cart icon from the font awesome library to show in the front end



  
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

   // generate static discount list
   this.discountList.push(
    { discountID: 1, percentage: 6, quantity: 50 },
    { discountID: 2, percentage: 10, quantity: 400 },
    { discountID: 3, percentage: 17, quantity: 7000 },
    { discountID: 4, percentage: 23, quantity: 20000 }
  )
  console.log('All discounts: ', this.discountList);
  
  
    for (const discount of this.discountList) {
      if (this.totalQuantity >= discount.quantity) {
        this.applicableDiscount = discount.percentage;
      } else {
        break; // Stop iterating once the quantity requirement is not met
      }
    }
  
    return this.applicableDiscount;
  }

  get discountPercentage(): number {
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
   
    return this.firstName +' '+ this.lastName;
  }













//Section 3.2 :
//This deals with sending an email to the Employee responsible for the customer once the submit button is pressed. As of 13 July 2023, for now it will be sent to the admin. employee-customer assignment will be finalised at a later stage








 

}
