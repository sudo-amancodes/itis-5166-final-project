import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey: string = 'auth_token';

  constructor(private http: HttpClient) {}

  signup(username: string, password: string) {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/signup`, {
      username,
      password,
    });
  }

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${environment.apiUrl}/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.storeToken(response.token);
          }
        })
      );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  private storeToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
