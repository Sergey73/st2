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
    let icon;
    switch(type) {
      case 'self': 
        icon = this.createTriangle(type);
        // path = 'assets/img/greenCircle.png';
        break;
      case 'checkpoint':
        // path = 'assets/img/redCircle.png';
        icon = L.divIcon({
          // iconUrl: path,
          html: '',
          // iconSize: [32, 30],
          iconAnchor: [50, 25],
          className: `${type}-marker`
        });
        break;
      case 'other':
        icon = L.divIcon({
          // iconUrl: path,
          html: '',
          // iconSize: [32, 30],
          iconAnchor: [50, 25],
          className: `${type}-marker`
        });
        // path = 'assets/img/yellowCircle.png';
    }
   
    
    
    // let circleData = [15, 15, 10]

    // let div = document.createElement("div");    
    // let svg = d3.select(div).append('svg')
    //   .attr('width', 30)
    //   .attr('height', 50);


    // svg.append('rect')
    //   .attr('x', 0)
    //   .attr('y', 0)
    //   .attr('width', 30)
    //   .attr('height', 50)
    //   .attr('fill', 'none')
    //   .attr('stroke', '#000')
    //   .attr('stroke-width', 2);
    
    // const context = d3.path();
    // context.moveTo(0, 0);
    // context.lineTo(15, 25);
    // context.lineTo(0, 50);

    // svg.append('path')
    //   .attr('d', context.toString());
    

    // const circle = svg.selectAll('circle')
    //   .data(circleData)
    //   .enter()
    //   .append('circle')
    // const attribute = circle
    //   .attr('cx', 15)
    //   .attr('cy', 35)
    //   .attr('r', d => d)
    //   .style('fill', 'pink');

    // svg.append('text')
    //   .attr('x', 0)
    //   .attr('y', 10)
    //   .text('helloooo')
    //   .style('fill', 'red')

    // let test = this.serializeXmlNode(div);

    // let icon = L.divIcon({
    //   // iconUrl: path,
    //   html: markerPath,
    //   // iconSize: [32, 30],
    //   iconAnchor: [50, 25],
    //   className: `${type}-marker`
    // });
    
    return icon;
  }

  private createTriangle(type: string) {
    let div = document.createElement("div");    
    let svg = d3.select(div).append('svg')
      .attr('width', 100)
      .attr('height', 50);

    const context = d3.path();
    context.moveTo(30, 100);
    context.lineTo(50, 25);
    context.lineTo(70, 100);
    context.closePath();

    
    svg.append('path')
      .attr('fill', 'green')
      .attr('d', context.toString());

    svg.append('text')
      .attr('x', 0)
      .attr('y', 10)
      .text('helloooo')
      .style('fill', 'red');

    let markerPath = this.serializeXmlNode(div);

    let icon = L.divIcon({
      // iconUrl: path,
      html: markerPath,
      // iconSize: [32, 30],
      iconAnchor: [50, 25],
      className: `${type}-marker`
    });
    return icon;
  }

  // функция преобразовывает dom элемент в сторковой
  private serializeXmlNode(xmlNode) {
    if (typeof window['XMLSerializer'] != "undefined") {
        return (new window['XMLSerializer']()).serializeToString(xmlNode);
    } else if (typeof xmlNode.xml != "undefined") {
        return xmlNode.xml;
    }
    return "";
  }
  
}