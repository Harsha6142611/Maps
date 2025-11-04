import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app">
      <header>
        <div class="container">
          <h1>🗺️ Maps Library Comparison</h1>
          <p style="color: #666; margin-bottom: 20px;">
            Compare Leaflet and MapLibre for your region-wise data visualization
          </p>
        </div>
      </header>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    header h1 {
      color: white;
      margin-bottom: 10px;
    }

    .app {
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Maps Comparison';
}

