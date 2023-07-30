export interface OrderLineVM {
    customerOrderLineID: number;
    cstomerOrderID: number;
    fixedProductID: number;
    fixedProductDescription: number; //data that I need when I get a specific estimate
    fixedProductUnitPrice: number; //data that I need when I get a specific estimate
    customProductID: number;
    customProductDescription: number; //data that I need when I get a specific estimate
    customProductUnitPrice: number; //data that I need when I get a specific estimate
    quantity: number;
    customerRefundID: number;
}
