import { MapConfig, MapRegionData } from '../models/map-data.model';
import { BoundaryLayer } from '../models/boundary.model';

/**
 * SAMPLE DATA - Replace this with your actual region data
 */
export const SAMPLE_REGION_DATA: MapRegionData[] = [
  {
    name: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    population: 8336817,
    revenue: 950000,
    region: 'Northeast',
    status: 'Active',
    salesTarget: 1000000,
    employees: 450
  },
  {
    name: 'Los Angeles',
    lat: 34.0522,
    lng: -118.2437,
    population: 3979576,
    revenue: 720000,
    region: 'West',
    status: 'Active',
    salesTarget: 800000,
    employees: 320
  },
  {
    name: 'Chicago',
    lat: 41.8781,
    lng: -87.6298,
    population: 2693976,
    revenue: 580000,
    region: 'Midwest',
    status: 'Active',
    salesTarget: 650000,
    employees: 280
  },
  {
    name: 'Houston',
    lat: 29.7604,
    lng: -95.3698,
    population: 2320268,
    revenue: 510000,
    region: 'South',
    status: 'Active',
    salesTarget: 600000,
    employees: 220
  },
  {
    name: 'Phoenix',
    lat: 33.4484,
    lng: -112.0740,
    population: 1680992,
    revenue: 420000,
    region: 'Southwest',
    status: 'Growing',
    salesTarget: 500000,
    employees: 180
  },
  {
    name: 'Philadelphia',
    lat: 39.9526,
    lng: -75.1652,
    population: 1584064,
    revenue: 390000,
    region: 'Northeast',
    status: 'Active',
    salesTarget: 450000,
    employees: 160
  },
  {
    name: 'San Antonio',
    lat: 29.4241,
    lng: -98.4936,
    population: 1547253,
    revenue: 380000,
    region: 'South',
    status: 'Active',
    salesTarget: 400000,
    employees: 150
  },
  {
    name: 'San Diego',
    lat: 32.7157,
    lng: -117.1611,
    population: 1423851,
    revenue: 450000,
    region: 'West',
    status: 'Growing',
    salesTarget: 500000,
    employees: 190
  },
  {
    name: 'Dallas',
    lat: 32.7767,
    lng: -96.7970,
    population: 1343573,
    revenue: 520000,
    region: 'South',
    status: 'Active',
    salesTarget: 550000,
    employees: 240
  },
  {
    name: 'San Jose',
    lat: 37.3382,
    lng: -121.8863,
    population: 1021795,
    revenue: 680000,
    region: 'West',
    status: 'Active',
    salesTarget: 700000,
    employees: 300
  }
];

export const DEFAULT_MAP_CONFIG: MapConfig = {
  // Map initial view
  center: { lat: 39.8283, lng: -98.5795 },
  zoom: 4,
  
  // Your data source
  data: SAMPLE_REGION_DATA,
  
  // Default marker icon (used if no rules match)
  defaultIcon: {
    type: 'url',
    iconUrl: 'assets/icons/defaultImage.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  },
  
  // Conditional icon rules (checked in order)
  // All markers now use the same SVG icon
  iconRules: [
    {
      field: 'population',
      condition: 'greater',
      value: 2000000,
      color: '#dc3545',  // Red for large cities
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage.svg',
        iconSize: [36, 36],  // Larger for big cities
        iconAnchor: [18, 18]
      }
    },
    {
      field: 'population',
      condition: 'greater',
      value: 1000000,
      color: '#ffc107',  // Yellow for medium cities
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage.svg',
        iconSize: [32, 32],  // Medium size
        iconAnchor: [16, 16]
      }
    },
    {
      field: 'population',
      condition: 'greater',
      value: 0,
      color: '#28a745',  // Green for smaller cities
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage.svg',
        iconSize: [28, 28],  // Smaller
        iconAnchor: [14, 14]
      }
    }
  ],
  
  // Configure which fields to show in popups and how to format them
  fields: [
    {
      key: 'population',
      label: 'Population',
      format: 'number',
      show: true,
      order: 1
    },
    {
      key: 'revenue',
      label: 'Revenue',
      format: 'currency',
      show: true,
      order: 2
    },
    {
      key: 'region',
      label: 'Region',
      format: 'text',
      show: true,
      order: 3
    },
    {
      key: 'status',
      label: 'Status',
      format: 'text',
      show: true,
      order: 4
    },
    {
      key: 'employees',
      label: 'Employees',
      format: 'number',
      show: true,
      order: 5
    },
    {
      key: 'salesTarget',
      label: 'Sales Target',
      format: 'currency',
      show: true,
      order: 6
    }
  ],
  
  // Popup settings
  popupTitle: 'name',
  showCoordinates: true,
  markerAnimation: true,
  
  // Boundary layers (optional)
  boundaryLayers: []
};

