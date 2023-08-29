  import { Component } from '@angular/core';
  import { formatDate } from '@angular/common';
  import { DataService } from '../services/data.services';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { SalesByCategoryVM } from '../shared/sales-by-category-vm';
  import jsPDF from 'jspdf';
  import autoTable from 'jspdf-autotable';
  import * as html2pdf  from 'html2pdf.js';
  import * as XLSX from 'xlsx';

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

    generatePDFReport() {
      const content = document.getElementById('pdf-content');
      
      if (content) {
        html2pdf().from(content).save();
      }
    }    
    
    exportToExcel() {
      const wb = XLSX.utils.book_new();
      const ws_name = 'SalesByCategoryReport';
      const data: (string | number)[][] = []; // Define the type of data
    
      // Add headers
      data.push(['Category Description', 'Product Item', 'Total Sales (ZAR)', '% of Total Sales']);
      
      // Add each row of data
      this.salesByCategoryTableVMs.forEach(cat => {
        cat.salesByItem.forEach(item => {
          data.push([
            cat.description,
            item.itemDescription,
            item.sales,
            (item.sales / this.grandTotal * 100).toFixed(2) + '%'
          ]);
        });
        
        // Add subtotal row
        data.push([
          'Subtotal for ' + cat.description,
          '',
          cat.total,
          (cat.total / this.grandTotal * 100).toFixed(2) + '%'
        ]);
      });
    
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wscols = [
        { wch: 30 }, // Category Description
        { wch: 30 }, // Product Item
        { wch: 20 }, // Total Sales (ZAR)
        { wch: 20 }, // % of Total Sales
      ];
      ws['!cols'] = wscols; // Set column widths
      XLSX.utils.book_append_sheet(wb, ws, ws_name);
      XLSX.writeFile(wb, 'SalesByCategoryReport.xlsx');
    }
    
    
  }
