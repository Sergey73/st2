import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import "rxjs/add/operator/take";

import * as L from 'mapbox.js';

// providers
import { MapProvider } from './map-provider';
import { UserDataProvider } from './user-data-provider';

import { 
  AngularFire, 
  FirebaseListObservable
} from 'angularfire2';


@Injectable()
export class TrackProvider {
  private tracksDb: FirebaseListObservable<any>;
  // все существующие маршруты. ( переделать на allTracksData)
  public tracksData: Array<any>;
  // карта 
  public map: any;
  // слой для маршрута
  public trackLayer: any;

  // маршрут который выбрал юзер, по которому поедет
  public selectedTrack: {
    path: any,
    number: number
  } = {
    path: null,
    number: null
  };

  constructor(
    public fire: AngularFire,
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
    this.tracksDb = this.fire.database.list(
      '/tracks/', 
      {
        query: {
          orderByChild: 'number'
        }
      }
    );

    this.tracksDb.take(1).subscribe(data => {
      this.tracksData = data;
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

    // добавлямв маршрут в слой
    this.trackLayer.setGeoJSON(path);
  }
  

}
