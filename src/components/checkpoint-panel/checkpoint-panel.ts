import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

import * as leafletDraw from 'leaflet-draw';
import * as moment from 'moment';
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
    moment;
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
    
    this.events.subscribe('home: pushGoBtn', () => {
      this.setLabelTime();
    });
  }

  private ceateDrawEvent() {
    this.map.on('draw:created', (e) => { 
      let layerType = e.layerType;
      if (layerType !== 'marker') return;
      
      // сделать сервис с тостами 
      if ( !this.userData.trackNumber){
        let toast = this.toastCtrl.create({
          message: 'выберите маршрут для привязки маркера!',
          duration: 3000
        });
        toast.present();
        return;
      } 
      if ( !this.timePoint){
        let toast = this.toastCtrl.create({
          message: 'Задайте время точки!',
          duration: 3000
        });
        toast.present();
        return;
      } 

      // номер маркера
      this.coutnerPoint = this.coutnerPoint ? ++this.coutnerPoint : 1;
      let coords = e.layer.getLatLng();
      // время через которое нужно быть в точке,  если точку старта брать за нуль.
      let arrTime = this.timePoint.split(':');

      // время которое будем отнимать 
      let timeA: any = moment({ 
        hour: +arrTime[0], 
        minute: +arrTime[1],
        second: +arrTime[2]
      });

      let timeB: any = moment({hour: 0});
      // время в миллисекундах 
      let time = timeA - timeB;

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

  //устанавливаем время + проверяем устанавливалось ли оно
  private setLabelTime() {

    this.featureGroupCheckpoint.clearLayers();
    // this.featureGroupCheckpoint.eachLayer(layer => {
    //   console.dir(layer);
    //   let tooltip = layer.getTooltip();
    //   this.trackProvider.selectedTrack.checkpoint

    // });

    let m = moment;

    for(let key in this.trackProvider.selectedTrack.checkpoint) {
      let point = this.trackProvider.selectedTrack.checkpoint[key];
      let coords = JSON.parse(point.coords);
      this.coutnerPoint = +point.num;
      let time = moment(point.time, 'HH:mm:ss')
      let label = this.createLabel(time) 
      this.createCheckpoint(coords, label);
    }
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
