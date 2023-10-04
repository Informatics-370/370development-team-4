import { OrderVM } from "./order-vm";
import { VAT } from "./vat";

export class OrderVMClass implements OrderVM {
  customerOrderID: number;
  quoteID: number;
  customerId: string;
  customerFullName: string;
  orderStatusID: number;
  orderStatusDescription: string;
  date: Date; //date ordered
  deliveryScheduleID: number;
  deliveryDate: Date;
  deliveryTypeID: number;
  deliveryType: string; //delivery or pick up
  deliveryPhoto: string;
  paymentID: number = 0;
  paymentTypeID: number;
  paymentType: string;
  code: string;
  qrcodeB64: string;
  reviewID: number;
  orderLines: any[];

  /*line = {
    lineID: 0,
    isFixedProduct: true,
    productID: 0,
    productDescription: '',
    productFileB64: '' //stores product image / pdf (for custom products) as base64 string
    confirmedUnitPrice: 0,
    quantity: 0
  }
  
  ALTERNATIVELY, line can look like this when I generate a quote i.e. work on admin-side:
  line = {
    lineID: 0,
    isFixedProduct: true,
    productID: 0,
    productDescription: '',
    confirmedUnitPrice: 0,
    quantity: 0
  }
  */

  applicableVAT: VAT;
  totalBeforeVAT = 0;
  totalVAT = 0;

  constructor(order: OrderVM, lines: any[], applicableVAT: VAT) {
    this.applicableVAT = applicableVAT;
    this.orderLines = lines;
    this.customerOrderID = order.customerOrderID;
    this.quoteID = order.quoteID;
    this.customerId = order.customerId;
    this.customerFullName = order.customerFullName;
    this.orderStatusID = order.orderStatusID;
    this.orderStatusDescription = order.orderStatusDescription;
    this.date = new Date(order.date);
    this.deliveryScheduleID = order.deliveryScheduleID;
    this.deliveryDate = new Date(order.deliveryDate);
    this.deliveryTypeID = order.deliveryTypeID;
    this.deliveryType = order.deliveryType;
    this.deliveryPhoto = order.deliveryPhoto;
    this.paymentTypeID = order.paymentTypeID;
    this.paymentType = order.paymentType;
    this.code = order.code;
    this.qrcodeB64 = order.qrcodeB64;
    this.reviewID = order.reviewID;
    this.totalBeforeVAT = this.getTotalBeforeVAT();
    this.totalVAT = this.getVATAmount();
  }

  getTotalBeforeVAT(): number {
    let total = 0;
    this.orderLines.forEach(line => {
      total += line.confirmedUnitPrice * line.quantity;
    });

    return total;
  }

  getVATAmount(): number {
    return this.totalBeforeVAT * this.applicableVAT.percentage / 100;
  }

  getTotalAfterVAT(): number {
    return this.totalBeforeVAT + this.totalVAT;
  }

  //called when you change value of confirmed unit price
  refreshTotals() {
    //refresh data
    this.totalBeforeVAT = this.getTotalBeforeVAT();
    this.totalVAT = this.getVATAmount();
  }
}
