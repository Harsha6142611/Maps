import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'leaflet',
    loadComponent: () => import('./leaflet-map/leaflet-map.component').then(m => m.LeafletMapComponent)
  },
  {
    path: 'maplibre',
    loadComponent: () => import('./maplibre-map/maplibre-map.component').then(m => m.MaplibreMapComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

