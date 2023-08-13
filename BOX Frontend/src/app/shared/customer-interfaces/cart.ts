import { FixedProductVM } from "../fixed-product-vm";
export interface Cart {
    fixedProduct: FixedProductVM;
    sizeString: string; //so it doesn't have to be reconcatenated
    quantity: number;
}