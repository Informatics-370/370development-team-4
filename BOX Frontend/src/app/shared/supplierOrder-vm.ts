import { SupplierOrderLineVM } from "./supplierOrderline-vm";

export interface SupplierOrderVM {
    supplierOrderID:number,
    supplierID:number,
    Date:string,
    SupplierOrders : SupplierOrderLineVM[];
  }