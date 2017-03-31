import { Injectable } from '@angular/core';

import * as L from 'mapbox.js';


// providers
import { MapProvider } from './map-provider';

@Injectable()
export class MarkerProvider {

  constructor(public mapProvider: MapProvider) {}

  // создание маркера и добавление его на карту
  public createAddMarker(label:string = 'Введите имя') { 
    let map =   this.mapProvider.map;
    let markerOptions = {
      radius: 8,
      color: 'black',
      weight: '1', 
      fillColor: 'red', 
      fillOpacity: 0.5
    };

    let marker = L
      .circleMarker([54.4151707, 48.3257941], markerOptions)
      .bindTooltip(label, {permanent: true, direction: 'top' })
      .addTo(map);

    return marker;
  }


  public removeMarker(marker: any) {
    marker.remove();
  }

}