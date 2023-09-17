import { Component } from '@angular/core';
import { DataService } from '../services/data.services';
import { take, lastValueFrom } from 'rxjs';
import { FixedProductVM } from '../shared/fixed-product-vm';
import { RawMaterialVM } from '../shared/rawMaterialVM';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-product-list-report',
  templateUrl: './product-list-report.component.html',
  styleUrls: ['./product-list-report.component.css']
})
export class ProductListReportComponent {
  //messages to user
  loading = false;
  productCount = -1;

  rawMaterials: RawMaterialVM[] = [];
  fixedProducts: FixedProductVM[] = [];
  totalQuantity = 0; //total quantity on hand
  now = new Date(Date.now()); //date report is generated

  constructor(private dataService: DataService) { }
  generateClicked = false;

  async generateReport() {
    //turn Observables that retrieve data from DB into promises
    const getFixedProductsPromise = lastValueFrom(this.dataService.GetAllFixedProducts().pipe(take(1)));
    const getRawMaterialsPromise = lastValueFrom(this.dataService.GetAllRawMaterials().pipe(take(1)));

    const [allFP, allRM] = await Promise.all([
      getFixedProductsPromise,
      getRawMaterialsPromise,
    ]);

    //put results from DB in global arrays
    this.fixedProducts = allFP;
    console.log('All fixed products:', this.fixedProducts);
    this.rawMaterials = allRM;
    console.log('All raw materials:', this.rawMaterials);
    this.productCount = this.fixedProducts.length + this.rawMaterials.length;

    this.totalQuantity = this.calculateTotal();
    this.generateClicked = true;
  }

  calculateTotal(): number {
    let qty = 0;

    this.fixedProducts.forEach(prod => {
      qty += prod.quantityOnHand;
    });

    this.rawMaterials.forEach(rm => {
      qty += rm.quantityOnHand;
    });

    return qty;
  }

  async generatePDFReport() {
    const doc = new jsPDF();

    const imgData = await this.getImageData('../../assets/mega-pack-header.jpg');
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgWidth / 1920) * 700; // Adjust aspect ratio if needed

    doc.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight); // Place image at the top of the page

    const title = 'Product List Report';
    const generatedOn = `Generated on ${this.now.toLocaleDateString()} at ${this.now.toLocaleTimeString()}`;
    doc.setFontSize(18);
    doc.text(title, 14, imgHeight + 20); // Start text below the image
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(generatedOn, 14, imgHeight + 30); // Start text below the title

    const columns: { header: string; dataKey: string }[] = [
      { header: 'Product', dataKey: 'product' },
      { header: 'Quantity on Hand', dataKey: 'quantity' },
    ];

    const data: { product: string; quantity: string }[] = [];

    this.fixedProducts.forEach(prod => {
      data.push({ product: prod.description, quantity: prod.quantityOnHand.toString() });
    });

    this.rawMaterials.forEach(mat => {
      data.push({ product: mat.description, quantity: mat.quantityOnHand.toString() });
    });

    const startY = imgHeight + 40;

    (doc as any).autoTable({
      columns,
      body: data,
      startY,
      didDrawCell: (data: any) => {
        if (data.section == 'head') {
          doc.setTextColor(255); // heading text
          doc.setFillColor(0, 0, 0);   // Black background for heading cells
        } else if (data.section == 'body' && data.row.index % 2 == 0) {
          doc.setFillColor(240, 0, 0); // Light gray background for even rows
        } else {
          doc.setFillColor(255, 0, 0); // White background for odd rows
        }
      },
      didParseCell: (data: any) => {
        if (data.section == 'head') {
          data.cell.styles.textColor = 255; // White color for heading text
          data.cell.styles.fillColor = 0;   // Black background for heading cells
        }
      }
    });

    doc.save('Mega Pack Product List Report.pdf');
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