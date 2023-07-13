import { FixedProductVM } from "../fixed-product-vm";
export interface Cart {
    fixedProduct: FixedProductVM;
    sizeString: string; //so it doesn't have to be reconcatenated
    discountID: number; //ID of discount in use
    quantity: number;
}
