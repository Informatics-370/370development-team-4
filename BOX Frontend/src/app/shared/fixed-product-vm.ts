export interface FixedProductVM {
    fixedProductID: number;
    qRCodeID: number;
    qRCode: Uint8Array; //hopefully stores byte array as bytes
    itemID: number;
    sizeID: number;
    description: string;
    price: number;
}
