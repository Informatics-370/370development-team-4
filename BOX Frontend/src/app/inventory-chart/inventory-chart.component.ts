import { Component, OnInit } from '@angular/core';
//import { SignalRService } from '../services/signal-r.service';
import { HttpClient } from '@angular/common/http'
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inventory-chart',
  templateUrl: './inventory-chart.component.html',
})
export class InventoryChartComponent  {
  // private chart!: Chart;
  // private productLabels: string[] = [];
  // private productInventory: number[] = [];

  // constructor(
  //   private signalRService: SignalRService,
  //   private http: HttpClient
  // ) { }

  // ngOnInit() {
  //   // Load initial data from API using HttpClient
  //   this.http.get<any[]>('http://localhost:5116/api/FixedProduct/GetAllFixedProducts')
  //     .subscribe(fixedProducts => {
  //       // Populate initial data from API response
  //       fixedProducts.forEach(fp => {
  //         this.productLabels.push(fp.description);
  //         this.productInventory.push(fp.quantityOnHand);
  //       });

  //       // Setup the chart using initial data
  //       this.setupChart();
  //     });

  //   // Subscribe to real-time updates
  //   this.signalRService.inventoryUpdate$.subscribe(update => {
  //     this.updateChart(update.description, update.newLevel);
  //   });
  // }

  // private setupChart() {
  //   this.chart = new Chart('inventoryChart', {
  //     type: 'bar',
  //     data: {
  //       labels: this.productLabels,
  //       datasets: [{
  //         label: 'Inventory Levels',
  //         data: this.productInventory,
  //         backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //         borderColor: 'rgba(75, 192, 192, 1)',
  //         borderWidth: 1
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         }
  //       }
  //     }
  //   });
  // }

  // private updateChart(description: string, quantityOnHand: number) {
  //   const index = this.productLabels.indexOf(description);

  //   if (index === -1) {
  //     this.productLabels.push(description);
  //     this.productInventory.push(quantityOnHand);
  //   } else {
  //     this.productInventory[index] = quantityOnHand;
  //   }

  //   this.chart.data.labels = this.productLabels;
  //   this.chart.data.datasets[0].data = this.productInventory;
  //   this.chart.update();
  // }
}
