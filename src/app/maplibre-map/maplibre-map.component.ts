import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as maplibregl from 'maplibre-gl';
import { MapConfigService } from '../services/map-config.service';
import { BoundaryService } from '../services/boundary.service';
import { MapConfig } from '../models/map-data.model';

@Component({
  selector: 'app-maplibre-map',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="nav-buttons">
        <a routerLink="/" class="btn btn-secondary">← Back to Home</a>
        <a routerLink="/leaflet" class="btn btn-primary">Compare with Leaflet →</a>
      </div>

      <div class="card">
        <h2>MapLibre GL - 3D Visualization</h2>
        
        <!-- 3D Controls -->
        <div class="controls-3d">
          <div class="control-group">
            <label>🎥 Pitch (Tilt)</label>
            <div class="button-group">
              <button (click)="setPitch(0)" [class.active]="currentPitch === 0">Flat</button>
              <button (click)="setPitch(30)" [class.active]="currentPitch === 30">30°</button>
              <button (click)="setPitch(45)" [class.active]="currentPitch === 45">45°</button>
              <button (click)="setPitch(60)" [class.active]="currentPitch === 60">60°</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>🧭 Rotate</label>
            <div class="button-group">
              <button (click)="rotate(-45)">↶ Left</button>
              <button (click)="resetBearing()">Reset</button>
              <button (click)="rotate(45)">↷ Right</button>
            </div>
          </div>
          
          <div class="control-group">
            <label>🏢 3D Mode</label>
            <div class="button-group">
              <button (click)="toggle3DMode()" [class.active]="is3DMode">
                {{ is3DMode ? '3D Extrusions ON' : '3D Extrusions OFF' }}
              </button>
            </div>
          </div>
        </div>
        <div id="maplibre-map" class="map-container"></div>
      </div>
    </div>
  `,
  styles: [`
    h3 {
      color: #333;
      font-size: 18px;
    }
    
    #maplibre-map {
      cursor: grab;
    }
    
    #maplibre-map:active {
      cursor: grabbing;
    }
    
    code {
      background: #e9ecef;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 14px;
      color: #d63384;
    }
    
    .controls-3d {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
      flex-wrap: wrap;
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .control-group label {
      font-size: 14px;
      font-weight: 600;
      color: #495057;
      margin: 0;
    }
    
    .button-group {
      display: flex;
      gap: 8px;
    }
    
    .button-group button {
      padding: 8px 16px;
      border: 1px solid #dee2e6;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #495057;
      transition: all 0.2s;
    }
    
    .button-group button:hover {
      background: #e9ecef;
      border-color: #adb5bd;
    }
    
    .button-group button.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
    
    .button-group button:active {
      transform: scale(0.95);
    }
  `]
})
export class MaplibreMapComponent implements OnInit, OnDestroy {
  private map!: maplibregl.Map;
  private config!: MapConfig;
  
  // 3D control properties
  currentPitch: number = 45;
  currentBearing: number = 0;
  is3DMode: boolean = true;

  constructor(
    private configService: MapConfigService,
    private boundaryService: BoundaryService
  ) {}

  ngOnInit(): void {
    this.config = this.configService.getConfig();
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initMap(): void {
    this.map = new maplibregl.Map({
      container: 'maplibre-map',
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [this.config.center.lng, this.config.center.lat],
      zoom: this.config.zoom,
      pitch: this.currentPitch,  // Start with 3D view
      bearing: this.currentBearing
    });

    // Add navigation controls
    this.map.addControl(new maplibregl.NavigationControl(), 'top-right');
    this.map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    // Wait for map to load before adding markers and boundaries
    this.map.on('load', () => {
      this.addMarkers();
      this.addBoundaries();
    });
  }

  private addMarkers(): void {
    this.config.data.forEach(region => {
      const iconConfig = this.configService.getIconForData(region);
      const el = this.configService.createMarkerElement(
        iconConfig, 
        this.config.markerAnimation !== false
      );

      // Generate popup using config service
      const popupHtml = this.configService.generatePopupHtml(region);
      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupHtml);

      // Add marker to map with center anchor
      new maplibregl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([region.lng, region.lat])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  private addBoundaries(): void {
    if (!this.config.boundaryLayers || this.config.boundaryLayers.length === 0) {
      return;
    }

    this.config.boundaryLayers.forEach((layerConfig: any, index: number) => {
      if (!layerConfig.visible) {
        return;
      }

      this.boundaryService.loadBoundaryData(layerConfig.geoJsonUrl).subscribe({
        next: (geoJsonData) => {
          const sourceId = `boundary-source-${index}`;
          const layerId = `boundary-layer-${index}`;
          const fillLayerId = `boundary-fill-${index}`;

          // Add source
          this.map.addSource(sourceId, {
            type: 'geojson',
            data: geoJsonData as any
          });

          // Add fill or fill-extrusion layer based on 3D mode
          if (this.is3DMode) {
            // 3D Extrusion layer
            const extrusionLayerConfig: any = {
              id: fillLayerId,
              type: 'fill-extrusion',
              source: sourceId,
              paint: {
                'fill-extrusion-color': [
                  'interpolate',
                  ['linear'],
                  ['get', 'ID_2'],  // Use district ID for color variation
                  0, '#93c5fd',
                  50, '#60a5fa',
                  100, '#3b82f6',
                  150, '#2563eb',
                  200, '#1e40af'
                ],
                'fill-extrusion-height': [
                  '*',
                  ['%', ['get', 'ID_2'], 100],  // Modulo to keep height variation reasonable
                  1000  // Max height in meters (0-100k)
                ],
                'fill-extrusion-base': 0,
                'fill-extrusion-opacity': 0.85
              }
            };
            if (layerConfig.minZoom !== undefined) extrusionLayerConfig.minzoom = layerConfig.minZoom;
            if (layerConfig.maxZoom !== undefined) extrusionLayerConfig.maxzoom = layerConfig.maxZoom;
            this.map.addLayer(extrusionLayerConfig);
          } else {
            // Regular 2D fill layer
            const fillLayerConfig: any = {
              id: fillLayerId,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': layerConfig.style.fillColor || '#93c5fd',
                'fill-opacity': layerConfig.style.fillOpacity || 0.1
              }
            };
            if (layerConfig.minZoom !== undefined) fillLayerConfig.minzoom = layerConfig.minZoom;
            if (layerConfig.maxZoom !== undefined) fillLayerConfig.maxzoom = layerConfig.maxZoom;
            this.map.addLayer(fillLayerConfig);
          }

          // Add line (border) layer with zoom constraints
          const lineLayerConfig: any = {
            id: layerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': layerConfig.style.color,
              'line-width': layerConfig.style.weight,
              'line-opacity': layerConfig.style.opacity
            }
          };
          if (layerConfig.minZoom !== undefined) lineLayerConfig.minzoom = layerConfig.minZoom;
          if (layerConfig.maxZoom !== undefined) lineLayerConfig.maxzoom = layerConfig.maxZoom;
          this.map.addLayer(lineLayerConfig);

          // Add interactivity
          if (layerConfig.interactive !== false) {
            // Change cursor on hover (for both fill and line)
            this.map.on('mouseenter', fillLayerId, () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });

            this.map.on('mouseleave', fillLayerId, () => {
              this.map.getCanvas().style.cursor = '';
            });

            this.map.on('mouseenter', layerId, () => {
              this.map.getCanvas().style.cursor = 'pointer';
            });

            this.map.on('mouseleave', layerId, () => {
              this.map.getCanvas().style.cursor = '';
            });

            // Add click handler for popup on BOTH fill and line layers
            const handleClick = (e: any) => {
              if (e.features && e.features.length > 0) {
                const feature = e.features[0];
                const popupContent = layerConfig.popupTemplate
                  ? layerConfig.popupTemplate(feature.properties)
                  : this.boundaryService.generateBoundaryPopup(feature.properties);

                new maplibregl.Popup()
                  .setLngLat(e.lngLat)
                  .setHTML(popupContent)
                  .addTo(this.map);
              }
            };

            this.map.on('click', fillLayerId, handleClick);
            this.map.on('click', layerId, handleClick);

            // Add hover effect only for 2D mode (not needed for 3D extrusions)
            if (!this.is3DMode && layerConfig.onHover && layerConfig.highlightStyle) {
              this.map.on('mouseenter', fillLayerId, () => {
                // Safety check: only modify if layer exists
                if (this.map.getLayer(fillLayerId) && this.map.getLayer(layerId)) {
                  this.map.setPaintProperty(
                    fillLayerId,
                    'fill-opacity',
                    layerConfig.highlightStyle!.fillOpacity || 0.3
                  );
                  this.map.setPaintProperty(
                    layerId,
                    'line-color',
                    layerConfig.highlightStyle!.color
                  );
                  this.map.setPaintProperty(
                    layerId,
                    'line-width',
                    layerConfig.highlightStyle!.weight || 3
                  );
                }
              });

              this.map.on('mouseleave', fillLayerId, () => {
                // Safety check: only modify if layer exists
                if (this.map.getLayer(fillLayerId) && this.map.getLayer(layerId)) {
                  this.map.setPaintProperty(
                    fillLayerId,
                    'fill-opacity',
                    layerConfig.style.fillOpacity || 0.1
                  );
                  this.map.setPaintProperty(
                    layerId,
                    'line-color',
                    layerConfig.style.color
                  );
                  this.map.setPaintProperty(
                    layerId,
                    'line-width',
                    layerConfig.style.weight
                  );
                }
              });
            }
          }
        },
        error: (error) => {
          console.error(`Error loading boundary layer ${layerConfig.name}:`, error);
        }
      });
    });
  }

  // 3D Control Methods
  setPitch(pitch: number): void {
    this.currentPitch = pitch;
    this.map.easeTo({
      pitch: pitch,
      duration: 1000
    });
  }

  rotate(degrees: number): void {
    this.currentBearing = (this.currentBearing + degrees) % 360;
    this.map.easeTo({
      bearing: this.currentBearing,
      duration: 800
    });
  }

  resetBearing(): void {
    this.currentBearing = 0;
    this.map.easeTo({
      bearing: 0,
      duration: 800
    });
  }

  toggle3DMode(): void {
    this.is3DMode = !this.is3DMode;
    
    // Reload boundaries with new mode
    // Remove all existing boundary layers and their event handlers
    const style = this.map.getStyle();
    if (style && style.layers) {
      style.layers.forEach((layer: any) => {
        if (layer.id.startsWith('boundary-')) {
          // Remove all event listeners for this layer
          this.map.off('mouseenter', layer.id);
          this.map.off('mouseleave', layer.id);
          this.map.off('click', layer.id);
          
          // Remove the layer
          if (this.map.getLayer(layer.id)) {
            this.map.removeLayer(layer.id);
          }
        }
      });
    }
    
    // Remove all boundary sources
    if (style && style.sources) {
      Object.keys(style.sources).forEach((sourceId: string) => {
        if (sourceId.startsWith('boundary-source-')) {
          if (this.map.getSource(sourceId)) {
            this.map.removeSource(sourceId);
          }
        }
      });
    }
    
    // Re-add boundaries with new mode
    this.addBoundaries();
  }
}
