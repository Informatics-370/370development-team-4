import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'; // Import SweetAlert

@Component({
  selector: 'app-calendar',
  templateUrl: './order-del-calendar.component.html',
  styleUrls: ['./order-del-calendar.component.css']
})
export class OrderDelCalendarComponent implements OnInit {
  currentMonth: Date = new Date();
  daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  weeks: { date: number|null; dayOfWeek: string; isActive: boolean }[][] = [];
  emptyDays: any[] = [];
  
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
    const numberOfEmptyCells = firstDayOfWeek ;// Having the number of empty cells equated to the first day of theweek and making it the 8th day correctly initialises the calendar to handle months that end  with 30 or 31 days accordingly
  
    let currentDay = new Date(startDate);
    currentDay.setDate(currentDay.getDate() - numberOfEmptyCells);
  
    let currentWeek: { date: number | null; dayOfWeek: string; isActive: boolean }[] = [];
  
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
        isActive: isActive
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
}
