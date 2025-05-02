import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface Article {
  url: any;
  id: string;
  title: string;
  content: string;
  date: Date;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  articleForm: FormGroup;
  articles: Article[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.articleForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', [Validators.required, Validators.minLength(20)]],
      author: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Load any existing articles
    this.loadArticles();
  }

  loadArticles(): void {
    this.http.get<Article[]>(`${environment.apiUrl}/scrape-news`).subscribe({
      next: (data) => {
        console.log('Articles loaded from API:', data);

        this.articles = data;
      },
      error: (err) => {
        console.error('Error loading articles', err);
        // Load mock data if API call fails

        this.articles = [
          {
            id: '1',
            title: 'UNCC Receives $25 Million Grant for AI Research Center',
            content:
              'The University of North Carolina at Charlotte has been awarded a $25 million grant from the National Science Foundation to establish a new Center for Artificial Intelligence and Machine Learning. The center will focus on developing AI solutions for urban infrastructure, healthcare, and cybersecurity challenges.',
            date: new Date('2025-04-10'),
            url: 'https://www.uncc.edu/news/2025/04/10/uncc-ai-research-center',
          },
          {
            id: '2',
            title: "UNCC Men's Soccer Team Advances to NCAA Finals",
            content:
              "For the first time in university history, the UNCC men's soccer team has advanced to the NCAA championship finals after a thrilling 2-1 victory over Duke University. Head Coach Kevin Langan praised the team's perseverance and teamwork throughout the tournament.",
            date: new Date('2025-04-15'),
            url: 'https://www.uncc.edu/news/2025/04/15/uncc-soccer-ncaa-finals',
          },
        ];
      },
    });
  }

  createArticle(): void {
    if (this.articleForm.invalid) return;

    // Add the new article to the top of the list
    this.articles = [...this.articles];

    // Reset the form
    this.articleForm.reset();

    // In a real application, you would save this to your backend
    // this.articleService.createArticle(newArticle).subscribe(...)
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
