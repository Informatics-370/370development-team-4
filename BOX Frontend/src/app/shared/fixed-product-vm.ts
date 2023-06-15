export interface FixedProductVM {
    fixedProductID: number;
    qrCodeID: number;
    qrCodeBytes: Uint8Array; //hopefully stores byte array as bytes
    itemID: number;
    sizeID: number;
    description: string;
    price: number;
    productPhotoB64: string;
}
