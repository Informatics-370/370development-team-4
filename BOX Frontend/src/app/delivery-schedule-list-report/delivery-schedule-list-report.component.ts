import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { AuthService } from '../services/auth.service';
import { Users } from '../shared/user';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-delivery-schedule-list-report',
  templateUrl: './delivery-schedule-list-report.component.html',
  styleUrls: ['./delivery-schedule-list-report.component.css'],
  providers: [DatePipe]
})
export class DeliveryScheduleListReportComponent {
  schedule: any[] = [];
  scheduleCount = -1;
  loading = false; //when report is being generated
  processing = false; //when pdf is being generated and downoloaded
  now = new Date(Date.now()); //date report is generated
  error = false;
  //user data
  driver!: Users;

  constructor(private dataService: DataService, private authService: AuthService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getDriverData();
  }

  async getDriverData() {
    const token = localStorage.getItem('access_token')!;
    let email = this.authService.getEmailFromToken(token);
    if (email) {
      this.driver = await this.authService.getUserByEmail(email);
      let id = await this.authService.getUserIdFromToken(token);
      if (id) this.driver.id = id;

      console.log(this.driver)
    }
  }

  generateReport() {
    this.loading = true;
    try {
      this.dataService.GetDeliveryScheduleListReport().subscribe((result) => {
        this.schedule = result;
        this.loading = false;
        this.scheduleCount = this.schedule.length;
  
        console.log('Schedule list report:', this.schedule);
      });
    } catch (error) {
      this.error = true;
      this.loading = false;
      console.error(error);
    }
  }

  generatePDF() {
    this.processing = true;
  
    // Create PDF
    let pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    let yOffset = 10;

    // Add Mega Pack header to the PDF manually
    let headerImg = document.getElementById("megapack-header") as HTMLImageElement;
    pdf.addImage(headerImg, 'JPG', 10, yOffset, 190, 62.301845, 'aliasIMG', 'FAST');

    //add heading text to pdf
    yOffset += 62.301845 + 20;
    pdf.setFontSize(20); // Set the font size
    pdf.text('Delivery Schedule List Report', 10, yOffset); // Add the text
    yOffset += 10;
    pdf.setFontSize(11);
    pdf.text(`Generated on ${this.datePipe.transform(this.now, 'ccc, d MMM yyyy')} at ${this.datePipe.transform(this.now, 'hh:mm:ss')}`, 10, yOffset);
  
    // Prepare table data
    const headings = ["Order", "Address"];
    const rows: any[] = [];
    this.schedule.forEach(order => {
      rows.push(['Order #' + order.orderID, order.customerAddress]);
    });

    // Set table style options
    (pdf as any).autoTableSetDefaults({
      // Add header row style
      headStyles: {
        fillColor: [214, 173, 96], // Header row background color (RGB: 214, 173, 96) like a btn create
        textColor: 255, //white
        fontStyle: 'bold', // Header row font style (bold)
      },
      //body styles
      bodyStyles: {
        textColor: 0, //black
        fontStyle: 'normal', // Body text font style (normal)
      },
      tableLineColor: 255, //white
      tableLineWidth: 0.1,
    });

    // Add header and data to the PDF
    yOffset += 5;
    (pdf as any).autoTable({
      startY: yOffset,
      head: [headings],
      body: rows,
    });
  
    // Save the PDF with the current date in the filename
    pdf.save(`Delivery schedule list report for ${this.datePipe.transform(this.now, 'd MMM yyyy')}.pdf`);
    this.processing = false;
  }
}
