import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { UserDataProvider } from './user-data-provider';
import { MarkerProvider } from './marker-provider';
import { MapProvider } from './map-provider';
import { TrackProvider } from './track-provider';

// 
import * as L from 'mapbox.js';
import * as leafletGeometryutil from 'leaflet-geometryutil';
import * as leafletSnap from 'leaflet-snap';

@Injectable()
export class DevelopProvider {
  private moveMarkerInterval: any;
  // дистанция для привязки к маршруту. Меняется в зависимости от уровня зума
  private dictanceForSnap: number = 15;

  constructor(
    public userDataProvider: UserDataProvider,
    public markerProvider: MarkerProvider,
    public mapProvider: MapProvider,
    public trackProvider: TrackProvider,
    public events: Events
  ) {
    // нужно создать переменные в конструкторе иначе библиотеки не работает
    leafletGeometryutil;
    leafletSnap;
    
    // подписываемся на событие зума для карты
    this.events.subscribe('map: zoom', e => { 
      let data = this.userDataProvider.userData;
      let marker = data.selfMarker;
      marker ? this.setMarkerOnTrack(marker) : null;
    });
  }

  // останавливаем функцию обновления координат маркера
  public stopSelfMoveMarker() {
    clearInterval(this.moveMarkerInterval);

  }
   // for develop
  // функция эмитации поездки по квадрату в реале функция
  // определения координат текущего водителя
  public moveMarker() {
    let data = this.userDataProvider.userData;

    // разрешает/запрешает движение маркера влево
    let left = true;

    // разрешает/запрешает движение маркера вверх
    let up = true;
    
    // для каждого val
    // для правильного подсчета делаем целое число из дробного,
    // выполняем вычитание и снова делаем его дробным
    let val: any;

    // округляем до этого значения знаков после запятой
    let num: any = 5;
    
    // для того чтобы вернуть дробное значение из целого
    let d: any = Math.pow(10, num);
    
    // имя водителя
    let name: string = this.userDataProvider.userData.name;
    // если маркер не создан, создаем маркер
    if (!data.selfMarker) data.selfMarker = this.markerProvider.createAddMarker(name, 'self');
    
    //  // тест на много водителей// для разработки
    // let arr = [];
    // for (let i=0; i<200; i++) {
    //   let n = 'n-' + i;
    //   let m = this.createAddMarker(n);
    //   arr.push(m);
    // }
    // // end тест на много водителей// для разработки

    this.moveMarkerInterval = setInterval(() => {
      if (data.myLongitude > 48.24920654296876 && left) {
        up = true;
        val = (data.myLongitude.toFixed(num)-0) * d;
        data.myLongitude = (val - 1)/d;
      } else if (data.myLatitude < 54.36935859782679 && up) {
        left = false;
        val = (data.myLatitude.toFixed(num)-0) * d;
        data.myLatitude = (val + 1)/d;
      } else if (data.myLongitude <  48.380355834960945 && !left) {
        up = false;
        val = (data.myLongitude.toFixed(num)-0) * d;
        data.myLongitude = (val + 1)/d;
      } else if (data.myLatitude > 54.30801120099681 && !up) {
        val = (data.myLatitude.toFixed(num)-0) * d;
        data.myLatitude = (val - 1)/d;
      } else {
        left = true;
      }
      // // end тест2  на много водителей// для разработки
      // for (let j=0; j< arr.length; j++) {
      //   let l = (((myLatitude.toFixed(num)-0) * d) + j) /100000
      //   let l2 = (((myLongitude.toFixed(num)-0) * d) + j) /100000
      //   arr[j].setLatLng([l, l2 ]);
      // }
      // // end тест2 на много водителей// для разработки

      data.selfMarker.setLatLng([data.myLatitude, data.myLongitude]);
      // если тоггл включег тогда запускаем функцию для позиционируем карты относительно маркера
      if (data.watchToSelfMarker) this.refreshMapCenterPosition(data.myLatitude, data.myLongitude);
    },1000);
    this.setMarkerOnTrack(data.selfMarker);

  }

  // у координат маркера всегда есть погрешность, для этого подправляем их
  // и отрисовываем точно на выбранном маршруте
  public setMarkerOnTrack(marker) {
    let map = this.mapProvider.map;
    

    // в зависимости от уровня зума указать дистанцию привязки к маршруту
    this.distanceCalculationByZoom();

    // snapVertices - более сильная привязка к вершинам.
    let options = {snapDistance: this.dictanceForSnap, snapVertices: false};
    let trackForSnap = this.trackProvider.trackLayer;
    // let latlng = marker.getLatLng();

    marker.snapediting = new L.Handler.MarkerSnap(map, marker, options);
    marker.snapediting.addGuideLayer(trackForSnap);
    marker.snapediting.enable();

  }

  // рассчитаем дистанцию для leaflet.snapDistance т.к. на разных 
  // уровнях зума нужно сделать разную дистанцию для привязки маркера
  private distanceCalculationByZoom() {
    let map = this.mapProvider.map;
    let zoom = map.getZoom();

    console.dir(`zoom: ${zoom}`);
    switch(zoom) {
      case 16: 
        this.dictanceForSnap = 8;
        break;
      case 17: 
        this.dictanceForSnap = 15;
        break;
      case 18:
        this.dictanceForSnap = 25;
        break;
      case 19:
        this.dictanceForSnap = 55;
        break;
      default:
        this. dictanceForSnap = 4;
    }
  }

  // как только маркер водителя подходит к краю карты
  // сделать отключение функции + использовать Polygon.getBounds().contains(MarkerLatLng); 
  private refreshMapCenterPosition(lat, lng) {
    let la = lat;
    let ln = lng;

    let map = this.mapProvider.getMap();
    // координаты видимой области карты
    let bounds = map.getBounds();
    // север
    let northLat = bounds._northEast.lat;
    // восток
    let easthLng = bounds._northEast.lng;
    // юг
    let southLat = bounds._southWest.lat;
    // запад
    let westLng = bounds._southWest.lng;

    if (
      la.toFixed(6) * 1000000 > (northLat.toFixed(6) * 1000000) - 300 || 
      la.toFixed(6) * 1000000 < southLat.toFixed(6) * 1000000 + 300 || 
      ln.toFixed(6) * 1000000 < westLng.toFixed(6) * 1000000 + 300 ||
      ln.toFixed(6) * 1000000 > easthLng.toFixed(6) * 1000000 -300 
    ) {
      map.setView([lat, lng]);
    }

  }
  // end for develop

}
