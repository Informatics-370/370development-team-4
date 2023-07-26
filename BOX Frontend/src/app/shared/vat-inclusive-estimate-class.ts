import { EstimateVM } from "./estimate-vm";
import { EstimateLineVM } from "./estimate-line-vm";

export class VATInclusiveEstimate implements EstimateVM {
  estimateID: number;
  estimateStatusID: number;
  estimateStatusDescription: string;
  estimateDurationID: number;
  confirmedTotal: number; //total before negotiations and after discount; includes VAT
  customerID: number;
  customerFullName: string;
  estimate_Lines: any[];
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
    this.customerID = estimate.customerID;
    this.customerFullName = estimate.customerFullName;
    this.estimate_Lines = this.makePriceVATInclusive(estimate.estimate_Lines);
    this.negotiatedTotal = negotiatedTotal ? negotiatedTotal : this.confirmedTotal;
    this.totalDiscount = this.getDiscount();
  }

  //this function takes the estimate lines and makes the product price vat inclusive
  makePriceVATInclusive(estimateLines: EstimateLineVM[]): VATInclusiveEstimateLine[] {
    let lines: VATInclusiveEstimateLine[] = [];

    estimateLines.forEach(estL => {
      let line: VATInclusiveEstimateLine;
      if (estL.fixedProductID > 0) { //if this estimate line is for a fixed product
        line = {
          estimateLineID: estL.estimateLineID,
          estimateID: estL.estimateID,
          fixedProductID: estL.fixedProductID,
          fixedProductDescription: estL.fixedProductDescription,
          fixedProductUnitPrice: this.getVATInclusiveAmount(estL.fixedProductUnitPrice),
          customProductID: 0,
          customProductDescription: '',
          customProductUnitPrice: 0,
          quantity: estL.quantity
        };
      }
      else { //custom product is being quoted for
        line = {
          estimateLineID: estL.estimateLineID,
          estimateID: estL.estimateID,
          fixedProductID: 0,
          fixedProductDescription: '',
          fixedProductUnitPrice: 0,
          customProductID: estL.customProductID,
          customProductDescription: estL.customProductDescription,
          customProductUnitPrice: estL.customProductUnitPrice,
          quantity: estL.quantity
        };
      }

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
      total += line.productUnitPrice * line.quantity;
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
}

interface VATInclusiveEstimateLine {
  estimateLineID: number;
  estimateID: number;
  fixedProductID: number;
  fixedProductDescription: string;
  fixedProductUnitPrice: number;
  customProductID: number;
  customProductDescription: string;
  customProductUnitPrice: number;
  quantity: number;
}
