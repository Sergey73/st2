import { Injectable } from '@angular/core';

import { UserDataProvider } from './user-data-provider';
import { MarkerProvider } from './marker-provider';

@Injectable()
export class DevelopProvider {
  private moveMarkerInterval: any;

  constructor(
    public userDataProvider: UserDataProvider,
    public markerProvider: MarkerProvider,
  ) {

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

    // let myLatitude = this.userDataProvider.userData.myLatitude;
    // let myLongitude = this.userDataProvider.userData.myLongitude;
    // let selfMarker =  this.userDataProvider.userData.selfMarker;
    
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
    if (!data.selfMarker) data.selfMarker = this.markerProvider.createAddMarker(name);
    
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
    },1000);

  }
  // end for develop

}
