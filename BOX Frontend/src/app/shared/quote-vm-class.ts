import { QuoteVM } from "./quote-vm";
import { VAT } from "./vat";

//extend classic quote VM functionality; this is the only page where I will use this class
export class QuoteVMClass implements QuoteVM {
  //quote request-specific info
  quoteRequestID: number;
  dateRequested: Date; //date the quote was requested

  //quote-specific info
  quoteID: number;
  quoteStatusID: number;
  quoteStatusDescription: string;
  rejectReasonID: number;
  rejectReasonDescription: string;
  priceMatchFileB64: string;
  dateGenerated: Date; //date the quote was generated
  quoteDurationID: number;
  quoteDuration: number;
  dateExpiring: Date = new Date(Date.now()); //date quote is expiring as string

  //generic info
  customerId: string;
  customerFullName: string;
  customerEmail: string;
  lines: any[];
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
    suggestedUnitPrice: 0,
    confirmedUnitPrice: 0,
    quantity: 0
  }
  */
  applicableVAT: VAT;
  totalBeforeVAT = 0;
  totalVAT = 0;

  constructor(quote: QuoteVM, lines: any[], applicableVAT: VAT, isQuote: boolean = true) {
    this.quoteDurationID = quote.quoteDurationID;
    this.quoteDuration = quote.quoteDuration;
    this.dateRequested = new Date(quote.dateRequested);
    this.lines = lines;
    this.applicableVAT = applicableVAT;
    this.quoteRequestID = quote.quoteRequestID;
    this.quoteID = quote.quoteID;
    this.quoteStatusID = quote.quoteStatusID;
    this.quoteStatusDescription = quote.quoteStatusDescription;
    this.rejectReasonID = quote.rejectReasonID;
    this.rejectReasonDescription = quote.rejectReasonDescription;
    this.priceMatchFileB64 = quote.priceMatchFileB64;
    this.dateGenerated = new Date(quote.dateGenerated); //dates from the backend come as string so I must convert it to Date object
    this.customerId = quote.customerId;
    this.customerFullName = quote.customerFullName;
    this.customerEmail = quote.customerEmail;
    this.totalBeforeVAT = this.getTotalBeforeVAT();
    this.totalVAT = this.getVATAmount();
    
    if (isQuote) {
      this.dateExpiring = new Date(this.dateGenerated);
      this.dateExpiring.setDate(this.dateGenerated.getDate() + this.quoteDuration);
    }
  }

  getTotalBeforeVAT(): number {
    let total = 0;
    this.lines.forEach(line => {
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
  
  //add new line to quote
  addNewQuoteLine(newLine: any[]) {
    //add quote line
    this.lines.push(newLine);

    //update total before vat and vat amount
    this.refreshTotals();
  }
}