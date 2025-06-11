// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7097/api/auth';
  private _email: string | null = null;
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('AuthService init, isLoggedIn:', this.isLoggedInSubject.value);
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(res => {
          console.log('Login response:', res);
          if (res && res.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('email', email);
            this._email = email;
            this.isLoggedInSubject.next(true);
            console.log('After login, isLoggedIn:', this.isLoggedInSubject.value);
          } else {
            console.error('No token in response');
          }
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this._email = null;
    this.isLoggedInSubject.next(false);
    console.log('After logout, isLoggedIn:', this.isLoggedInSubject.value);
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
  getUserRoles(): string[] {
    const token = this.token;
    if (!token) return [];
    try {
      const decoded = jwtDecode<{ role: string | string[] }>(token);
      return Array.isArray(decoded.role) ? decoded.role : decoded.role ? [decoded.role] : [];
    } catch {
      return [];
    }
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some(role => roles.includes(role));
  }

  getUserInfo(): { email: string; firstName: string; lastName: string } | null {
    const token = this.token;
    if (!token) return null;
    try {
      const decoded = jwtDecode<{ email: string; firstName: string; lastName: string }>(token);
      return {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName
      };
    } catch {
      return null;
    }
  }
}


