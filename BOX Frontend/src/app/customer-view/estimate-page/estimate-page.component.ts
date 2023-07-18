import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { DataService } from '../../services/data.services';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { Item } from '../../shared/item';
import { ProductVM } from '../../shared/customer-interfaces/product-vm';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Cart } from '../../shared/customer-interfaces/cart';
import { Discount } from '../../shared/discount';
import { EstimateVM } from '../../shared/estimate-vm';
import { EstimateLineVM } from '../../shared/estimate-line-vm';
declare var $: any;

@Component({
  selector: 'app-estimate-page',
  templateUrl: './estimate-page.component.html',
  styleUrls: ['./estimate-page.component.css']
})
export class EstimatePageComponent implements OnInit {
  estimateLines: EstimateLineVM[] = [];
  cartIcon = faShoppingCart;
  customer =9;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const estimateId = 2; // Replace with your actual estimateId
    const customerId = 9; // Replace with your actual customerId

    //this.getEstimateLine(estimateId, customerId);
  }

  /* getEstimateLine(estimateId: number, customerId: number): void {
    this.dataService.GetEstimateLine(estimateId, customerId).subscribe(
      (result) => {
        this.estimateLines.push(result);
        this.customer = result.customerID;
        
      },
      (error) => {
        console.log('Error fetching EstimateLine:', error);
      }
    );
  } */

  //Kuziwa: 16 July, since we are currently retrieving from local storage, I will ensure the Estimate page displays what is stored in the customer's localstorage history---- This will have to change once we implement db functionality

  //This is the functionality I intend to have: The page will load with what is stored in local storage.
  //I intend for once an order is placed, the cart gets empty----- Charis will see how she wants to implement that but as for me, when the customer rejects the new confirmed price, the local storage history will clear. 
  //When the user presses the send button for the email, all items in the cart will be hidden. So they will not be able to add anything to the LocalStorage instance of "MegaPack Cart", I hope to add some logic so that if they do click the Add to cart button on the products page when the status is set to "Pending Review" or "Reviewed" their cart will fill in a different instance of local storage-- yet again, this is definitely a temporary solution because local storage will fill up pretty quickly with this method.
  //The final bit of logic will be to ensure they can not add a new estimate if there is one pending review or reviewed, only once it is expired, accepted or rejected can they then request another estimate

  //So buckle your seatbelt as we try to navigate this fun maze of coding logic :)

  //When the status is set to Pending Review only one button will show: Reject

  //When the status is changed to Reviewed, the buttons for Accept and Reject will populate the screen, Accept will take them to the payment pages.

  //Reject will change the status to rejected and the cart will not be editable in any way. All they will be able to do is view the estimate details---- Because it's local storage, it will break eventually

  //NB:------ What shall make this code very difficult to achieve is retrieving the customer info

  // ... Other methods and logic ...
}
