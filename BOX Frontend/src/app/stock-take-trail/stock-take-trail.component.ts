import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.services';

interface StockTake {
  stockTakeID: number;
  userId: string;
  userName: string;
  date: string;
}

@Component({
  selector: 'app-stock-take-trail',
  templateUrl: './stock-take-trail.component.html',
  styleUrls: ['./stock-take-trail.component.css']
})
export class StockTakeTrailComponent implements OnInit {
  stockTakes: StockTake[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchAllStockTakes();
  }

  fetchAllStockTakes() {
    this.dataService.getAllStockTake().subscribe(
      (stockTakes: StockTake[]) => {
        this.stockTakes = stockTakes;
      },
      (error) => {
        console.error('Error fetching stock takes:', error);
      }
    );
  }

  goBack() {
    
  }
}
