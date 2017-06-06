import { Component } from '@angular/core';
import { ToastController } from 'ionic-angular';

import * as leafletDraw from 'leaflet-draw';
import { MapProvider } from '../../providers/map-provider';
import { MarkerProvider } from '../../providers/marker-provider';
import { UserDataProvider } from '../../providers/user-data-provider';
import { DevelopProvider } from '../../providers/develop-provider';
import { TrackProvider } from '../../providers/track-provider';

@Component({
  selector: 'checkpoint-panel',
  templateUrl: 'checkpoint-panel.html'
})
export class CheckpointPanelComponent {
  private map: any;
  private userData: any;
  private featureGroupCheckpoint: any;

  constructor(
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    public markerProvider: MarkerProvider,
    public userDataProvider: UserDataProvider,
    public developProvider: DevelopProvider,
    public trackProvider: TrackProvider

  ) {
    // нужен сдесь иначе модуль не работает.
    leafletDraw
  }

  public ngOnInit() {
    this.map = this.mapProvider.getMap();
    this.featureGroupCheckpoint = this.mapProvider.featureGroupCheckpoint;
    this.userData = this.userDataProvider.userData;
    this.ceateDrawEvent();
    this.editDrawEvent();
  }

  private ceateDrawEvent() {
    this.map.on('draw:created', (e) => { 
      let layerType = e.layerType;
      if (layerType !== 'marker') return;
      if ( !this.userData.trackNumber){
        let toast = this.toastCtrl.create({
          message: 'выберите маршрут для привязки маркера!',
          duration: 3000
        });
        toast.present();
        return;
      } 
      this.createCheckpoint(e);
    });
  }

  private createCheckpoint(e) {
    let coords = e.layer.getLatLng();
    let checkpointfMarker = this.markerProvider.createAddMarker('0:35:00', 'checkpoint');
    checkpointfMarker.setLatLng(coords);
    this.showCheckpoint(checkpointfMarker);
    this.developProvider.setMarkerOnTrack(checkpointfMarker);

    var checkpointObj = {
      coords: JSON.stringify(coords),
      time: ''
    }
    this.trackProvider.createCheckpoint(checkpointObj);
  }



  private showCheckpoint(marker) {
    this.featureGroupCheckpoint.addLayer(marker);
  }

  private editDrawEvent() {
    this.map.on('draw:edited', (e) => {
        var layers = e.layers;
        layers.eachLayer(function (layer) {
            //do whatever you want; most likely save back to db
        });
    });
  }
}
