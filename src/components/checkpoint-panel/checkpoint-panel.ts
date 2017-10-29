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

import { Checkpoint } from '../../interfaces/Checkpoint';

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
  private selectedCheckpointMarker: any; // выбранный элемент для редактирования
  private currentChecpointObj: Checkpoint;

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
      this.coutnerPoint = this.coutnerPoint ? 
        ++this.coutnerPoint : 1;
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

      this.currentChecpointObj = {
        coords: JSON.stringify(coords),
        time: time,
        num: this.coutnerPoint
      }
      
    });
  }
  
  public saveCheckpointData() {
    // либо создаем новую точку, либо обновляем 
  }

  public saveCheckpointInBd(){
    this.trackProvider.saveCheckpointInBd(this.currentChecpointObj);
  }

  public updateCheckpointInBd(){
    // обновляем контрольную точку
    // this.trackProvider.updateCheckpoint('-Kx9EhFcLeBQuTKsuHDN', obj);
  }
 
  private createLabel(time) {
    return `<div class="checkpoint-label">
      ${time}
      точка № ${this.coutnerPoint}
    </div>`;
  }
  
  private createCheckpoint(coords, label) {
    let checkpointMarker = this.markerProvider.createMarker(label, 'checkpoint');
    checkpointMarker.setLatLng(coords);
    checkpointMarker.on('click', e => {
      let markerIconClass = 'selected';

      // удаляем класс с выбранного маркера
      this.selectedCheckpointMarker ? 
        this.selectedCheckpointMarker.classList.remove(markerIconClass) : null;
      
      // сохраняем в переменную новый выбранный маркер
      this.selectedCheckpointMarker = e.originalEvent.target;

      // устанавливать класс редактируемого маркера
      this.selectedCheckpointMarker.classList.add(markerIconClass);
    });
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
        console.dir('SAVE');
        layers.eachLayer(function (layer) {
            //do whatever you want; most likely save back to db
        });
    });
  }
}
