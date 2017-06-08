import { Injectable } from '@angular/core';

import * as L from 'mapbox.js';

import * as leafletGeometryutil from 'leaflet-geometryutil';
// import * as leafletSnap from 'leaflet-snap';


// providers
import { MapProvider } from './map-provider';
// import { TrackProvider } from './track-provider';

@Injectable()
export class MarkerProvider {

  constructor(
    public mapProvider: MapProvider,
    // public trackProvider: TrackProvider
    ) {
    // нужно сделать иначе не работает
    leafletGeometryutil;
    // leafletSnap
  }

  // создание маркера и добавление его на карту
  public createAddMarker(label:string = 'Введите имя', type: string) {
    let icon;
    switch(type) {
      case 'self': 
        icon = 'assets/img/greenCircle.png';
        break;
      case 'checkpoint':
        icon = 'assets/img/redCircle.png';
        break;
      case 'other':
        icon = 'assets/img/yellowCircle.png';
    }
    let markerIcon = L.icon({
      iconUrl: icon,
      iconSize: [32, 30],
      iconAnchor: [15, 15]
    });

    let coords = [54.3405477, 48.5046386];
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

}