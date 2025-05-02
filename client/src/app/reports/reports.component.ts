import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { environment } from '../../environments/environment';

Chart.register(...registerables);

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  chart: any;
  chartData: any = null;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchChartData();
  }

  fetchChartData(): void {
    // In a real app, this would be an HTTP call
    // this.http.get<any>('/api/reports/data').subscribe(data => {
    //   this.chartData = data;
    //   this.createChart();
    // });

    // Using mock data for now
    this.http.get<any>(`${environment.apiUrl}/chart/2/3`).subscribe({
      next: (data) => {
        if (data) {
          this.chartData = {
            labels: [...data[0]['labels']],
            datasets: [
              {
                label: 'Line Chart of Cumulative Donations Over Time',
                data: [...data[0]['data']],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
            ],
          };
          this.createChart();
        }
      },
      error: (error) => {
        console.error('Error fetching chart data:', error);
        this.chartData = {
          labels: [],
          datasets: [],
        };
        this.createChart();
      },
    });
  }

  createChart(): void {
    const canvas = document.getElementById(
      'reports-chart'
    ) as HTMLCanvasElement;
    if (canvas) {
      this.chart = new Chart(canvas, {
        type: 'bar',
        data: this.chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Donations in Millions (USD)',
              },
            },
          },
        },
      });
    }
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
