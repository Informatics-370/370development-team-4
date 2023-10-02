import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { OrderService } from '../services/orders';
import { OrderVM } from '../shared/order-vm';

@Component({
  selector: 'app-calendar',
  templateUrl: './order-del-calendar.component.html',
  styleUrls: ['./order-del-calendar.component.css']
})
export class OrderDelCalendarComponent implements OnInit {
  unscheduledOrders: OrderVM[] = []; // An array of type OrderView Model to hold all unscheduled orders
  scheduledOrders: OrderVM[] = []; // An array of type OrderView Model which holds all scheduled orders
  currentMonth: Date = new Date();
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weeks: { date: number | null; dayOfWeek: string; isActive: boolean; event: any | null }[][] = [];
  emptyDays: any[] = [];
   
  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadScheduledOrders();

    this.generateCalendar();
  
    const monthYearInput = document.querySelector('.monthHeading');
    if (monthYearInput) {
      monthYearInput.addEventListener('keydown', (event) => {
        if (event instanceof KeyboardEvent) {
          if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default Enter key behavior
            this.updateMonthYear(event);
          }
        }
      });
    }
    this.generateCalendar();

 
  }
  
  private loadScheduledOrders(): void {
    this.orderService.getAllCustomerOrders().subscribe(
      (orders: OrderVM[]) => {
        this.scheduledOrders = orders.filter(order => order.orderStatusID =5);
        // Update the count
        console.log ("scheduled orders"+this.scheduledOrders);
        console.log('Scheduled Orders Count: ' + this.scheduledOrders.length);
      },
      (error) => {
        console.error('Error fetching scheduled orders:', error);
      }
    );
  }
  
  

  generateCalendar() {
    this.weeks = [];
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
  
    let firstDayOfWeek = startDate.getDay();
    if (firstDayOfWeek === 0) {
      firstDayOfWeek = 7; // Adjust to make Sunday correspond to 7
    }
    const numberOfEmptyCells = firstDayOfWeek - 1;
  
    let currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() - numberOfEmptyCells);
  
    let currentWeek: { date: number | null; dayOfWeek: string; isActive: boolean; event: any | null }[] = [];
  
    const isTodayOrLater = (date: Date) => {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      return date >= currentDate;
    };
  
    while (currentDay <= endDate) {
      const isActive = isTodayOrLater(currentDay);
  
      // Check if there is a scheduled order on this day
      const orderOnThisDay = this.scheduledOrders.find((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getDate() === currentDay.getDate() &&
          orderDate.getMonth() === currentDay.getMonth() &&
          orderDate.getFullYear() === currentDay.getFullYear()
        );
      });
  
      currentWeek.push({
        date: currentDay.getDate(),
        dayOfWeek: this.daysOfWeek[currentDay.getDay()],
        isActive: isActive,
        event: orderOnThisDay, // Associate the scheduled order with the day
      });
  
      if (currentDay.getDay() === 6) {
        this.weeks.push(currentWeek);
        currentWeek = [];
      }
  
      currentDay.setDate(currentDay.getDate() + 1);
    }
  
    if (currentWeek.length > 0) {
      this.weeks.push(currentWeek);
    }
  }
  
  

  isDayActive(day: number): boolean {
    const currentDate = new Date();
    const currentYear = this.currentMonth.getFullYear();
    const currentMonth = this.currentMonth.getMonth();

    return (
      (currentYear === currentDate.getFullYear() &&
        currentMonth === currentDate.getMonth() &&
        day >= currentDate.getDate()) ||
      (currentYear === currentDate.getFullYear() &&
        currentMonth > currentDate.getMonth()) ||
      (currentYear > currentDate.getFullYear())
    );
  }

  previousMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.updateHeader();
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.updateHeader();
    this.generateCalendar();
  }

  updateHeader() {
    const headerDate = new Date(this.currentMonth);
    const headerText = headerDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    const headerElement = document.querySelector('.calendar-header h2');
    if (headerElement) {
      headerElement.textContent = headerText;
    }
  }

  getDayOfWeek(day: number): string {
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    return this.daysOfWeek[date.getDay()];
  }

  isCurrentDay(day: number): boolean {
    const currentDate = new Date();
    return (
      day === currentDate.getDate() &&
      this.currentMonth.getMonth() === currentDate.getMonth() &&
      this.currentMonth.getFullYear() === currentDate.getFullYear()
    );
  }

  updateMonthYear(event: any) {
    const inputText = event.target.textContent;
    const inputDate = new Date(inputText);

    if (!isNaN(inputDate.getTime())) {
      this.currentMonth = inputDate;
      this.generateCalendar();
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Please enter a valid date format (e.g., January 2002).',
      }).then(() => {
        this.updateHeader();
      });
    }
  }
  onDropEvent(event: CdkDragDrop<{ name: string; date: string; time: string }[]>) {
    const targetDay = this.weeks[event.currentIndex[0]][event.currentIndex[1]];
    const droppedEvent = event.item.data;

    // Check if the dropped event is being placed on an active day
    if (targetDay.isActive) {
        // Update the target day with the dropped event
        targetDay.event = droppedEvent;

        // Show a SweetAlert dialog
        Swal.fire({
            title: `Schedule Event for ${targetDay.date}`,
            text: `Do you want to schedule this event for ${targetDay.date}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((result) => {
            if (result.isConfirmed) {
                // You can add your scheduling logic here if needed
                Swal.fire('Scheduled!', `Event scheduled for ${targetDay.date}.`, 'success');
            } else {
                // Remove the event from the target day if not scheduled
                targetDay.event = null;
            }
        });
    } else {
        // If dropped on an inactive day, show a message (you can customize this)
        Swal.fire({
            title: 'Invalid Day',
            text: 'You can only schedule events for today and future dates.',
            icon: 'error',
        });
    }
}


  onDragEnd(event: CdkDragDrop<{ name: string; date: string; time: string }[]>) {
    if (event.previousContainer === event.container) {
      // Move within the same container
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Transfer between containers (using the correct function name)
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update the date of the event
      const day = this.weeks[event.currentIndex[0]].find((d) => d.date !== null);
      if (day) {
        event.item.data.date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day.date || 1); // Use a default value if day.date is null
      } else {
        event.item.data.date = null;
      }
    }
  }


}
