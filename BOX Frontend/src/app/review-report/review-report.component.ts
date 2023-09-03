import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import jsPDF, { jsPDFAPI } from 'jspdf';

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

    this.canvas = canvas;
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
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text('Customer Review Report', 10, 20);
  
    // Convert the canvas to an image data URL
    const canvasDataURL = this.canvas.toDataURL();
  
    const imgWidth = 180; // Adjust as needed
    const imgHeight = (this.canvas.height / this.canvas.width) * imgWidth;
  
    // Add the image to the PDF with the calculated dimensions
    doc.addImage(canvasDataURL, 'PNG', 10, 50, imgWidth, imgHeight);
  
    // Save the PDF
    doc.save('review_report.pdf');
  }
    


}
