import { Injectable } from '@angular/core';
import { MapConfig, MapRegionData, FieldConfig, MarkerIconConfig, ColorRule } from '../models/map-data.model';
import { DEFAULT_MAP_CONFIG, INDIA_MAP_CONFIG } from '../config/map.config';

@Injectable({
  providedIn: 'root'
})
export class MapConfigService {
  // Switch between DEFAULT_MAP_CONFIG and INDIA_MAP_CONFIG
  private currentConfig: MapConfig = INDIA_MAP_CONFIG;

  /**
   * Set custom configuration
   */
  setConfig(config: MapConfig): void {
    this.currentConfig = config;
  }

  /**
   * Get current configuration
   */
  getConfig(): MapConfig {
    return this.currentConfig;
  }

  /**
   * Get marker icon configuration for a data point
   */
  getIconForData(data: MapRegionData): MarkerIconConfig {
    const config = this.currentConfig;
    
    // Check icon rules in order
    if (config.iconRules) {
      for (const rule of config.iconRules) {
        if (this.evaluateRule(rule, data)) {
          return rule.icon || config.defaultIcon;
        }
      }
    }
    
    return config.defaultIcon;
  }

  /**
   * Get color for a data point (based on rules)
   */
  getColorForData(data: MapRegionData): string {
    const config = this.currentConfig;
    
    if (config.iconRules) {
      for (const rule of config.iconRules) {
        if (this.evaluateRule(rule, data)) {
          return rule.color;
        }
      }
    }
    
    return config.defaultIcon.color || '#007bff';
  }

  /**
   * Evaluate a color rule against data
   */
  private evaluateRule(rule: ColorRule, data: MapRegionData): boolean {
    const fieldValue = data[rule.field];
    
    if (fieldValue === undefined) {
      return false;
    }
    
    switch (rule.condition) {
      case 'greater':
        return fieldValue > rule.value;
        
      case 'less':
        return fieldValue < rule.value;
        
      case 'equal':
        return fieldValue === rule.value;
        
      case 'between':
        if (Array.isArray(rule.value) && rule.value.length === 2) {
          return fieldValue >= rule.value[0] && fieldValue <= rule.value[1];
        }
        return false;
        
      default:
        return false;
    }
  }

  /**
   * Format a field value according to its configuration
   */
  formatValue(field: FieldConfig, value: any): string {
    // Use custom formatter if provided
    if (field.formatter) {
      return field.formatter(value);
    }
    
    // Use built-in formatters
    switch (field.format) {
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
        
      case 'currency':
        return typeof value === 'number' 
          ? `$${value.toLocaleString()}` 
          : String(value);
        
      case 'date':
        return value instanceof Date 
          ? value.toLocaleDateString() 
          : new Date(value).toLocaleDateString();
        
      case 'text':
      default:
        return String(value);
    }
  }

  /**
   * Generate popup HTML for a data point
   */
  generatePopupHtml(data: MapRegionData): string {
    const config = this.currentConfig;
    const titleField = config.popupTitle || 'name';
    const title = data[titleField] || 'Unknown';
    
    // Sort fields by order
    const sortedFields = [...config.fields]
      .filter(f => f.show !== false)
      .sort((a, b) => (a.order || 999) - (b.order || 999));
    
    // Build HTML
    let html = `
      <div style="min-width: 200px; font-family: Arial, sans-serif;">
        <h3 style="margin: 0 0 15px 0; color: #333; font-size: 18px; border-bottom: 2px solid #007bff; padding-bottom: 8px;">
          ${title}
        </h3>
    `;
    
    // Add fields
    for (const field of sortedFields) {
      const value = data[field.key];
      if (value !== undefined && value !== null) {
        const formattedValue = this.formatValue(field, value);
        html += `
          <p style="margin: 8px 0; color: #555; display: flex; justify-content: space-between;">
            <strong style="color: #333;">${field.label}:</strong>
            <span style="margin-left: 15px;">${formattedValue}</span>
          </p>
        `;
      }
    }
    
    // Add coordinates if enabled
    if (config.showCoordinates) {
      html += `
        <p style="margin: 8px 0; color: #555; font-size: 12px; border-top: 1px solid #eee; padding-top: 8px;">
          <strong>Coordinates:</strong> ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}
        </p>
      `;
    }
    
    html += `</div>`;
    
    return html;
  }

  /**
   * Create marker element (HTML) from icon config
   */
  createMarkerElement(iconConfig: MarkerIconConfig, animate: boolean = true): HTMLElement {
    const el = document.createElement('div');
    el.style.cursor = 'pointer';
    
    // Set explicit size on wrapper for MapLibre positioning
    let wrapperWidth = 32;
    let wrapperHeight = 32;
    
    // Animation CSS to apply on inner element (doesn't affect positioning)
    const animationStyle = animate ? 'transition: transform 0.2s ease; transform-origin: center;' : '';
    const hoverClass = animate ? 'map-marker-hover' : '';
    
    switch (iconConfig.type) {
      case 'emoji':
        wrapperWidth = 32;
        wrapperHeight = 32;
        el.style.width = `${wrapperWidth}px`;
        el.style.height = `${wrapperHeight}px`;
        el.innerHTML = `<div class="${hoverClass}" style="
          font-size: 28px;
          line-height: 32px;
          width: 32px;
          height: 32px;
          text-align: center;
          ${animationStyle}
        ">${iconConfig.emoji || '📍'}</div>`;
        break;
        
      case 'url':
        wrapperWidth = iconConfig.iconSize ? iconConfig.iconSize[0] : 32;
        wrapperHeight = iconConfig.iconSize ? iconConfig.iconSize[1] : 32;
        el.style.width = `${wrapperWidth}px`;
        el.style.height = `${wrapperHeight}px`;
        el.innerHTML = `<img 
          src="${iconConfig.iconUrl || ''}" 
          class="${hoverClass}"
          style="
            width: ${wrapperWidth}px;
            height: ${wrapperHeight}px;
            display: block;
            ${animationStyle}
          "
        />`;
        break;
        
      case 'svg':
        wrapperWidth = 32;
        wrapperHeight = 32;
        el.style.width = `${wrapperWidth}px`;
        el.style.height = `${wrapperHeight}px`;
        const svgContent = iconConfig.svg || '';
        el.innerHTML = `<div class="${hoverClass}" style="${animationStyle}">${svgContent}</div>`;
        break;
        
      case 'colored-circle':
      default:
        const size = iconConfig.size || 20;
        wrapperWidth = size;
        wrapperHeight = size;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.innerHTML = `<div class="${hoverClass}" style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: ${iconConfig.color || '#007bff'};
          border: ${iconConfig.borderWidth || 3}px solid ${iconConfig.borderColor || 'white'};
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          ${animationStyle}
        "></div>`;
        break;
    }
    
    // Add hover effect to inner element only
    if (animate) {
      el.addEventListener('mouseenter', () => {
        const inner = el.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.transform = 'scale(1.2)';
        }
      });
      el.addEventListener('mouseleave', () => {
        const inner = el.firstElementChild as HTMLElement;
        if (inner) {
          inner.style.transform = 'scale(1)';
        }
      });
    }
    
    return el;
  }
}

