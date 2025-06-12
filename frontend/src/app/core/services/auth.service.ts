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
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.token);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log('AuthService initialized. Logged in:', this.isLoggedInSubject.value);
  }

  login(email: string, password: string): Observable<{ result: string }> {
    return this.http.post<{ result: string }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(res => {
        const token = res.result;
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('email', email);
          this._email = email;
          this.isLoggedInSubject.next(true);
          console.log('Login successful. Token stored.');
        } else {
          console.error('Login failed: No token received.');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this._email = null;
    this.isLoggedInSubject.next(false);
    console.log('User logged out.');
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    const token = this.token;
    return !!token && !this.isTokenExpired(token);
  }

  get userEmail(): string | null {
    return this._email ?? localStorage.getItem('email');
  }

  isTokenExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      return Date.now() >= exp * 1000;
    } catch (error) {
      console.error('Invalid token for expiration check:', error);
      return true;
    }
  }

  getUserRoles(): string[] {
    const token = this.token;
    if (!token || this.isTokenExpired(token)) return [];
    try {
      const decoded = jwtDecode<any>(token);
      const roleClaim = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return Array.isArray(roleClaim) ? roleClaim : roleClaim ? [roleClaim] : [];
    } catch (error) {
      console.error('Failed to decode token for roles:', error);
      return [];
    }
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRoles();
    return userRoles.some(role => roles.includes(role));
  }

  getUserInfo(): {
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    postCode: string;
    city: string;
    country: string;
    dateOfBirth: string;
  } | null {
    const token = this.token;
    if (!token || this.isTokenExpired(token)) return null;

    try {
      const decoded = jwtDecode<{
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        address: string;
        postCode: string;
        city: string;
        country: string;
        dateOfBirth: string;
      }>(token);

      return {
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        phoneNumber: decoded.phoneNumber,
        address: decoded.address,
        postCode: decoded.postCode,
        city: decoded.city,
        country: decoded.country,
        dateOfBirth: decoded.dateOfBirth
      };
    } catch (error) {
      console.error('Failed to decode token for user info:', error);
      return null;
    }
  }
}
