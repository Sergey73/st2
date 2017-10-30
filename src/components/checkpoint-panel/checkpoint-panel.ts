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
import { Coords } from '../../interfaces/Coords';

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
  private selectedCheckpointMarker: any; // выбранный маркер для редактирования
  private checpointObjForSaveDB: Checkpoint;

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
    this.moveMarker();

    this.events.subscribe('trackProvider: trackShown', () => {
      this.drawCheckpointOnTrack();
    });
  }

  // создание новой контрольной точки
  private ceateDrawEvent() {
    this.map.on('draw:created', (e) => { 
      // убираем выделение с выделенной контрольной точки
      this.selectedCheckpointMarker = null;
      // удаляем класс
      let markerIconClass = 'selected';
      this.removeMarkerClass(markerIconClass);

      let layerType = e.layerType;
      if (layerType !== 'marker') return;
      
      if ( !this.userData || !this.userData.trackNumber){
        let message: string = 'выберите маршрут для привязки маркера!';
        this.toast.showMsg(message);
        return;
      } 

      // если время точки не проставлено выходим из функции
      if ( !this.chckTimePoint()){return } 

      // номер контрольной точки
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
      // создаем контрольную точку для сохранения в БД
      this.createCheckpoint(coords, label);

      // объект который еще не сохранен в БД но отрисован на карте
      this.checpointObjForSaveDB = {
        coords: JSON.stringify(coords),
        time: time,
        num: this.coutnerPoint
      }
      
    });
  }
  
  private chckTimePoint(): boolean {
    if ( !this.timePoint){
      let message: string = 'Задайте время точки!';
      this.toast.showMsg(message);
      return false;
    } 
    return true;
  }
  
  public saveCheckpointData() {
    // либо создаем новую точку, либо обновляем 
    this.selectedCheckpointMarker === null ? 
      this.saveCheckpointInBd() : 
      this.updateCheckpointInBd();
  }

  private saveCheckpointInBd(){
    this.trackProvider.saveCheckpointInBd(this.checpointObjForSaveDB);
  }

  private updateCheckpointInBd(){
    // ключ в БД
    let key: string = this.selectedCheckpointMarker.target.options.key;
    
    // если время точки не проставлено выходим из функции
    if ( !this.chckTimePoint()){return } 
    
    // создаем объект с новыми данными для обновления контрольной точки
    let updatedCheckpointObj = {
      coords: JSON.stringify(this.selectedCheckpointMarker.target.getLatLng()),
      time: this.timePoint
    };

    // обновляем контрольную точку
    this.trackProvider.updateCheckpoint(key, updatedCheckpointObj);
  }
 
  private createLabel(time) {
    return `<div class="checkpoint-label">
      ${time}
      точка № ${this.coutnerPoint}
    </div>`;
  }
  
  // переменная key для обращения к контрольной точке, по id привсоенного в БД
  private createCheckpoint(coords: Coords, label: string, key?: string, time?: string) {
    let checkpointMarker = this.markerProvider.createMarker(label, 'checkpoint');
    checkpointMarker.setLatLng(coords);
    checkpointMarker.options.key = key;
    checkpointMarker.options.time = time;
    checkpointMarker.on('click', e => {
      this.checpointObjForSaveDB = null;

      let markerIconClass = 'selected';
      // удаляем класс с предыдущего выбранного маркера
      this.selectedCheckpointMarker ? 
        this.removeMarkerClass(markerIconClass) : null;
      
      // сохраняем в переменную новый выбранный маркер, который хотим редактировать
      this.selectedCheckpointMarker = e;

      // устанавливать класс редактируемого маркера
      this.addMarkerClass(markerIconClass);
      // устанавлилваем время контрольной точки в поле для редактирования
      this.timePoint = e.target.options.time;
    });
    this.showCheckpoint(checkpointMarker);
    this.developProvider.setMarkerOnTrack(checkpointMarker);
  }

  private removeMarkerClass(markerIconClass: string) {
    this.selectedCheckpointMarker.originalEvent.target.classList.remove(markerIconClass);
  }
  private addMarkerClass(markerIconClass: string) {
    this.selectedCheckpointMarker.originalEvent.target.classList.add(markerIconClass);
  }

  private drawCheckpointOnTrack() {
    for(let key in this.trackProvider.selectedTrack.checkpoint) {
      let point = this.trackProvider.selectedTrack.checkpoint[key];
      let coords: Coords = JSON.parse(point.coords);
      this.coutnerPoint = +point.num;
      let time = point.time;
      let label = this.createLabel(time); 
      this.createCheckpoint(coords, label, key, time);
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
  private moveMarker() {
    this.map.on('draw:editmove ', (e) => {
        var layers = e.layers;
        console.dir('move');
        console.dir(e);
        console.dir('move end');
        //layers.eachLayer(function (layer) {
            //do whatever you want; most likely save back to db
        //});
    });
  }
}
