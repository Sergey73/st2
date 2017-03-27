import { Injectable } from '@angular/core';


import * as L from 'mapbox.js';

@Injectable()
export class MapProvider {
  public map: any;
  private mapToken: string;
  private mapStyle: string;
  private mapMinZoom: number;

  constructor(

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
      // drawControl: true
      // maxBounds: [[54.46605, 48.08372], [53.86225, 50.21576]]
    }).setView([54.33414, 48.42499], 10);
  }

}
