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
    // // нужно сделать иначе не работает
    // debugger;
    leafletGeometryutil;
    // leafletSnap
  }

  // создание маркера и добавление его на карту
  public createAddMarker(label:string = 'Введите имя', type: string) { 
    let map = this.mapProvider.map;
    // let markerOptions = {
    //   radius: 8,
    //   color: 'black',
    //   weight: '1', 
    //   fillColor: 'red', 
    //   fillOpacity: 0.5
    // };
    // let icon = type == 'self' ? 'assets/img/greenCircle.png' : 'assets/img/yellowCircle.png'

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
      // .circleMarker([54.4151707, 48.3257941], markerOptions)
      .marker(coords, {icon: markerIcon})
      .addTo(map)
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
