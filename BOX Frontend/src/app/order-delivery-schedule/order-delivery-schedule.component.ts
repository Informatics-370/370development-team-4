import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/orders';
import { OrderVM } from '../shared/order-vm';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-order-delivery-schedule',
  templateUrl: './order-delivery-schedule.component.html',
  styleUrls: ['./order-delivery-schedule.component.css']
})
export class OrderDeliveryScheduleComponent implements OnInit {

  unscheduledOrders: OrderVM[] = []; // An array of type OrderView Model to hold all unscheduled orders
  scheduledOrders: OrderVM[] = []; // An array of type OrderView Model which holds all scheduled orders
  unscheduledOrdersCount: number = -1; // Variable to hold the count of unscheduled orders
  loading = true;
  showModal: boolean = false;
  selectedOrder!: OrderVM; 
  scheduleOrderForm: FormGroup;

  constructor(private orderService: OrderService,private formBuilder: FormBuilder,private router:Router) { 
    this.scheduleOrderForm = this.formBuilder.group({
      scheduleDate: [''], 
      driverName: ['']
    });
  }

  openScheduleModal(order: OrderVM) {
    this.selectedOrder = order;
    this.showModal = true;
  }
  navigateToCalendar() {
    this.router.navigate(['/order-calendar']); 
  }

  closeScheduleModal() {
    this.showModal = false;
  }

  ngOnInit(): void {
    // Fetch unscheduled orders and scheduled orders from the database
    this.loadOrders();
  }

