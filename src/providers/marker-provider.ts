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
    let markerIcon = this.createMarkerIcon(type, label);
    let coords = this.defaultCoords;
    let marker = L
      .marker(coords, {icon: markerIcon, draggable: false});

    return marker;
  }

  public removeMarker(marker: any) {
    marker.remove();
  }

  public createMarkerIcon(type: string, label: string) {
    let icon;
    switch(type) {
      case 'self': 
        icon = this.createDriverMarker(type, label);
        // path = 'assets/img/greenCircle.png';
        break;
      case 'checkpoint':
        icon = this.createCheckpointMarker(type, label);
        // path = 'assets/img/redCircle.png';
        break;
      case 'other':
      icon = this.createDriverMarker(type, label);
        // path = 'assets/img/yellowCircle.png';
    }
    return icon;
  }

  private createCheckpointMarker(type: string, label: string) {
    let div = document.createElement("div");    
    let svg = d3.select(div).append('svg')
      .attr('width', 100)
      .attr('height', 70);

    let circleData = [15];

    const circle = svg.selectAll('circle')
      .data(circleData)
      .enter()
      .append('circle');

    circle
      .attr('cx', 50)
      .attr('cy', 55)
      .attr('r', d => d)
      .style('fill', 'pink');
    
    svg.append('foreignObject')
      .attr('width', '100%' )
      .append('xhtml:body')
      .html(label)
      .style("font", "18px 'Helvetica Neue'")

    let markerPath = this.serializeXmlNode(div);

    let icon = L.divIcon({
      html: markerPath,
      iconAnchor: [50, 35],
      className: `${type}-marker`
    });
    return icon;
  }

  private createDriverMarker(type: string, label: string) {
    const color = type === 'self' ? 'green' : 'yellow';

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
      .attr('fill', color)
      .attr('d', context.toString());

    svg.append('text')
      .attr('x', 50)
      .attr('y', 10)
      .text(label)
      .style('fill', 'red')
      .style('text-anchor', 'middle');;

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