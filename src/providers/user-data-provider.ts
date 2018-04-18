import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
// import { Observable } from 'rxjs/Observable';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

import "rxjs/add/operator/take";

@Injectable()
export class UserDataProvider {
  private userDb: AngularFireList<any>;
  // private userObs: Observable<any[]>;

  userData: {
    email: string,
    inMove: boolean,      // если false другие водители не будут получать координаты этого водителя
    key: string,          // ключ в БД
    myLatitude: any,
    myLongitude: any,
    heading: number,
    name: string,
    role: string,
    selfMarker: any,      // маркер своего местоположения 
    timeStartLap: string,
    trackNumber: number,  // номер маршрута
    uid: string, 
    watchToSelfMarker: boolean  // тоггл для позиционирования карты относительно маркера
    // добавить поле чтобы определить водитель на маршруте или нет,
    // надо для восстановление данных времени по маршруту
  } = {
    email: '',
    inMove: false,
    key: '',
    myLatitude: 54.30801120099681,
    myLongitude: 48.39649200439454,
    heading: 0,
    name: '',
    role: '',
    selfMarker: null,
    timeStartLap: '',
    trackNumber: null,
    uid: '', 
    watchToSelfMarker: false
  };

  constructor(
    public fireDb: AngularFireDatabase,
    public events: Events
  ) {

  }

  public getData() {
    let uidValue = this.userData.uid ? this.userData.uid : '';

    this.userDb = this.fireDb.list('/users', (ref) => {
      return  ref.orderByChild('publicData/uid').equalTo(uidValue);
    });

    this.userDb.snapshotChanges().take(1).subscribe(data => {
      if (!data.length) {
        // если нет юзера создаем его
        this.createUserData();
      } else {
        this.getUserData(data[0]);
      }
      this.events.publish('userData: finish');
    });
    
    // this.userObs = this.userDb.valueChanges();

    // this.userObs.take(1).subscribe(data => {
    //   debugger;
    //   if (!data.length) {
    //     // если нет юзера создаем его
    //     this.createUserData();
    //   } else {
    //     this.getUserData(data[0]);
    //   }
    //   this.events.publish('userData: finish');
    // });
  }

  
  public updateData(obj: Object) {
    return this.userDb.update(this.userData.key, obj);
  }

  private createUserData() {
    this.userDb.push({
      email: this.userData.email,
      publicData: {
        name: '',
        trackNumber: null,
        latitude: 54.30871225899285,   // широта
        longitude: 48.39597702026368, // долгота
        inMove: false,
        uid: this.userData.uid
      },
      role: 1
    }).then(data => {
      this.userData.key = data.key;
    });
  }

  private getUserData(data: any) {
    const obj = data.payload.val();
    this.userData.key = data.key;
    this.userData.name = obj.publicData.name;
    this.userData.role = obj.role;
    this.userData.timeStartLap = obj.publicData.timeStartLap;
  }

}
