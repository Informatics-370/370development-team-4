import { OrderLineVM } from "./order-line-vm";

export interface OrderVM {
  customerOrderID: number;
  quoteID: number;
  customerId: string;
  customerFullName: string;
  orderStatusID: number;
  orderStatusDescription: string;
  date: Date; //date ordered
  deliveryScheduleID: number;
  deliveryDate: Date;
  deliveryType: string; //delivery or pick up
  deliveryPhoto: string;
  orderLines: OrderLineVM[];
}
