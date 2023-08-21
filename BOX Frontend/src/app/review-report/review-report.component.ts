import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-review-report',
  templateUrl: './review-report.component.html',
  styleUrls: ['./review-report.component.css']
})
export class ReviewReportComponent implements OnInit {
  sentimentData: number[] = [];
  labels: string[] = ['Highly Negative', 'Negative', 'Neutral', 'Positive', 'Highly Positive'];
  colors: string[] = ['#2E0219', '#5E5E5E', '#BCD979', '#BFDBF7', '#00CCC9'];
  chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false
  };
  canvas: any;
  averageRating!: number;
  recommendPercentage!: number;
  nonRecommendPercentage!: number;

  constructor(private http: HttpClient) {}


  ngOnInit(): void {
    this.fetchSentimentData();
    this.fetchAdditionalData();
  }

  fetchSentimentData() {
    this.http.get<number[]>('http://localhost:5116/api/Sentiment').subscribe(
      (data) => {
        this.sentimentData = data;
        this.updateChart();
      },
      (error) => {
        console.error('Error fetching sentiment data:', error);
      }
    );
  }

  updateChart() {
    const canvas: any = document.getElementById('sentimentChart');
    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.sentimentData,
            backgroundColor: this.colors
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Company Performance Based on Customer Reviews  '
          }
        }
      }
    });
  }

  fetchAdditionalData() {
    // Fetch average rating
    this.http.get<number>('http://localhost:5116/api/Sentiment/average-rating').subscribe(
      (rating) => {
        this.averageRating = rating;
      },
      (error) => {
        console.error('Error fetching average rating:', error);
      }
    );

    // Fetch recommendation percentage
    this.http.get<number>('http://localhost:5116/api/Sentiment/recommendation-percentage').subscribe(
      (percentage) => {
        this.recommendPercentage = percentage;
      },
      (error) => {
        console.error('Error fetching recommendation percentage:', error);
      }
    );

    // Fetch non-recommendation percentage
    this.http.get<number>('http://localhost:5116/api/Sentiment/non-recommendation-percentage').subscribe(
      (percentage) => {
        this.nonRecommendPercentage = percentage;
      },
      (error) => {
        console.error('Error fetching non-recommendation percentage:', error);
      }
    );
  }

  downloadReport() {
    const docDefinition = {
      content: [
        { text: 'Customer Review Report', style: 'header' },
        { text: 'Sentiment Chart', style: 'subheader' },
        {
          image: this.canvas.toDataURL(),
          width: 400,
          height: 400
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        }
      }
    };


  }


}
