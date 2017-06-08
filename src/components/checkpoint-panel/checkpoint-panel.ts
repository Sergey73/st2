import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
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
  private coutnerPoint: number; // счетчик количества маркеров
  private timePoint: string // через какое время нужно быть в точке полсе старта
  private userData: any;
  private featureGroupCheckpoint: any;

  constructor(
    public events: Events,
    public toastCtrl: ToastController,
    public mapProvider: MapProvider,
    public markerProvider: MarkerProvider,
    public userDataProvider: UserDataProvider,
    public developProvider: DevelopProvider,
    public trackProvider: TrackProvider

  ) {
    // нужен сдесь иначе модуль не работает.
    leafletDraw;
    this.timePoint = '';
  }

  public ngOnInit() {
    this.map = this.mapProvider.getMap();
    this.featureGroupCheckpoint = this.mapProvider.featureGroupCheckpoint;
    this.userData = this.userDataProvider.userData;
    this.ceateDrawEvent();
    this.editDrawEvent();

    this.events.subscribe('tracksData: selectedDataCreated', () => {
      this.x();
    });
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

      this.coutnerPoint = this.coutnerPoint ? ++this.coutnerPoint : 1;
      let coords = e.layer.getLatLng();
      let time = this.timePoint;
      let label = this.createLabel(time);
      this.createCheckpoint(coords, label);

      var checkpointObj = {
        coords: JSON.stringify(coords),
        time: time,
        num: this.coutnerPoint
      }
      this.timePoint
      this.trackProvider.createCheckpoint(checkpointObj);
    });
  }

  private createCheckpoint(coords, label) {
    let checkpointfMarker = this.markerProvider.createAddMarker(label, 'checkpoint');
    checkpointfMarker.setLatLng(coords);
    this.showCheckpoint(checkpointfMarker);
    this.developProvider.setMarkerOnTrack(checkpointfMarker);
  }

  private x() {
    for(let key in this.trackProvider.selectedTrack.checkpoint) {
      let point = this.trackProvider.selectedTrack.checkpoint[key];
      let coords = JSON.parse(point.coords);
      this.coutnerPoint = +point.num;
      let label = this.createLabel(point.time) 
      this.createCheckpoint(coords, label);
    }
  }

  private showCheckpoint(marker) {
    this.featureGroupCheckpoint.addLayer(marker);
  }

  private createLabel(time) {
    return '<div class="checkpoint-marker">' + time + 
    '<div/><div> точка №' + this.coutnerPoint + '<div>';
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
