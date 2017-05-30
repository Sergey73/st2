import { Component } from '@angular/core';

import * as leafletDraw from 'leaflet-draw';

import { MapProvider } from '../../providers/map-provider';

@Component({
  selector: 'checkpoint-panel',
  templateUrl: 'checkpoint-panel.html'
})
export class CheckpointPanelComponent {
  private map: any;
  private featureGroupCheckpoint: any;

  constructor(
    public mapProvider: MapProvider
  ) {
    // нужен сдесь иначе модуль не работает.
    leafletDraw
  }

  public ngOnInit() {
    this.map = this.mapProvider.getMap();
    this.featureGroupCheckpoint = this.mapProvider.featureGroupCheckpoint;
    this.ceateDrawEvent();
  }

  private ceateDrawEvent() {
    this.map.on('draw:created', (e) => { 
      if (e.layerType !== 'circle') {
        // let message = 'Для построения маршрута используйте полилинию!';
        // this.msgService.alert(message, null);
        return;
      } 
      console.dir('circle create')
      // this.createCheckpoint(e);
    });
  }

}
