/**
 * Flexible data model for map regions
 * Add any custom fields you need - they'll automatically appear in popups
 */
export interface MapRegionData {
  // Required fields
  name: string;
  lat: number;
  lng: number;
  
  // Optional fields - add as many as you want!
  [key: string]: any;  // This allows any additional properties
}

/**
 * Icon configuration for markers
 */
export interface MarkerIconConfig {
  type: 'emoji' | 'url' | 'svg' | 'colored-circle';
  
  // For emoji icons
  emoji?: string;
  
  // For URL-based icons
  iconUrl?: string;
  iconSize?: [number, number];
  iconAnchor?: [number, number];
  
  // For SVG icons
  svg?: string;
  
  // For colored circles
  color?: string;
  size?: number;
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Field display configuration
 */
export interface FieldConfig {
  key: string;           // The data property key
  label: string;         // Display label in popup
  format?: 'number' | 'currency' | 'text' | 'date' | 'custom';
  formatter?: (value: any) => string;  // Custom formatter function
  show?: boolean;        // Whether to show this field (default: true)
  order?: number;        // Display order in popup
}

/**
 * Color rule for conditional styling
 */
export interface ColorRule {
  field: string;         // Which field to check
  condition: 'greater' | 'less' | 'equal' | 'between' | 'custom';
  value: number | string | [number, number];  // Supports strings for 'equal' condition
  color: string;
  icon?: MarkerIconConfig;
}

/**
 * Complete map configuration
 */
export interface MapConfig {
  // Map settings
  center: { lat: number; lng: number };
  zoom: number;
  
  // Data source
  data: MapRegionData[];
  
  // Icon configuration
  defaultIcon: MarkerIconConfig;
  iconRules?: ColorRule[];  // Conditional icon rules
  
  // Field display configuration
  fields: FieldConfig[];
  
  // Popup settings
  popupTitle?: string;  // Field key to use as popup title (default: 'name')
  showCoordinates?: boolean;  // Show lat/lng in popup (default: false)
  
  // Styling
  markerAnimation?: boolean;  // Enable hover animations (default: true)
  
  // Boundary layers (NEW)
  boundaryLayers?: any[];  // GeoJSON boundary layers to display
}

