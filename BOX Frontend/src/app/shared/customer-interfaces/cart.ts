//import { FixedProductVM } from "../fixed-product-vm";
export interface Cart {
    //fixedProduct: FixedProductVM;
    productID: number;
    description: string;
    productPhotoB64: string;
    sizeString: string; //so it doesn't have to be reconcatenated
    isFixedProduct: boolean;
    quantity: number;
}