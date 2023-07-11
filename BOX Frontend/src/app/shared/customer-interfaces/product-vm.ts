export interface ProductVM {
    itemID: number;
    categoryID: number;
    description: string;
    productPhotoB64: string;
    prices: number[];
    availableSizes: string[];
    qtyOnHand: number;
}
