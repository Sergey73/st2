import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { 
  AngularFire, 
  FirebaseObjectObservable,
  FirebaseListObservable
} from 'angularfire2';

import "rxjs/add/operator/take";

@Injectable()
export class UserDataProvider {
  // public needUpdateUsersDb: FirebaseObjectObservable<any>;
  private userDb: FirebaseListObservable<any>;
  userData: {
    uid: string, 
    email: string,
    name: string,
    role: string,
    key: string,          // ключ в БД
    trackNumber: number,  // номер маршрута
    inMove: boolean,      // если false другие водители не будут получать координаты этого водителя
    selfMarker: any,      // маркер своего местоположения 
    myLatitude: any,
    myLongitude: any,
    watchToSelfMarker: boolean  // тоггл для позиционирования карты относительно маркера
  } = {
    uid: '', 
    email: '',
    name: '',
    role: '',
    key: '',
    trackNumber: null,
    inMove: false,
    selfMarker: null,
    myLatitude: 54.30801120099681,
    myLongitude: 48.39649200439454,
    watchToSelfMarker: false
  };

  constructor(
    public fire: AngularFire,
    public events: Events
  ) {

  }

  public getData() {
    let uidValue = this.userData.uid ? this.userData.uid : '';
    this.userDb = this.fire.database.list('/users', {
      query: {
        orderByChild: 'publicData/uid',
        equalTo: uidValue
      }
    });

    this.userDb.take(1).subscribe(data => {
      if (!data.length) {
        // если нет юзера создаем его
        this.createUserData();
      } else {
        this.getUserData(data[0]);
      }
      this.events.publish('userData: finish');
    });
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
    this.userData.name = data.publicData.name;
    this.userData.role = data.role;
    this.userData.key = data.$key;
  }

}
