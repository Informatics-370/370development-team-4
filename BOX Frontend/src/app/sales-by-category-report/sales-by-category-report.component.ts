import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesByCategoryVM } from '../shared/sales-by-category-vm';
import jsPDF from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-sales-by-category-report',
  templateUrl: './sales-by-category-report.component.html',
  styleUrls: ['./sales-by-category-report.component.css']
})
export class SalesByCategoryReportComponent {
  //datesForm
  datesForm: FormGroup;
  invalid = false;
  loading = false;
  salesByItems: SalesByCategoryVM[] = [];
  /* salesByCategoryTableVMs: {
    description: '',
    total: 0,
    percentage: 0,
    salesByItem: []
  }[] = []; */
  salesByCategoryTableVMs: {
    description: string,
    total: number,
    salesByItem: SalesByCategoryVM[]
  }[] = [];
  grandTotal = 0;
  itemsCount = -1;
  now = new Date(Date.now());

  generateClicked = false;

  constructor(private dataService: DataService, private formBuilder: FormBuilder) {

    this.datesForm = this.formBuilder.group({
      startDate: ['2023-01-01', Validators.required],
      endDate: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required]
    });
  }

  generateReport() {
    //get form data
    const formData = this.datesForm.value;
    if (this.datesForm.valid && formData.startDate != '' && formData.endDate != '') {
      this.loading = true;

      this.dataService.GetSalesByCategoryReport(formData.startDate, formData.endDate).subscribe((result) => {
        let salesPerItem = result;
        this.itemsCount = salesPerItem.length;

        if (this.itemsCount == 0) return;

        // Group the items by categoryID
        const groupedByCategory: Record<number, SalesByCategoryVM[]> = salesPerItem.reduce((cat, item) => {
          if (!cat[item.categoryID]) {
            cat[item.categoryID] = [];
          }
          cat[item.categoryID].push(item);
          return cat;
        }, {});

        this.salesByCategoryTableVMs = Object.entries(groupedByCategory).map(
          ([categoryID, items]) => ({
            description: items[0].categoryDescription,
            total: this.sum(items),
            salesByItem: items as SalesByCategoryVM[],
          })
        );

        this.grandTotal = this.getGrandTotal();
        this.generateClicked = true;

      });

      this.loading = false;
    }
    else this.invalid = true;
  }

  //get total of each category
  sum(salesByItemList: SalesByCategoryVM[]): number {
    let total = 0;

    salesByItemList.forEach(listItem => {
      total += listItem.sales;
    });

    return total;
  }

  getGrandTotal(): number {
    let grandTotal = 0;

    this.salesByCategoryTableVMs.forEach(cat => {
      grandTotal += cat.total;
    });

    return grandTotal;
  }

  get startDate() { return this.datesForm.get('startDate'); }

  async generatePDFReport() {
    const doc = new jsPDF();

    const imgData = await this.getImageData('../../assets/mega-pack-header.jpg');
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgWidth / 1920) * 700; // Adjust aspect ratio if needed

    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight); // Place image at the top of the page

    const title = 'Sales By Category Report'; // Title
    const generatedOn = `Generated on ${this.now.toLocaleDateString()} at ${this.now.toLocaleTimeString()}`;
    doc.setFontSize(18);
    doc.text(title, 14, imgHeight + 20); // Start text below the image
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(generatedOn, 14, imgHeight + 30); // Start text below the title

    const columns: { header: string; dataKey: string }[] = [
      { header: 'Product Item', dataKey: 'productItem' }, //Product Item
      { header: 'Total Sales', dataKey: 'totalSales' }, //Total Sales
      { header: '% Of Sales', dataKey: '%OfSales' },//% of total sales
    ];

    const data: { productItem: string; totalSales: string; PercentageOfSales: string }[] = [];

    // We Iterate through the sales by category table view models
    this.salesByCategoryTableVMs.forEach(categoryVM => {
      // Iterate through items within the category
      categoryVM.salesByItem.forEach(itemVM => {
        data.push({
          productItem: itemVM.itemDescription,
          totalSales: "R" + itemVM.sales.toString(),
          PercentageOfSales: `${(itemVM.sales / categoryVM.total * 100).toFixed(2)}%`
        });
        // Add a row for the subtotal of the category
        data.push({
          productItem: `Subtotal for ${categoryVM.description}`,
          totalSales: "R" + categoryVM.total.toString(),
          PercentageOfSales: `${(categoryVM.total / this.grandTotal * 100).toFixed(2)}%`
        });

        // Add an empty row as a separator between categories
        data.push({
          productItem: ''
          , totalSales: '',
          PercentageOfSales: ''
        });
      });

      // Remove the last separator row
      data.pop();

    });

    const startY = imgHeight + 40;

    (doc as any).autoTable({
      columns,
      body: data,
      startY,
      didDrawCell: (data: any) => {
        if (data.section == 'head') {
          doc.setTextColor(255); // heading text
          doc.setFillColor(0, 0, 0); // Black background for heading cells
        } else if (data.section == 'body' && data.row.index % 2 == 0) {
          doc.setFillColor(240, 240, 240); // Light gray background for even rows
        } else {
          doc.setFillColor(255, 255, 255); // White background for odd rows
        }
      },
      didParseCell: (data: any) => {
        if (data.section == 'head') {
          data.cell.styles.textColor = 255; // White color for heading text
          data.cell.styles.fillColor = 0; // Black background for heading cells
        }
      }
    });

    doc.save('Mega Pack Sales By Category Report.pdf');
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