import { Injectable } from '@angular/core';

import * as L from 'mapbox.js';

// import * as leafletGeometryutil from 'leaflet-geometryutil';
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
    // leafletGeometryutil;
    // leafletSnap
  }

  // создание маркера и добавление его на карту
  public createAddMarker(label:string = 'Введите имя') { 
    let map = this.mapProvider.map;
    // let markerOptions = {
    //   radius: 8,
    //   color: 'black',
    //   weight: '1', 
    //   fillColor: 'red', 
    //   fillOpacity: 0.5
    // };

    let marker = L
      // .circleMarker([54.4151707, 48.3257941], markerOptions)
      .marker([54.4151707, 48.3257941])
      .bindTooltip(label, {permanent: true, direction: 'top' })
      .addTo(map);

    return marker;
  }


  public removeMarker(marker: any) {
    marker.remove();
  }

}