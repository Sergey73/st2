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
    let svgMarker = '<?xml version="1.0" encoding="utf-8" standalone="yes"?>' +
      '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" height = "15px"  width = "135px">' +
        '<g>' + 
          '<text x="15" y="10" fill="red">' + label + '</text>' +
          '<circle cx="6" cy="6" r="5" stroke="black" stroke-width="2" fill="red" />' +
        '</g>' +
      '</svg>'+
      '<style>svg { -webkit-background-clip: text; }</style>';

    let marker = L.marker([54.4151707, 48.3257941], {
      icon: new L.DivIcon({
        // className: 'label',
        html: svgMarker,
        iconSize: [0, 0]
      })
    });
    marker.addTo(map);

    return marker;
  }


  public removeMarker(marker: any) {
    marker.remove();
  }

}
