import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-calendar',
  templateUrl: './order-del-calendar.component.html',
  styleUrls: ['./order-del-calendar.component.css']
})
export class OrderDelCalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weeks: { date: number | null; dayOfWeek: string; isActive: boolean; event: any | null }[][] = [];
  emptyDays: any[] = [];
  unscheduledEvents: any[] = [  
  {
    name: "Event 1",
    date: "September 25, 2023",
    time: "2:00 PM - 4:00 PM"
  },
  {
    name: "Event 2",
    date: "September 27, 2023",
    time: "10:00 AM - 12:00 PM"
  },
  // Add more events here
];
  
  constructor() { }

  ngOnInit(): void {
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
  }

  generateCalendar() {
    this.weeks = [];
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    let firstDayOfWeek = startDate.getDay();
    if (firstDayOfWeek === 0) {
        firstDayOfWeek = 8;
    }
    const numberOfEmptyCells = firstDayOfWeek; // Having the number of empty cells equated to the first day of the week and making it the 8th day correctly initializes the calendar to handle months that end with 30 or 31 days accordingly

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
        currentWeek.push({
            date: currentDay.getDate(),
            dayOfWeek: this.daysOfWeek[currentDay.getDay()],
            isActive: isActive,
            event: null, // Initialize event property to null for each day
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
