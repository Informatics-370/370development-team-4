import { EstimateVM } from "./estimate-vm";
import { EstimateLineVM } from "./estimate-line-vm";

export class VATInclusiveEstimate implements EstimateVM {
  estimateID: number;
  estimateStatusID: number;
  estimateStatusDescription: string;
  estimateDurationID: number;
  confirmedTotal: number; //total before negotiations and after discount; includes VAT
  //customerID: number;
  customerFullName: string;
  estimate_Lines: EstimateLineVM[];
  vatPercentage: number; //whole number e.g. 25 for 25%
  totalDiscount: number; //total discount in rands before negotiations i.e. customer loyalty discount + bulk discount
  negotiatedTotal: number; //total after negotiations

  constructor(estimate: EstimateVM, vatPercentage: number, negotiatedTotal?: number) {
    this.vatPercentage = vatPercentage;
    this.confirmedTotal = this.getVATInclusiveAmount(estimate.confirmedTotal);
    this.estimateID = estimate.estimateID;
    this.estimateStatusID = estimate.estimateStatusID;
    this.estimateStatusDescription = estimate.estimateStatusDescription;
    this.estimateDurationID = estimate.estimateDurationID;
    //this.customerID = estimate.customerID;
    this.customerFullName = estimate.customerFullName;
    this.estimate_Lines = this.makePriceVATInclusive(estimate.estimate_Lines);
    this.negotiatedTotal = negotiatedTotal ? negotiatedTotal : this.confirmedTotal;
    this.totalDiscount = this.getDiscount();
  }
  
  UserId!: string;

  //this function takes the estimate lines and makes the product price vat inclusive
  makePriceVATInclusive(estimateLines: EstimateLineVM[]): EstimateLineVM[] {
    let lines: EstimateLineVM[] = [];

    estimateLines.forEach(estL => {
      let line: EstimateLineVM;
      line = {
        estimateLineID: estL.estimateLineID,
        estimateID: estL.estimateID,
        fixedProductID: estL.fixedProductID,
        fixedProductDescription: estL.fixedProductDescription,
        fixedProductUnitPrice: this.getVATInclusiveAmount(estL.fixedProductUnitPrice),
        customProductID: estL.customProductID,
        customProductDescription: estL.customProductDescription,
        customProductUnitPrice: this.getVATInclusiveAmount(estL.customProductUnitPrice),
        quantity: estL.quantity
      };

      lines.push(line);
    });

    return lines;
  }

  getVATInclusiveAmount(amount: number): number {
    let priceInclVAT = amount * (1 + this.vatPercentage / 100);
    return priceInclVAT;
  }

  getTotalBeforeDiscount(): number { //total before bulk and customer discount
    let total = 0;
    this.estimate_Lines.forEach(line => {
      total += line.fixedProductUnitPrice * line.quantity;
    });

    return total;
  }

  getDiscount(): number { //get bulk and customer discount amount in rands
    let totalBeforeDiscount = this.getTotalBeforeDiscount();
    let discount = totalBeforeDiscount - this.confirmedTotal;
    return discount;
  }

  getNegotiatedDiscount(): number { //discount agreed on during negotiations
    return this.confirmedTotal - this.negotiatedTotal;
  }

  addNewEstimateLine(...estimateLines: EstimateLineVM[]) {
    //add estimate line
    estimateLines.forEach(line => {
      //make price vat inclusive
      line.fixedProductUnitPrice = this.getVATInclusiveAmount(line.fixedProductUnitPrice);
      this.estimate_Lines.push(line);
    });

    //update totals; this won't account for bulk discounts but it will account for whatever discount was there before
    this.confirmedTotal = this.getTotalBeforeDiscount() - this.totalDiscount;
    this.negotiatedTotal = this.confirmedTotal; //reset negotiated total
    this.totalDiscount = this.getDiscount(); //get new total discount
  }

  removeEstimateLine(...estimateLineIDs: number[]) {
    //remove estimate line
    estimateLineIDs.forEach(ID => {
      let toDelete = this.estimate_Lines.find(l => l.estimateLineID == ID);

      if (toDelete) this.estimate_Lines.splice(this.estimate_Lines.indexOf(toDelete), 1);
    });

    //update totals; this won't account for bulk discounts but it will account for whatever discount was there before
    this.confirmedTotal = this.getTotalBeforeDiscount() - this.totalDiscount;
    this.negotiatedTotal = this.confirmedTotal; //reset negotiated total
    this.totalDiscount = this.getDiscount(); //get new total discount
  }
}
