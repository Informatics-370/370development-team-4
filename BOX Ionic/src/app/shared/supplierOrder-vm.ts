import { SupplierOrderLineVM } from "./supplierOrderline-vm";

export interface SupplierOrderVM {
  supplierOrderID: number,
  supplierID: number,
  date: string,
  supplierName: string;
  supplierOrders: SupplierOrderLineVM[];
}