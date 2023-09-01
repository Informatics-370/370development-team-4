export interface OrderLineVM {
  customerOrderLineID: number;
  customerOrderID: number;
  fixedProductID: number;
  fixedProductDescription: string;
  customProductID: number
  customProductDescription: string;
  quantity: number;
  confirmedUnitPrice: number;
  customerReturnID: number;
}
