import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7097/api/auth';
  private _email: string | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(tap(res => {
        console.log('Res:' + res);
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', email);
        this._email = email;
      }));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this._email = null;
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get userEmail(): string | null {
    return this._email ?? localStorage.getItem('email');
  }
}


