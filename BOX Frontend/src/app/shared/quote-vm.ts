import { QuoteLineVM } from "./quote-line-vm";

export interface QuoteVM {
  quoteRequestID: number;
  quoteID: number;
  customerId: string;
  customerFullName: string;
  dateRequested: Date; //date the quote was requested
  rejectReasonID: number;
  rejectReasonDescription: string;
  sriceMatchFileB64: string;
  dateGenerated: Date; //date the quote was generated
  quoteStatusID: number;
  quoteStatusDescription: string;
  quoteDurationID: number
  lines: QuoteLineVM[];
}
