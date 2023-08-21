export interface ProductVM {
    itemID: number;
    categoryID: number;
    description: string;
    price: number; //allows us to sort by price on products page
    productPhotoB64: string;
    sizeStringArray: string[];
}
