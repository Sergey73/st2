import { Injectable } from '@angular/core';

import * as L from 'mapbox.js';

import * as leafletGeometryutil from 'leaflet-geometryutil';
// import * as leafletSnap from 'leaflet-snap';

// providers
import { MapProvider } from './map-provider';
// import { TrackProvider } from './track-provider';

@Injectable()
export class MarkerProvider {
  private defaultCoords: number[] = [54.3405477, 48.5046386];

  constructor(
    public mapProvider: MapProvider,
    // public trackProvider: TrackProvider
    ) {
    // нужно сделать иначе не работает
    leafletGeometryutil;
    // leafletSnap
  }

  // создание маркера и добавление его на карту
  public createMarker(label:string = 'Введите имя', type: string) {
    let markerIcon = this._createMarkerIcon(type);
    let coords = this.defaultCoords;
    let marker = L
      .marker(coords, {icon: markerIcon, draggable: false})
      .bindTooltip(label, { 
        permanent: true,
        className: 'my-tooltip',
        direction: 'top', 
        offset: [0, -20],
      });

    return marker;
  }

  public removeMarker(marker: any) {
    marker.remove();
  }

  private _createMarkerIcon(type: string) {
    let path;
    switch(type) {
      case 'self': 
        path = 'assets/img/greenCircle.png';
        break;
      case 'checkpoint':
        path = 'assets/img/redCircle.png';
        break;
      case 'other':
        path = 'assets/img/yellowCircle.png';
    }
    let icon = L.icon({
      iconUrl: path,
      iconSize: [32, 30],
      iconAnchor: [15, 15]
    });
    
    return icon;
  }
}