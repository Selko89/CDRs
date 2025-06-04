// src/app/layout/layout.ts

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Car Auction</h1>
        <!-- You can add login button here -->
      </header>

      <main class="page-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="page-footer">
        <p>© 2025 Car Auction - All rights reserved</p>
      </footer>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      height: 100vh; /* full viewport height */
    }
    .page-header, .page-footer {
      background-color: #222;
      color: white;
      padding: 1rem;
      flex-shrink: 0;
    }
    .page-content {
      flex-grow: 1;
      overflow-y: auto;
      padding: 1rem;
      background-color: #f9f9f9;
    }
  `]
})
export class Layout {}
