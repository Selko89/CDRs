import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  template: `
    <h2>Unauthorized Access</h2>
    <p>You do not have permission to view this page.</p>
    <a mat-button routerLink="/home">Go to Home</a>
  `
})
export class Unauthorized {}