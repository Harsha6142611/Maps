# Maps Library Comparison - Leaflet vs MapLibre

A demo Angular application comparing two popular open-source mapping libraries for region-wise data visualization.

## 🎉 NEW: Geographic Boundaries Support

**Major Update**: Now supports **GeoJSON boundaries** for states, districts, and regions!

### Features Added:
- ✅ **India State Boundaries** - Pre-configured and ready!
- ✅ **Interactive Boundaries** - Click and hover on states
- ✅ **Custom Styling** - Configure colors, opacity, borders
- ✅ **Multiple Layers** - Show states, districts, custom regions
- ✅ **Works on Both** - Leaflet and MapLibre support

**📝 Edit**: `src/app/config/map.config.ts`  
**📚 Guides**: 
- `CUSTOMIZATION_GUIDE.md` - Icons and data customization
- `BOUNDARY_GUIDE.md` - Geographic boundaries guide (NEW!)

## 📚 Libraries Compared

### 1. Leaflet
- **Website**: https://leafletjs.com/
- **License**: BSD-2-Clause (Free & Open Source)
- **API Key**: Not required (tiles may need one, but we use free OpenStreetMap)

### 2. MapLibre GL
- **Website**: https://maplibre.org/
- **License**: BSD-3-Clause (Free & Open Source)  
- **API Key**: Not required

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to:
```
http://localhost:4200
```

## 📁 Project Structure

```
src/
├── app/
│   ├── home/                  # Home page with comparison table
│   ├── leaflet-map/           # Leaflet implementation
│   ├── maplibre-map/          # MapLibre implementation
│   ├── app.component.ts       # Root component
│   └── app.routes.ts          # Routing configuration
├── assets/                    # Static assets
├── index.html                 # Main HTML file
├── main.ts                    # Application entry point
└── styles.css                 # Global styles
```

## 🗺️ Features Demonstrated

### Leaflet Map
- Interactive markers with region data
- Color-coded markers based on population
- Popup information on click
- Easy pan and zoom
- OpenStreetMap tiles (free)

### MapLibre Map
- Hardware-accelerated WebGL rendering
- Smooth animations and transitions
- 3D-capable visualization
- Map rotation and pitch control
- Vector tiles support
- Scalable markers based on data

## 📊 Sample Data

The demo includes 20 major US cities with:
- City name
- Geographical coordinates (lat/lng)
- Population data
- Revenue figures

## 🎨 Features

- **Standalone Components**: Using Angular 17+ standalone components
- **Lazy Loading**: Routes are lazy-loaded for better performance
- **Responsive Design**: Works on desktop and mobile devices
- **No API Keys**: Both implementations work without requiring API keys
- **Independent Implementations**: Each library is completely independent

## 🔍 Key Differences

| Feature | Leaflet | MapLibre GL |
|---------|---------|-------------|
| Rendering | Canvas/SVG | WebGL |
| Performance | Good for small datasets | Excellent for large datasets |
| 3D Support | Limited | Native |
| File Size | ~39KB | ~400KB |
| Learning Curve | Easy | Moderate |
| Map Rotation | No | Yes |

## 💡 Recommendations

### Use Leaflet When:
- Simple marker-based maps
- Need broad browser support
- Small to medium datasets
- Quick prototyping
- Team familiar with simple APIs

### Use MapLibre When:
- Large datasets (1000+ markers)
- Need smooth animations
- Vector tiles required
- 3D visualization needed
- Performance is critical

## 🏗️ Built With

- **Angular 17+** - Web framework
- **Leaflet 1.9.4** - Lightweight mapping library
- **MapLibre GL 4.0** - WebGL-based mapping library
- **TypeScript** - Programming language
- **OpenStreetMap** - Free map tiles

## 📝 License

This project is open source and available for learning purposes.

## 🤝 Contributing

Feel free to fork this project and experiment with different features!

## 📧 Questions?

This is a demo project to help you choose the right mapping library for your needs.

# Maps
