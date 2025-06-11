// src/app/features/login/login.component.ts
import { Component, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {
  auth = inject(AuthService);
  router = inject(Router);
  email = '';
  password = '';
  errorMessage: string | null = null;
  isLoading = false;

  login() {
    this.isLoading = true;
    this.errorMessage = null;
    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Innlogging feilet. Sjekk e-post og passord.';
        console.error('Login error:', err);
      }
    });
  }
}
