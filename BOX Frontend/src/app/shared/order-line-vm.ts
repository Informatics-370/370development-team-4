export interface OrderLineVM {
    customerOrderLineID: number;
    customerOrderID: number;
    fixedProductID: number;
    fixedProductDescription: string; //data that I need when I get a specific estimate
    fixedProductUnitPrice: number; //data that I need when I get a specific estimate
    customProductID: number;
    customProductDescription: string; //data that I need when I get a specific estimate
    customProductUnitPrice: number; //data that I need when I get a specific estimate
    quantity: number;
    customerRefundID: number;
}