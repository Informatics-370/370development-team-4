import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { DataService } from '../services/data.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SalesByCategoryVM } from '../shared/sales-by-category-vm';

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
}
