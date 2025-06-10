// src/app/components/logout-button/logout-button.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-logout-button', // 👈 Dette er "selector"
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <button mat-button (click)="logout()">Logout</button>
  `
})
export class LogoutButtonComponent {
  constructor(private auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/home']);
  }
}