  private loadOrders(): void {
    this.orderService.getAllCustomerOrders().subscribe(
      (orders: OrderVM[]) => {
        // Filter orders based on their status (you can adjust this logic as needed)
        this.unscheduledOrders = orders.filter(order => order.orderStatusID == 1);
        this.unscheduledOrdersCount = this.unscheduledOrders.length; // Update the count
        console.log('Unscheduled Orders Count: ' + this.unscheduledOrdersCount);
      this.loading = false;
        
        // this.scheduledOrders = orders.filter(order => order.orderStatusID == 4);
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  scheduleOrder() {
    if (this.selectedOrder) {
      const scheduleDate = this.scheduleOrderForm.get('scheduleDate')?.value;
      const driverName = this.scheduleOrderForm.get('driverName')?.value;
  
      // Check if scheduleDate is a valid date string and create a Date object
      const parsedScheduleDate = new Date(scheduleDate);
  
      if (!isNaN(parsedScheduleDate.getTime())) {
        // Schedule date is a valid Date object
        const newStatusId = 4; 
  
        // First, update the order status
        this.orderService.updateOrderStatus(
          this.selectedOrder.customerOrderID,
          newStatusId // Pass the new status ID
        ).subscribe(
          () => {
            // Once the order status is updated, update the delivery date
            this.orderService.updateDeliveryDate(
              this.selectedOrder.customerOrderID,
              parsedScheduleDate,
            ).subscribe(
              () => {
                // Update the order in your local data
                this.selectedOrder.deliveryDate = parsedScheduleDate;
                this.selectedOrder.orderStatusID = newStatusId; // Update the order status
                console.log('The new date is:', this.selectedOrder.deliveryDate);
                console.log('The new status is:', this.selectedOrder.orderStatusID);
  
                // Close the modal
                this.closeScheduleModal();
  
                // Display SweetAlert with scheduled date
                Swal.fire({
                  icon: 'success',
                title: 'Scheduling Success!',
                  text: `Order Successfully Scheduled for ${parsedScheduleDate.toDateString()}`, 
                });
              },
              (error) => {
                console.error('Error scheduling order:', error);
              }
            );
          },
          (error) => {
            console.error('Error updating order status:', error);
          }
        );
      } else {
        // Handle the case where scheduleDate is not a valid date
        console.error('Invalid scheduleDate:', scheduleDate);
      }
    }
  
  
  
}













}























































//Code Implementation that was making use of Sweet Alert and full calendar.

// import { Component, OnInit } from '@angular/core';
// import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
// import { OrderService } from '../services/orders';
// import { OrderVM } from '../shared/order-vm';
// import Swal from 'sweetalert2';


// @Component({
//   selector: 'app-order-delivery-schedule',
//   templateUrl: './order-delivery-schedule.component.html',
//   styleUrls: ['./order-delivery-schedule.component.css']
// })
// export class OrderDeliveryScheduleComponent implements OnInit {

// unscheduledOrders: OrderVM[] = []; // An array of type OrderView Model to hold all unscheduled orders
// scheduledOrders:OrderVM[]=[]; //An array of type OrderView Model which holds all scheduled orders
// public originalStartDate: Date = new Date(); 
// showModal: boolean = false;
// closeModal:boolean=true;

  //This is the plugin coming from the fullcalendar library which allows us to view the full calendar in a grid of days and allows us to navugate to other months
  // calendarOptions: CalendarOptions = {
  //   plugins: [dayGridPlugin, interactionPlugin],
  //   initialView: 'dayGridMonth',
  //   events: [], // Events is what will show up on the calendar, we make it empty to initalise it
    // eventReceive: this.handleEventReceive.bind(this), // This handles what happens when an external event(i.e order) is placed onto the calendar
    // eventDragStop: this.handleEventDragStop.bind(this) // When the event is dropped, i.e when you release your mouse, this code handles what happens when the event has been dropped onto the calendar
  // };


  // constructor(private orderService: OrderService) { }

  // ngOnInit(): void {
  //   // const draggedEventDate = localStorage.getItem('draggedEventDate');
  //   // if (draggedEventDate) {
  //   //   this.calendarOptions.initialDate = new Date(draggedEventDate);
  //   }
  
    // Retrieve saved scheduled orders from local storage
    // const savedScheduledOrders = localStorage.getItem('scheduledOrders');
    // if (savedScheduledOrders) {
    //   this.scheduledOrders = JSON.parse(savedScheduledOrders);
  
    //   // Parse deliveryDate to Date objects
    //   this.scheduledOrders.forEach(order => {
    //     order.deliveryDate = new Date(order.deliveryDate);
    //   });
  
    //   this.calendarOptions.events = this.scheduledOrders.map((order) => ({
    //     title: `Order ${order.customerOrderID}`,
    //     start: order.deliveryDate,
    //     end: order.deliveryDate
    //   }));
    // }
  
    // this.loadOrders(); // Fetch unscheduled orders from the database
  
  
    // console.log('Calendar events:', this.calendarOptions.events);
    // console.log('Saved scheduled orders:', savedScheduledOrders);
  
  
  

  // ngAfterViewInit(): void {
  //   // This takes items with the ID of  external events list and makes them draggable, it then ensures an fc event, i.e full calendar event is draggable and droppable
  //   const externalEventsList = document.getElementById('external-events-list');
  //   if (externalEventsList) {
  //     new Draggable(externalEventsList, {
  //       itemSelector: '.fc-event',
  //       eventData: function(eventEl) {
  //         return {
  //           title: eventEl.innerText.trim(),//This ensures that we can actually use and retrieve the order's ID and the cus name once it has been attached to the calendar
  //         };
  //       }
  //     });
  //   }
  // }

  // private loadOrders(): void {
  //this.orderService.getAllCustomerOrders().subscribe(
  //     (orders: OrderVM[]) => {
  //        this.unscheduledOrders = orders.filter(order => order.orderStatusID == 1)
  //       //  this.unscheduledOrders = orders;
  //       this.scheduledOrders=orders.filter(order=>order.orderStatusID==4)
        
  //       ;
  //   }

  //Ww are only showing orders with an Order ID of 1= Placed

        // I am now mapping orders for the calendar by transforming the object
        // this.calendarOptions.events = this.scheduledOrders.map((order) => ({
        //   title: `Order ${order.customerOrderID}`,
        //   start: new Date(order.deliveryDate), // Convert to Date object
        //   end: new Date(order.deliveryDate),
        //   editable:true
        // }));
  
        // Populate unscheduledOrders with only filtered orders
        // this.unscheduledOrders = this.unscheduledOrders;
    //   },
    //   (error) => {
    //     console.error('Error fetching orders:', error);
    //   }
    // );
  // }
  // handleEventReceive(info: any) {
  //   const title = info.event.title; // Title contains the order ID
  //   const orderId = parseInt(title.replace('Order ', ''), 10); // Extract order ID from title
  //   const scheduledDate = info.event.start.toISOString(); // Convert to ISO string
    
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: `Do you want to schedule Order ${orderId} for ${scheduledDate}?`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.orderService.updateDeliveryDate(orderId, info.event.start).subscribe(
  //         () => {
  //           const updatedOrder = this.unscheduledOrders.find(order => order.customerOrderID == orderId);
  //           if (updatedOrder) {
  //             updatedOrder.deliveryDate = new Date(scheduledDate); // Update the deliveryDate as a Date object
  //             // Remove the order from unscheduledOrders and add it to scheduledOrders
  //             this.unscheduledOrders = this.unscheduledOrders.filter(order => order.customerOrderID !== orderId);
  //             this.scheduledOrders.push(updatedOrder);
  //             // Update the calendar events with the new delivery date
  //             this.calendarOptions.events = this.scheduledOrders.map((order) => ({
  //               title: `Order ${order.customerOrderID}`,
  //               start: order.deliveryDate,
  //               end: order.deliveryDate,
  //               editable: true
  //             }));
  //             // Update local storage with scheduled orders
  //             localStorage.setItem('scheduledOrders', JSON.stringify(this.scheduledOrders));
  //             console.log("This is the time for info.event.start:", info.event.start)
  //           }
  //         },
  //         (error) => {
  //           console.error('Error updating delivery date:', error);
  //           info.revert(); // Revert the event to its original position
  //         }
  //       );
  //     } else {
  //       info.revert(); // Revert the event to its original position
  //     }
  //   });
  // }
  
  
  
  
  // handleEventDragStart(info: any) {
  //   this.originalStartDate = info.event.start; // Capture the original start date
  // }


  // handleEventDragStop(info: any) {
  //   const newStartDate = info.event.start;

  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: `Do you want to move the delivery of Order ${info.event.title} from ${this.originalStartDate.toLocaleDateString()} to ${newStartDate.toLocaleDateString()}?`,
  //     icon: 'question',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes',
  //     cancelButtonText: 'No'
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const orderId = parseInt(info.event.title.replace('Order ', ''), 10);
  
  //       this.orderService.updateDeliveryDate(orderId, newStartDate).subscribe(
  //         () => {
  //           const updatedOrder = this.scheduledOrders.find(order => order.customerOrderID == orderId);
  //           if (updatedOrder) {
  //             updatedOrder.deliveryDate = newStartDate;
  
  //             // Update the calendar events and the local scheduledOrders array simultaneously
  //             this.calendarOptions.events = this.scheduledOrders.map((order) => ({
  //               title: `Order ${order.customerOrderID}`,
  //               start: order.deliveryDate,
  //               end: order.deliveryDate,
  //               editable: true
  //             }));
  
  //             localStorage.setItem('scheduledOrders', JSON.stringify(this.scheduledOrders));
  //           }
  //         },
  //         (error) => {
  //           console.error('Error updating delivery date:', error);
  //           info.revert();
  //         }
  //       );
  //     } else {
  //       info.revert();
  //     }
  //   });
  // }


//   )}


  
// }