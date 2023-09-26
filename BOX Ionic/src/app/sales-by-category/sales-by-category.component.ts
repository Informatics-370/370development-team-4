import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { SalesByCategoryVM } from '../shared/sales-by-category-vm';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sales-by-category',
  templateUrl: './sales-by-category.component.html',
  styleUrls: ['./sales-by-category.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class SalesByCategoryComponent  implements OnInit {

  //datesForm
  datesForm: FormGroup;
  invalid = false;
  loading = false;
  salesByItems: SalesByCategoryVM[] = [];
  salesByCategoryTableVMs: {
    description: string,
    total: number,
    salesByItem: SalesByCategoryVM[]
  }[] = [];
  grandTotal = 0;
  itemsCount = -1;
  apiUrl = 'http://localhost:5116/api/';

  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) {
    this.datesForm = this.formBuilder.group({
      startDate: ['2023-01-01', Validators.required],
      endDate: [formatDate(new Date(Date.now()), 'yyyy-MM-dd', 'en'), Validators.required]
    });
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  GetSalesByCategoryReport(stringStartDate: string, stringEndDate: string): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.apiUrl}Reports/GetSalesByCategoryReport/${stringStartDate}/${stringEndDate}`);
  }

  generateReport() {
    //get form data
    const formData = this.datesForm.value;
    if (this.datesForm.valid && formData.startDate != '' && formData.endDate != '') {
      this.loading = true;

      this.GetSalesByCategoryReport(formData.startDate, formData.endDate).subscribe((result) => {
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
