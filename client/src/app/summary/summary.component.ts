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
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
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
    // this.http.get<any>('/api/summary/data').subscribe(data => {
    //   this.chartData = data;
    //   this.createChart();
    // });

    // Using mock data for now
    this.http.get<any>(`${environment.apiUrl}/chart/0/1`).subscribe({
      next: (data) => {
        if (data) {
          console.log('Fetched chart data:', data);
          this.chartData = {
            labels: [...data[0]['labels']],
            datasets: [
              {
                label: 'Number of In-state Candidates',
                data: [...data[0]['data']],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                tension: 0.3,
              },
              {
                label: 'Number of Out-of-state Candidates',
                data: [...data[1]['data']],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                tension: 0.3,
              },
            ],
          };

          // Once data is fetched, create the chart
          this.createChart();
        }
      },
    });
  }

  createChart(): void {
    const canvas = document.getElementById(
      'summary-chart'
    ) as HTMLCanvasElement;
    if (canvas) {
      this.chart = new Chart(canvas, {
        type: 'line',
        data: this.chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Count',
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
