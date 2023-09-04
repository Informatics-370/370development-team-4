import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services';
import { WriteOffItem } from '../shared/write-off-item';

@Component({
  selector: 'app-write-off-by-product-category',
  templateUrl: './write-off-by-product-category.component.html',
  styleUrls: ['./write-off-by-product-category.component.css']
})
export class WriteOffByProductCategoryComponent implements OnInit {
  loading = false;
  itemsCount = -1;
  writeOffItems: WriteOffItem[] = [];
  categoriesWithSubtotals: CategoryWithSubtotal[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.generateReport();
  }

  generateReport() {
    this.loading = true;

    // Call your API to fetch write-off data
    this.dataService.getWriteOffReport().subscribe(
      (result: WriteOffItem[]) => {
        this.writeOffItems = result;
        this.calculateSubtotals();
        this.loading = false;
      },
      error => {
        console.error('Error fetching write-off data:', error);
        this.loading = false;
      }
    );
  }

  calculateSubtotals() {
    const categoriesMap = new Map<string | null, CategoryWithSubtotal>();
    
    this.writeOffItems.forEach(item => {
      const category = item.category ?? 'Uncategorized'; // Use 'Uncategorized' for null categories

      if (!categoriesMap.has(category)) {
        categoriesMap.set(category, {
          category,
          totalQuantity: 0,
          items: []
        });
      }

      const categoryWithSubtotal = categoriesMap.get(category);
      categoryWithSubtotal!.totalQuantity += item.quantityOnHand;
      categoryWithSubtotal!.items.push(item);
    });

    this.categoriesWithSubtotals = Array.from(categoriesMap.values());
    this.itemsCount = this.writeOffItems.length;
  }
}

interface CategoryWithSubtotal {
  category: string | null;
  totalQuantity: number;
  items: WriteOffItem[];
}
