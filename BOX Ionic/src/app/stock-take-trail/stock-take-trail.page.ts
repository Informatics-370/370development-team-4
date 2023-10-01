import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface StockTake {
  stockTakeID: number;
  userId: string;
  userName: string;
  date: string;
}

@Component({
  selector: 'app-stock-take-trail',
  templateUrl: './stock-take-trail.page.html',
  styleUrls: ['./stock-take-trail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class StockTakeTrailPage implements OnInit {
  stockTakes: StockTake[] = [];
  apiUrl = 'http://localhost:5116/api/'

  constructor(private httpClient: HttpClient, private router: Router) { }

  ngOnInit() {
    this.fetchAllStockTakes();
  }

  getAllStockTake(): Observable<any> {
    return this.httpClient.get<any>(`${this.apiUrl}StockTake/GetAllStockTake`);
  }

  fetchAllStockTakes() {
    this.getAllStockTake().subscribe(
      (stockTakes: StockTake[]) => {
        this.stockTakes = stockTakes;
      },
      (error) => {
        console.error('Error fetching stock takes:', error);
      }
    );
  }

  goBack() {
    this.router.navigateByUrl('/write-off')
  }
}
