import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import * as L from 'mapbox.js';

@Injectable()
export class MapProvider {
  public map: any;
  private mapToken: string;
  private mapStyle: string;
  private mapMinZoom: number;
  public featureGroupTrack: any;
  public featureGroupCheckpoint: any;

  constructor(
    public events: Events
  ) {
    this.mapToken = 'pk.eyJ1Ijoic2VyZ2V5NzMiLCJhIjoiY2lyM3JhNXR1MDAydGh6bWM3ZzBjaGlrYyJ9.MxdICo0uhxAtmyWpA_CeVw';
    this.mapStyle = 'mapbox.streets';
    this.mapMinZoom = 10;
  }

  public getMap() {  
    if (!this.map) this.initMap();
    return this.map;
  }

  public initMap() {
    L.mapbox.accessToken = this.mapToken;
    this.map = L.mapbox.map('map', this.mapStyle, {
      minZoom: this.mapMinZoom,
      drawControl: false,
      maxBounds: [[54.46605, 48.08372], [53.86225, 50.21576]],
      // с этми нельзя заходить за границы maxBounds
      maxBoundsViscosity: 1
    }).setView([54.33414, 48.42499], 10);

    // подписываемся на изменение зума
    this.map.on('zoom', e => {
      this.events.publish('map: zoom', e);
    });

    // создаем панель для редактирования
    this.createDrawControl();
  }

  private createDrawControl () {
    this.featureGroupTrack = L.featureGroup().addTo(this.map);
    this.featureGroupCheckpoint = L.featureGroup().addTo(this.map);

    new L.Control.Draw({
      edit: {
        featureGroup: this.featureGroupTrack
      },
      draw: {
        polygon: false,
        polyline: true,
        rectangle: false,
        circle: false,
        marker: false
      }
    }).addTo(this.map);

    new L.Control.Draw({
      edit: {
        featureGroup: this.featureGroupCheckpoint
      },
      draw: {
        polygon: false,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: true
      }
    }).addTo(this.map);

  }

}
