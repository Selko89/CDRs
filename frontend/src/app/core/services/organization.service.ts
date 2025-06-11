import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Organization {
  organizationId: number;
  name: string;
  email: string;
  phoneNumber: string;
  adress: string;
  postCode: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'https://localhost:7097/api/Organization';

  constructor(private http: HttpClient) {}

  getAllOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getOrganization(id: number): Observable<Organization> {
    return this.http.get<Organization>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createOrganization(organization: Organization): Observable<Organization> {
    return this.http.post<Organization>(this.apiUrl, organization).pipe(
      catchError(this.handleError)
    );
  }

  updateOrganization(organization: Organization): Observable<Organization> {
    return this.http.put<Organization>(this.apiUrl, organization).pipe(
      catchError(this.handleError)
    );
  }

  deleteOrganization(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.status === 401) {
      errorMessage = 'Please log in to perform this action';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to perform this action';
    } else if (error.status === 404) {
      errorMessage = error.error || 'Organization not found';
    } else if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = error.error || `Server error: ${error.status}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}