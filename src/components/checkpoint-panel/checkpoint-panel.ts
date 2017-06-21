import { Component } from '@angular/core';
import { Events } from 'ionic-angular';

import * as leafletDraw from 'leaflet-draw';
import * as moment from 'moment';
import { MapProvider } from '../../providers/map-provider';
import { MarkerProvider } from '../../providers/marker-provider';
import { UserDataProvider } from '../../providers/user-data-provider';
import { DevelopProvider } from '../../providers/develop-provider';
import { TrackProvider } from '../../providers/track-provider';
import { ToastService } from '../../services/toast.service';

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
    public mapProvider: MapProvider,
    public markerProvider: MarkerProvider,
    public userDataProvider: UserDataProvider,
    public developProvider: DevelopProvider,
    public trackProvider: TrackProvider,
    public toast: ToastService
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

    this.events.subscribe('trackProvider: trackShown', () => {
      this.drawCheckpointOnTrack();
    });
  }

  private ceateDrawEvent() {
    this.map.on('draw:created', (e) => { 
      let layerType = e.layerType;
      if (layerType !== 'marker') return;
      
      if ( !this.userData || !this.userData.trackNumber){
        let message: string = 'выберите маршрут для привязки маркера!';
        this.toast.showMsg(message);
        return;
      } 
      if ( !this.timePoint){
        let message: string = 'Задайте время точки!';
        this.toast.showMsg(message);
        return;
      } 

      // номер маркера
      this.coutnerPoint = this.coutnerPoint ? ++this.coutnerPoint : 1;
      let coords = e.layer.getLatLng();

      // сохранение в бд в миллисекундах
      // // время через которое нужно быть в точке,  если точку старта брать за нуль.
      // let arrTime = this.timePoint.split(':');

      // // время которое будем отнимать 
      // let timeA: any = moment({ 
      //   hour: +arrTime[0], 
      //   minute: +arrTime[1],
      //   second: +arrTime[2]
      // });

      // // сегодняшнее число со временем 00:00:00
      // let timeB: any = moment({hour: 0});

      // // время в миллисекундах 
      // let time = timeA - timeB;
      // end сохранение в бд в миллисекундах

      let time = this.timePoint;

      let label = this.createLabel(time);
      this.createCheckpoint(coords, label);

      var checkpointObj = {
        coords: JSON.stringify(coords),
        time: time,
        num: this.coutnerPoint
      }
      
      this.trackProvider.saveCheckpointInBd(checkpointObj);
    });
  }

  private createLabel(time) {
    return `<div class="checkpoint-marker">
      ${time}
      точка № ${this.coutnerPoint}
    </div>`;
  }
  
  private createCheckpoint(coords, label) {
    let checkpointMarker = this.markerProvider.createMarker(label, 'checkpoint');
    checkpointMarker.setLatLng(coords);
    this.showCheckpoint(checkpointMarker);
    this.developProvider.setMarkerOnTrack(checkpointMarker);
  }

  private drawCheckpointOnTrack() {
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

  private editDrawEvent() {
    this.map.on('draw:edited', (e) => {
        var layers = e.layers;
        layers.eachLayer(function (layer) {
            //do whatever you want; most likely save back to db
        });
    });
  }
}
