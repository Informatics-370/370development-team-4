import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.services';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { EstimateVM } from '../../shared/estimate-vm';
import { EstimateLineVM } from '../../shared/estimate-line-vm';
import { Discount } from '../../shared/discount';
import { VAT } from '../../shared/vat';
import { FixedProductVM } from '../../shared/fixed-product-vm';
import { take, lastValueFrom } from 'rxjs';
declare var $: any;

@Component({
  selector: 'app-estimate-page',
  templateUrl: './estimate-page.component.html',
  styleUrls: ['./estimate-page.component.css']
})
export class EstimatePageComponent implements OnInit {
  customerEstimates: EstimateVM[] = [];
  allCustomerEstimates: EstimateClass[] = [];
  filteredEstimates: EstimateClass[] = [];
  estimateCount = -1;
  loading = true;
  cartIcon = faShoppingCart;
  user = {
    Id: '3804c42b-f8cb-4df3-91cd-8334874b5cf4',
    fullName: 'John Doe',
    discount: 0.05
  }; //will retrieve from backend when users are up and running
  vat!: VAT;
  fixedProducts: FixedProductVM[] = [];
  discountList: Discount[] = [
    { discountID: 1, percentage: 6, quantity: 50 },
    { discountID: 2, percentage: 10, quantity: 400 },
    { discountID: 3, percentage: 17, quantity: 7000 },
    { discountID: 4, percentage: 23, quantity: 20000 }
  ]; //will retrieve from backend when discount is up and running

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // const customerIDs = [3, 5, 10, 12, 13]; //the only customers that have estimates in the backend for now excluding 12 who got nothing
    // let index = Math.floor((Math.random() * 5));
    this.user.Id = '3804c42b-f8cb-4df3-91cd-8334874b5cf4';
    this.getDataFromDB();
  }

  //function to get data from DB asynchronously (and simultaneously)
  async getDataFromDB() {
    try {
      //turn Observables that retrieve data from DB into promises
      const getProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
      const getVATPromise = lastValueFrom(this.dataService.GetAllVAT().pipe(take(1)));
      const getEstimatesPromise = lastValueFrom(this.dataService.GetEstimatesByCustomer(this.user.Id).pipe(take(1)));

      /*The idea is to execute all promises at the same time, but wait until all of them are done before calling format products method
      That's what the Promise.all method is supposed to be doing.*/
      const [allVAT, allFixedProducts, allCustomerEstmates] = await Promise.all([
        getVATPromise,
        getProductsPromise,
        getEstimatesPromise
      ]);

      //put results from DB in global arrays
      this.fixedProducts = allFixedProducts;
      this.vat = allVAT[0];
      this.customerEstimates = allCustomerEstmates;

      this.displayCustomerEstimates()
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }

  displayCustomerEstimates() {
    this.customerEstimates.forEach(est => {
      //create array that holds product photo
      let estimateLines: any[] = [];
      est.estimate_Lines.forEach(line => {
        let product = this.fixedProducts.find(prod => prod.fixedProductID == line.fixedProductID);
        let estimateLine: any = {
          productDescription: line.fixedProductDescription,
          quantity: line.quantity,
          unitPrice: line.fixedProductUnitPrice,
          productImage: product ? product.productPhotoB64 : ''
        }
        
        estimateLines.push(estimateLine);
      });

      let estimate : EstimateClass = new EstimateClass(est.estimateID, est.estimateStatusID, est.estimateStatusDescription, 
        est.confirmedTotal, est.confirmedTotal, estimateLines)
      this.filteredEstimates.push(estimate);
    });
    
    this.allCustomerEstimates = this.filteredEstimates; //store all the estimate someplace before I search below
    this.estimateCount = this.filteredEstimates.length; //update the number of estimates

    console.log("All of customer " + this.user.Id + "'s estimates: ", this.filteredEstimates);
    this.loading = false;
  }

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

export class EstimateClass {
  ID: number;
  statusID: number;
  statusDescription: string;
  confirmedTotal: number; //total before negotiations after discount
  totalDiscount: number; //total discount in rands before negotiations; customer loyalty discount + bulk discount
  negotiatedTotal: number; //total after negotiations
  estimate_Lines: any[]; //array holding product info incl pics

  constructor(estimateID: number, statusID: number, statusDescription: string, confirmedTotal: number, negotiatedTotal: number, 
      estimateLines: EstimateLineVM[]) {
    this.ID = estimateID;
    this.statusID = statusID;
    this.statusDescription = statusDescription;
    this.confirmedTotal = confirmedTotal;
    this.negotiatedTotal = negotiatedTotal;
    this.estimate_Lines = estimateLines;
    this.totalDiscount = this.getDiscount();
  }

  getTotalBeforeDiscount(): number {
    let total = 0;
    this.estimate_Lines.forEach(line => {
      total += line.unitPrice * line.quantity;
    });

    return total;
  }

  getDiscount(): number {
    let totalBeforeDiscount = this.getTotalBeforeDiscount();
    let discount = totalBeforeDiscount - this.confirmedTotal;
    return discount;
  }

  getNegotiatedDiscount(): number {
    return this.confirmedTotal - this.negotiatedTotal;
  }
}
