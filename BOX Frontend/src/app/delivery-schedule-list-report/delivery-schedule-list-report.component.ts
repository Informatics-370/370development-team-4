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
  schedule: DeliveryScheduleReportVM[] = [];
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
    pdf.text(`Order Delivery Schedule for ${this.datePipe.transform(this.now, 'dd/MM/yyyy')}`, 10, yOffset); // Add the text
    yOffset += 10;
    pdf.setFontSize(11);
    pdf.text(`Generated at ${this.datePipe.transform(this.now, 'HH:mm:ss')}`, 10, yOffset);
  
    // Prepare table data
    const headings = ["Order ID", "Address"];
    const rows: any[] = [];
    this.schedule.forEach(order => {
      rows.push(['Order ' + order.orderID, order.customerAddress]);
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
    pdf.save(`Order Delivery Schedule for ${this.datePipe.transform(this.now, 'd MMM yyyy')}.pdf`);
    this.processing = false;
  }

  printQRCode(id: number) {
    let order = this.schedule.find(o => o.orderID == id); //get order to rpint QR code for

    if (order) {
      // Create a new image element for the QR Code
      var qrCodeImage = new Image();
      qrCodeImage.src = `data:image/png;base64,${order.qrCodeB64}`;

      qrCodeImage.onload = function () {
        // Create a canvas element
        var canvas = document.createElement('canvas');
        canvas.width = qrCodeImage.width; // Set canvas width to match QR Code image width
        canvas.height = qrCodeImage.height + 150; // Add extra space for text

        // Get 2D rendering context
        var ctx = canvas.getContext('2d');

        if (ctx) {
          // Draw QR Code image onto canvas
          ctx.drawImage(qrCodeImage, 0, 0, qrCodeImage.width, qrCodeImage.height);

          // Add text below QR Code
          ctx.font = '35px Verdana';
          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.fillText(order ? order.code : 'No code', canvas.width / 2, qrCodeImage.height - 20);

          // Convert canvas to data URL representing a PNG image
          var dataURL = canvas.toDataURL('image/png');
  
          // Create a download link
          var downloadLink = document.createElement('a');
          downloadLink.href = dataURL;
          downloadLink.download = `Order ${order ? order.orderID : ''} QR Code.png`; // Set the desired file name
          downloadLink.click();
        }
      };

    }
  }
}

interface DeliveryScheduleReportVM {
  orderID: number;
  customerID: string;
  customerName: string;
  customerAddress: string;
  qrCodeB64: string;
  code: string;
}
