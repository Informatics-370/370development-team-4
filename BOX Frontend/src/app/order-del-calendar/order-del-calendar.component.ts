import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { OrderVM } from '../shared/order-vm';
import { OrderService } from '../services/orders';

@Component({
  selector: 'app-order-del-calendar',
  templateUrl: './order-del-calendar.component.html',
  styleUrls: ['./order-del-calendar.component.css']
})
export class OrderDelCalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [], 
    displayEventTime: false,
  };

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadScheduledOrders();
  }

  loadScheduledOrders() {
    // Fetches orders with orderId 4 from  OrderService
    this.orderService.getAllCustomerOrders().subscribe((orders: OrderVM[]) => {
      // This filters our orders with orderStatusID 4 and transforms them into events
      const scheduledOrders = orders
        .filter((order) => order.orderStatusID == 4) 
        .map((order) => ({
          title: `${order.customerFullName}`,
          start: order.deliveryDate, // Uses the deliveryDate as the event start date
        }));

      // Set the events in the calendarOptions
      this.calendarOptions.events = scheduledOrders;
    });
  }
}
