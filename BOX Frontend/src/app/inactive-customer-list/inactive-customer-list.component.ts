import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-inactive-customer-list',
  templateUrl: './inactive-customer-list.component.html',
  styleUrls: ['./inactive-customer-list.component.css']
})
export class InactiveCustomerListComponent {
  //messages to user
  loading = false;
  userCount = -1;
  inactiveCustomers: any[] = [];
  now = new Date(Date.now()); //date report is generated
  generateClicked = false;

  constructor(private dataService: DataService) { }

  generateReport() {
    this.dataService.GetInactiveCustomerList().subscribe((result) => {
      this.inactiveCustomers = result;
      this.userCount = this.inactiveCustomers.length;
      this.generateClicked = true;
    });
  }

  async generatePDFReport() {
    const doc = new jsPDF();

    const imgData = await this.getImageData('../../assets/mega-pack-header.jpg');
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgWidth / 1920) * 700;

    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    const title = 'Inactive Customer List Report';
    const generatedOn = `Generated on ${this.now.toLocaleDateString()} at ${this.now.toLocaleTimeString()}`;
    doc.setFontSize(18);
    doc.text(title, 14, imgHeight + 20);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(generatedOn, 14, imgHeight + 30);

    if (this.inactiveCustomers.length === 0) {
      doc.setFontSize(14);
      doc.text('No inactive customers found.', 14, imgHeight + 50);
    } else {
      const columns: { header: string; dataKey: string }[] = [
        { header: 'Customer Name', dataKey: 'name' },
        { header: 'Last Activity Date', dataKey: 'lastActivityDate' },
      ];

      const data: { name: string; lastActivityDate: string }[] = [];

      this.inactiveCustomers.forEach(customer => {
        data.push({ name: customer.name, lastActivityDate: customer.lastActivityDate });
      });

      const startY = this.inactiveCustomers.length === 0 ? imgHeight + 40 : imgHeight + 70;

      (doc as any).autoTable({
        columns,
        body: data,
        startY,
        didDrawCell: (data: any) => {
          if (data.section == 'head') {
            doc.setTextColor(255);
            doc.setFillColor(0, 0, 0);
          } else if (data.section == 'body' && data.row.index % 2 == 0) {
            doc.setFillColor(240, 0, 0);
          } else {
            doc.setFillColor(255, 0, 0);
          }
        },
        didParseCell: (data: any) => {
          if (data.section == 'head') {
            data.cell.styles.textColor = 255;
            data.cell.styles.fillColor = 0;
          }
        }
      });
    }

    doc.save('Mega Pack Inactive Customer List Report.pdf');
  }

  async getImageData(url: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx: any = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        resolve(dataUrl);
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }
}