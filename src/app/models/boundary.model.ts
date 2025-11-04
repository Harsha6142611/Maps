/**
 * Boundary style configuration
 */
export interface BoundaryStyle {
  color: string;           // Border color
  weight: number;          // Border width
  opacity: number;         // Border opacity (0-1)
  fillColor?: string;      // Fill color (optional)
  fillOpacity?: number;    // Fill opacity (0-1)
  dashArray?: string;      // Dashed line pattern (e.g., '5, 10')
}

/**
 * Boundary layer configuration
 */
export interface BoundaryLayer {
  name: string;            // Layer name (e.g., "India States", "Districts")
  type: 'state' | 'district' | 'country' | 'custom';
  geoJsonUrl: string;      // URL or path to GeoJSON file
  style: BoundaryStyle;
  visible: boolean;        // Show/hide this layer
  interactive?: boolean;   // Enable click/hover (default: true)
  popupTemplate?: (properties: any) => string;  // Custom popup content
  onHover?: boolean;       // Show info on hover
  highlightStyle?: BoundaryStyle;  // Style when hovering
  minZoom?: number;        // Show layer only at this zoom level or higher
  maxZoom?: number;        // Hide layer above this zoom level
}

/**
 * GeoJSON Feature (standard format)
 */
export interface GeoJSONFeature {
  type: 'Feature';
  properties: any;
  geometry: {
    type: string;
    coordinates: any;
  };
}

/**
 * GeoJSON FeatureCollection (standard format)
 */
export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

