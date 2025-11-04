import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">

      <div class="card">
        <h2>Choose a Map Library to Explore</h2>
        <div class="nav-buttons">
          <a routerLink="/leaflet" class="btn btn-primary">View Leaflet Demo</a>
          <a routerLink="/maplibre" class="btn btn-secondary">View MapLibre Demo</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h3 {
      font-size: 18px;
    }
  `]
})
export class HomeComponent {}
