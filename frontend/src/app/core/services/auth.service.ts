import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7097/api/auth'; // Tilpass hvis annet port

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    console.log('Login called with', email);
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => {
        console.log('Login success, received token:', res.token);
        localStorage.setItem('token', res.token);
      }));
  }

  logout() {
    localStorage.removeItem('token');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }
}
