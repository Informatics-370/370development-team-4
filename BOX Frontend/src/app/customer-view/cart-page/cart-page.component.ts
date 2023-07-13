import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})

/*  Kuziwa: Dealing with Estimates- There shall be three main parts to the cart's functionality regarding estimates:*/

//In this section I will be retrieving from Local storage and dynamically displaying what is stored in local storage in cards to the customer. 

export class CartPageComponent {
  products: ProductVM[] = [];
  loading = true;


  ngOnInit(): void {
    // Retrieve products from local storage
    const productsData = localStorage.getItem("MegaPack-cart");

    if (productsData) {
      // Parse the JSON data into an array of ProductVM objects
      this.products = JSON.parse(productsData);
      console.log("What we are trying to retrieve:" ,productsData)
    }
  }
  cartIcon = faShoppingCart; //This ensures we have a shopping cart icon from the font awesome library to show in the front end







/*---------------------------------Section 2--------------------------------- */
//In this section I will work on the user being able to update the quantity of goods in their cart, this should allow a change in the price of what is in the cart.












/*------------------------------Section 3------------------------------*/
//This section deals with the Get-in contact with us Modal, It can be further subdivided into 2 main sections






//Section 3.1:
//This deals with the actual frontend representation of the modal with user input fields for negotiation of the price charged.





//Section 3.2 :
//This deals with sending an email to the Employee responsible for the customer once the submit button is pressed. As of 13 July 2023, for now it will be sent to the admin. employee-customer assignment will be finalised at a later stage








 

}
