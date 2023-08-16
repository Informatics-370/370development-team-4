export interface QuoteLineVM {
  quoteLineID: number;
  quoteRequestLineID: number;
  fixedProductID: number;
  fixedProductDescription: string;
  customProductID: number;
  customProductDescription: string;
  suggestedUnitPrice: number;
  confirmedUnitPrice: number;
  quantity: number;
}
