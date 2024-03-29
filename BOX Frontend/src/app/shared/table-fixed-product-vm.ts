//I need this to display in the products table
export interface TableFixedProductVM {
    fixedProductID: number;
    //QR code
    qRCodeID: number;
    qRCodeB64: string;
    //Category
    categoryID: number;
    categoryDescription: string;
    //Product item
    itemID: number;
    itemDescription: string;
    //Product size
    sizeID: number;
    sizeString: string;
    //Product info
    description: string;
    price: number;
    productPhoto: string; //already converted to base64 string from the backend
    quantityOnHand: number;
  }