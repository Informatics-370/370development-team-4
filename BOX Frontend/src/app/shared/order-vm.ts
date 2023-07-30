import { OrderLineVM } from "./order-line-vm";

export interface OrderVM {
    customerOrderID: number;
    customerStatusID: number;
    customerID: number;
    orderDeliveryScheduleID: number;
    date: string;
    deliveryPhoto: string;
    customerFullName: string;
    orderStatusDescription: string;
    customerOrders: OrderLineVM[];
}
