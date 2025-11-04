import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { MapConfigService } from '../services/map-config.service';
import { BoundaryService } from '../services/boundary.service';
import { MapConfig } from '../models/map-data.model';
import { BoundaryLayer } from '../models/boundary.model';

@Component({
  selector: 'app-leaflet-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="nav-buttons">
        <a routerLink="/" class="btn btn-secondary">← Back to Home</a>
        <a routerLink="/maplibre" class="btn btn-primary">Compare with MapLibre →</a>
      </div>

      <div class="card">
        <h2>Leaflet Map - Region-wise Data Visualization</h2>
        <div id="leaflet-map" class="map-container"></div>
      </div>
    </div>
  `,
  styles: [`
    h3 {
      color: #333;
      font-size: 18px;
    }
    
    code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 14px;
      color: #d63384;
    }
  `]
})
export class LeafletMapComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private config!: MapConfig;
  private boundaryLayers: Array<{ layer: L.Layer, config: any }> = [];

  constructor(
    private configService: MapConfigService,
    private boundaryService: BoundaryService
  ) {}

  ngOnInit(): void {
    this.config = this.configService.getConfig();
    this.initMap();
    this.addMarkers();
    this.addBoundaries();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    // Initialize map with configured center and zoom
    this.map = L.map('leaflet-map', {
      center: [this.config.center.lat, this.config.center.lng],
      zoom: this.config.zoom
    });

    // Add OpenStreetMap tiles (free, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Listen to zoom changes to show/hide layers based on zoom level
    this.map.on('zoomend', () => {
      this.updateLayerVisibility();
    });
  }

  private addMarkers(): void {
    this.config.data.forEach(region => {
      const iconConfig = this.configService.getIconForData(region);
      const icon = this.createLeafletIcon(iconConfig);
      
      // Create marker
      const marker = L.marker([region.lat, region.lng], {
        icon: icon
      }).addTo(this.map);

      // Generate and bind popup using config service
      const popupHtml = this.configService.generatePopupHtml(region);
      marker.bindPopup(popupHtml);
    });
  }

  private createLeafletIcon(iconConfig: any): L.Icon | L.DivIcon {
    switch (iconConfig.type) {
      case 'emoji':
        return L.divIcon({
          className: 'custom-emoji-marker',
          html: `
            <div style="
              font-size: 24px;
              text-align: center;
              line-height: 1;
              transition: transform 0.2s;
            ">${iconConfig.emoji || '📍'}</div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        
      case 'url':
        return L.icon({
          iconUrl: iconConfig.iconUrl,
          iconSize: iconConfig.iconSize || [32, 32],
          iconAnchor: iconConfig.iconAnchor || [16, 32]
        });
        
      case 'svg':
        return L.divIcon({
          className: 'custom-svg-marker',
          html: iconConfig.svg,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });
        
      case 'colored-circle':
      default:
        const size = iconConfig.size || 20;
        return L.divIcon({
          className: 'custom-circle-marker',
          html: `
            <div style="
              background-color: ${iconConfig.color || '#007bff'};
              width: ${size}px;
              height: ${size}px;
              border-radius: 50%;
              border: ${iconConfig.borderWidth || 3}px solid ${iconConfig.borderColor || 'white'};
              box-shadow: 0 2px 5px rgba(0,0,0,0.3);
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'"></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });
    }
  }

  private addBoundaries(): void {
    if (!this.config.boundaryLayers || this.config.boundaryLayers.length === 0) {
      return;
    }

    this.config.boundaryLayers.forEach((layerConfig: any) => {
      if (!layerConfig.visible) {
        return;
      }

      this.boundaryService.loadBoundaryData(layerConfig.geoJsonUrl).subscribe({
        next: (geoJsonData) => {
          const layer = L.geoJSON(geoJsonData as any, {
            style: () => ({
              color: layerConfig.style.color,
              weight: layerConfig.style.weight,
              opacity: layerConfig.style.opacity,
              fillColor: layerConfig.style.fillColor,
              fillOpacity: layerConfig.style.fillOpacity || 0.1,
              dashArray: layerConfig.style.dashArray
            }),
            onEachFeature: (feature, layer) => {
              if (layerConfig.interactive !== false) {
                const popupContent = layerConfig.popupTemplate
                  ? layerConfig.popupTemplate(feature.properties)
                  : this.boundaryService.generateBoundaryPopup(feature.properties);

                layer.bindPopup(popupContent);

                // Add hover effect
                if (layerConfig.onHover && layerConfig.highlightStyle) {
                  layer.on({
                    mouseover: (e: any) => {
                      const target = e.target;
                      target.setStyle({
                        color: layerConfig.highlightStyle.color,
                        weight: layerConfig.highlightStyle.weight,
                        opacity: layerConfig.highlightStyle.opacity,
                        fillColor: layerConfig.highlightStyle.fillColor,
                        fillOpacity: layerConfig.highlightStyle.fillOpacity || 0.3
                      });
                      target.bringToFront();
                    },
                    mouseout: (e: any) => {
                      const target = e.target;
                      target.setStyle({
                        color: layerConfig.style.color,
                        weight: layerConfig.style.weight,
                        opacity: layerConfig.style.opacity,
                        fillColor: layerConfig.style.fillColor,
                        fillOpacity: layerConfig.style.fillOpacity || 0.1
                      });
                    }
                  });
                }
              }
            }
          });

          // Store layer with its config for zoom-based visibility
          this.boundaryLayers.push({ layer, config: layerConfig });

          // Add to map if zoom level is appropriate
          if (this.shouldShowLayer(layerConfig)) {
            layer.addTo(this.map);
          }
        },
        error: (error) => {
          console.error(`Error loading boundary layer ${layerConfig.name}:`, error);
        }
      });
    });
  }

  private shouldShowLayer(layerConfig: any): boolean {
    const currentZoom = this.map.getZoom();
    const minZoom = layerConfig.minZoom !== undefined ? layerConfig.minZoom : 0;
    const maxZoom = layerConfig.maxZoom !== undefined ? layerConfig.maxZoom : 22;
    
    return currentZoom >= minZoom && currentZoom <= maxZoom;
  }

  private updateLayerVisibility(): void {
    this.boundaryLayers.forEach(({ layer, config }) => {
      if (this.shouldShowLayer(config)) {
        if (!this.map.hasLayer(layer)) {
          layer.addTo(this.map);
        }
      } else {
        if (this.map.hasLayer(layer)) {
          this.map.removeLayer(layer);
        }
      }
    });
  }
}
