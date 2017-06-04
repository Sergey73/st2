import { Component } from '@angular/core';

import * as leafletDraw from 'leaflet-draw';
import { MapProvider } from '../../providers/map-provider';
import { MarkerProvider } from '../../providers/marker-provider';

@Component({
  selector: 'checkpoint-panel',
  templateUrl: 'checkpoint-panel.html'
})
export class CheckpointPanelComponent {
  private map: any;
  private featureGroupCheckpoint: any;

  constructor(
    public mapProvider: MapProvider,
    public markerProvider: MarkerProvider
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
      if (e.layerType !== 'marker') return;
      this.createCheckpoint(e);
    });
  }

  private createCheckpoint(e) {
    let coords = e.layer.getLatLng();
    let checkpointfMarker = this.markerProvider.createAddMarker('0:35:00', 'checkpoint');
    checkpointfMarker.setLatLng(coords);

    // var me = checkpointfMarker.getElement();
    // var t = checkpointfMarker.getTooltip();
    // var te = t.getElement();
    // te.style.transform = me.style.transform;
  }

}
