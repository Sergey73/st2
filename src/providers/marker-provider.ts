import { Injectable } from '@angular/core';
import * as d3 from 'd3';

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
    // let path = `<svg
    //   width="30"
    //   height="30"
    //   viewBox="0 0 30 30"
    //   id="svg2"
    // >
    //   <g
    //     id="layer1"
    //     transform="translate(0,-1022.3622)"
    //   >
    //     <path
    //       style="fill:#00ff00;
    //       fill-opacity:1;
    //       stroke:none;
    //       stroke-width:1;
    //       stroke-linejoin:miter;
    //       stroke-miterlimit:4;
    //       stroke-dasharray:none;
    //       stroke-opacity:1"
    //       id="path4136"
    //       d="M -1.2274447e-6,1052.3622 26.855693,1005.8468 l 26.855696,-46.51544 26.855692,46.51544 26.855699,46.5154 -53.711391,0 z"
    //       transform="matrix(0.27927038,0,0,0.32247366,-8.8465578e-7,713.00312)" 
    //     />
    //   </g>
    // </svg>`;
    // switch(type) {
    //   case 'self': 
    //     path = 'assets/img/greenCircle.png';
    //     break;
    //     case 'checkpoint':
    //       path = 'assets/img/redCircle.png';
    //     break;
    //   case 'other':
    //     path = 'assets/img/yellowCircle.png';
    // }
    // let icon = L.icon({
    //   iconUrl: path,
    //   iconSize: [32, 30],
    //   iconAnchor: [15, 15],
    //   className: `${type}-marker`
    // });
    let circleData = [15, 15, 10]


    let div = document.createElement("div");    
    let svg = d3.select(div).append('svg')
      .attr('width', 30)
      .attr('height', 50);
    const circle = svg.selectAll('circle')
      .data(circleData)
      .enter()
      .append('circle')
    const attribute = circle
      .attr('cx', 15)
      .attr('cy', 35)
      .attr('r', d => d)
      .style('fill', 'green');

    svg.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .text('helloooo')

      let test = this.serializeXmlNode(div);
    let icon = L.divIcon({
      // iconUrl: path,
      html: test,
      // iconSize: [32, 30],
      // iconAnchor: [15, 15],
      className: `${type}-marker`
    });
    
    return icon;
  }

  private serializeXmlNode(xmlNode) {

    if (typeof window.XMLSerializer != "undefined") {
        return (new window.XMLSerializer()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
}
}