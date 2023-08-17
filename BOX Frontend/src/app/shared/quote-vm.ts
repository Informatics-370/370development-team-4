import { QuoteLineVM } from "./quote-line-vm";

//this VM is used for quote requests and quotes
export interface QuoteVM {
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

  //generic info
  customerId: string;
  customerFullName: string;
  lines: QuoteLineVM[];
}
