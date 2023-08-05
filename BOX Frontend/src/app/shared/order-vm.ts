import { OrderLineVM } from "./order-line-vm";

export interface OrderVM {
    customerOrderID: number;
    userId: string;
    orderDeliveryScheduleID: number;
    date: string;
    deliveryPhoto: string;
    customerFullName: string;
    orderStatusID: number;
    orderStatusDescription: string;
    orderTotalExcludingVAT: number;
    customerOrders: OrderLineVM[];
}
