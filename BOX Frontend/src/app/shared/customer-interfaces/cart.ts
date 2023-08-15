//import { FixedProductVM } from "../fixed-product-vm";
export interface Cart {
    //fixedProduct: FixedProductVM;
    productID: number;
    description: string;
    itemDescription: string; //product item description
    productPhotoB64: string;
    sizeString: string; //so it doesn't have to be reconcatenated
    isFixedProduct: boolean;
    quantity: number;
    quantityOnHand: number;
    hasValidQuantity: boolean;
}