import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/take";

import * as L from 'mapbox.js';

// providers
import { MapProvider } from './map-provider';
import { UserDataProvider } from './user-data-provider';

// iface
import { Checkpoint } from '../interfaces/Checkpoint';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';


@Injectable()
export class TrackProvider {
  // private tracksDb: FirebaseListObservable<any>;
  private tracksDb: AngularFireList<any>;
  // private tracksObs: Observable<any[]>;

  // все существующие маршруты. ( переделать на allTracksData)
  public tracksData: Array<any>;
  // карта 
  public map: any;
  // слой для маршрута
  public trackLayer: any;

  // маршрут который выбрал юзер, по которому поедет
  public selectedTrack: {
    path: any,
    number: number,
    key: string,
    checkpoint: object
  } = {
    path: null,
    number: null,
    key: '',
    checkpoint: {}
  };

  constructor(
    public fireDb: AngularFireDatabase,
    public events: Events,
    public mapProvider: MapProvider,
    public userDataProvider: UserDataProvider
    ) {
  }

  public createTrackLayer() {
    // получаем карту 
    let map = this.mapProvider.getMap();

    // слой для маршрута
    this.trackLayer = L.mapbox.featureLayer().addTo(map);
  }

  // получаем все маршруты из базы
  public getAllTracks() {
    this.tracksDb = this.fireDb.list('/tracks/', ref => ref.orderByChild('number'));

    this.tracksDb.snapshotChanges().take(1).subscribe(dataSnap => {
      // добавляем ключь к данным
      this.tracksData = dataSnap.map(data => ({ key: data.payload.key, ...data.payload.val() }));
      this.events.publish('tracksData: finish');
    });
  }

  // сохраняем маршрут в базу 
  public createTrack(trackData) {
    return this.tracksDb.push(trackData);
  }

  // отрисовываем маршрут на карте 
  public showTrack(index) {
    // массив существующих маршрутов
    let arr =  this.tracksData;

    // сохраняем выбранный маршрут который будем отслеживать
    this.userDataProvider.userData.trackNumber = arr[index].number;

    // парсим путь маршрута для отображения на карте
    let path = JSON.parse(arr[index].path);
    // сохраняем данные о выбранном маршруте
    this.selectedTrack.key = arr[index].key;
    this.selectedTrack.path = path;
    this.selectedTrack.number = arr[index].number;
    this.selectedTrack.checkpoint = arr[index].checkpoint ? arr[index].checkpoint : {};
  
    // событие после которого будут отрисованы контрольные точки
    this.events.publish('trackProvider: trackShown');

    // добавлямв маршрут в слой
    this.trackLayer.setGeoJSON(path);
  }

  // добавляем данные контрольной точки в БД
  public saveCheckpointInBd(obj) {
    // let ref = this.tracksDb.$ref.ref;
    // let arrPoint = ref.child(this.selectedTrack.key + '/checkpoint').push();
    // arrPoint.set(obj);
    const ref = this.fireDb.list('/tracks/' + this.selectedTrack.key + '/checkpoint')
    ref.push(obj).then(res => {
      // добавляем точку в локальный массив, 
      // чтобы без перезагрузки были виды изменения 
      this.selectedTrack.checkpoint[res.key] = obj;
    });
  }

  // обновление данных контрольной точки в БД
  public updateCheckpoint(key: string, obj) {
    /*this.tracksDb.$ref.ref
      .child(`${this.selectedTrack.key}/checkpoint/${key}`)
      .update(obj);*/
    this.fireDb
      .list(`/tracks/${this.selectedTrack.key}/checkpoint`)
      .update(key, obj)
      .catch(err => console.log(err));
  }

  public removeCheckpointFromBd(key) {
    this.fireDb
      .list(`/tracks/${this.selectedTrack.key}/checkpoint`)
      .remove(key);
  }
}
