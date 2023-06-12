//I need this to display in the products table
export interface TableFixedProductVM {
    fixedProductID: number;
    //QR code
    qRCodeID: number;
    qRCode: Uint8Array; //hopefully stores byte array as bytes
    //Category
    categoryID: number;
    categoryDescription: number;
    //Product item
    itemID: number;
    itemDescription: string;
    //Product size
    sizeID: number;
    sizeString: string;
    //Product info
    description: string;
    price: number;
    productPhoto: Uint8Array;
  }