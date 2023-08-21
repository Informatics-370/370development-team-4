export interface QuoteLineVM {
  //quote request-specific info
  quoteRequestLineID: number;
  suggestedUnitPrice: number;

  //quote-specific info
  quoteLineID: number;
  confirmedUnitPrice: number;

  //generic info
  fixedProductID: number;
  fixedProductDescription: string;
  customProductID: number;
  customProductDescription: string;
  quantity: number;
}
