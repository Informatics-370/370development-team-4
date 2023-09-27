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
  deliveryTypeID: number;
  deliveryType: string; //delivery or pick up
  deliveryPhoto: string;
  paymentTypeID: number;
  paymentID: number;
  orderLines: OrderLineVM[];
}
