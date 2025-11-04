import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GeoJSONFeatureCollection } from '../models/boundary.model';

@Injectable({
  providedIn: 'root'
})
export class BoundaryService {
  constructor(private http: HttpClient) {}

  /**
   * Load GeoJSON boundary data from URL or local file
   */
  loadBoundaryData(url: string): Observable<GeoJSONFeatureCollection> {
    return this.http.get<GeoJSONFeatureCollection>(url);
  }

  /**
   * Generate popup content from feature properties
   */
  generateBoundaryPopup(properties: any): string {
    let html = '<div style="min-width: 150px; font-family: Arial, sans-serif;">';
    
    // Try common property names for region name
    const name = properties.name || properties.NAME || properties.ST_NM || 
                 properties.state_name || properties.district || properties.DISTRICT || 
                 'Region';
    
    html += `<h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px; border-bottom: 2px solid #007bff; padding-bottom: 5px;">
      ${name}
    </h3>`;
    
    // Add all other properties
    for (const [key, value] of Object.entries(properties)) {
      if (key !== 'name' && key !== 'NAME' && key !== 'ST_NM' && value) {
        const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        html += `<p style="margin: 5px 0; color: #555; font-size: 13px;">
          <strong>${formattedKey}:</strong> ${value}
        </p>`;
      }
    }
    
    html += '</div>';
    return html;
  }
}