/**
 * INDIA BOUNDARY LAYERS
 * Uncomment and use these for displaying India states/districts
 */
export const INDIA_BOUNDARY_LAYERS: BoundaryLayer[] = [
  {
    name: 'India States',
    type: 'state',
    geoJsonUrl: 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_states.geojson',
    style: {
      color: '#2563eb',      // Border color (blue)
      weight: 2,             // Border width
      opacity: 0.8,          // Border opacity
      fillColor: '#93c5fd',  // Fill color (light blue)
      fillOpacity: 0.1       // Fill opacity
    },
    visible: true,
    interactive: true,
    onHover: true,
    highlightStyle: {
      color: '#1e40af',
      weight: 3,
      opacity: 1,
      fillColor: '#60a5fa',
      fillOpacity: 0.3
    }
  },
  {
    name: 'India Districts',
    type: 'district',
    // geoJsonUrl: 'https://gist.githubusercontent.com/jbrobst/56c13bbbf9d97d187fea01ca62ea5112/raw/e388c4cae20aa53cb5090210a42ebb9b765c0a36/india_districts.geojson',
    geoJsonUrl: '/assets/icons/india_district.geojson',
    style: {
      color: '#9333ea',      // Purple border
      weight: 1,
      opacity: 0.6,
      fillColor: '#d8b4fe',
      fillOpacity: 0.05
    },
    visible: true,           // Enabled, but only shows when zoomed in
    interactive: true,
    minZoom: 5,              // Show districts when zoom >= 5 (earlier visibility)
    onHover: true,
    highlightStyle: {
      color: '#7c3aed',
      weight: 2,
      opacity: 1,
      fillColor: '#c4b5fd',
      fillOpacity: 0.2
    }
  }
];

/**
 * INDIA MAP CONFIGURATION
 * For displaying India with state boundaries
 */
export const INDIA_MAP_CONFIG: MapConfig = {
  center: { lat: 20.5937, lng: 78.9629 },  // Center of India
  zoom: 7,  // Increased to see districts immediately
  
  data: [
    // Add your India city/region data here
    {
      name: 'Mumbai',
      lat: 19.0760,
      lng: 72.8777,
      population: 20411000,
      revenue: 2500000,
      region: 'Maharashtra',
      status: 'Active'
    },
    {
      name: 'Delhi',
      lat: 28.7041,
      lng: 77.1025,
      population: 16787941,
      revenue: 2200000,
      region: 'Delhi',
      status: 'Active'
    },
    {
      name: 'Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      population: 8443675,
      revenue: 1800000,
      region: 'Karnataka',
      status: 'Active'
    },
    {
      name: 'Hyderabad',
      lat: 17.3850,
      lng: 78.4867,
      population: 6809970,
      revenue: 1500000,
      region: 'Telangana',
      status: 'Active'
    },
    {
      name: 'Ahmedabad',
      lat: 23.0225,
      lng: 72.5714,
      population: 5577940,
      revenue: 1200000,
      region: 'Gujarat',
      status: 'Active'
    },
    {
      name: 'Chennai',
      lat: 13.0827,
      lng: 80.2707,
      population: 4646732,
      revenue: 1100000,
      region: 'Tamil Nadu',
      status: 'Active'
    },
    {
      name: 'Kolkata',
      lat: 22.5726,
      lng: 88.3639,
      population: 4486679,
      revenue: 1000000,
      region: 'West Bengal',
      status: 'Active'
    },
    {
      name: 'Pune',
      lat: 18.5204,
      lng: 73.8567,
      population: 3124458,
      revenue: 900000,
      region: 'Maharashtra',
      status: 'Active'
    }
  ],
  
  defaultIcon: {
    type: 'url',
    iconUrl: 'assets/icons/defaultImage1.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  },
  
  iconRules: [
    {
      field: 'population',
      condition: 'greater',
      value: 10000000,
      color: '#dc3545',
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage2.svg',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      }
    },
    {
      field: 'population',
      condition: 'greater',
      value: 5000000,
      color: '#ffc107',
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage3.svg',
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      }
    },
    {
      field: 'population',
      condition: 'greater',
      value: 0,
      color: '#28a745',
      icon: {
        type: 'url',
        iconUrl: 'assets/icons/defaultImage1.svg',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      }
    }
  ],
  
  fields: [
    { key: 'population', label: 'Population', format: 'number', show: true, order: 1 },
    { key: 'revenue', label: 'Revenue', format: 'currency', show: true, order: 2 },
    { key: 'region', label: 'State', format: 'text', show: true, order: 3 },
    { key: 'status', label: 'Status', format: 'text', show: true, order: 4 }
  ],
  
  popupTitle: 'name',
  showCoordinates: false,
  markerAnimation: true,
  
  // Add India boundary layers
  boundaryLayers: INDIA_BOUNDARY_LAYERS
};
