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
  public needUpdateUsersDb: FirebaseObjectObservable<any>;
  private userDb: FirebaseListObservable<any>;
  private usersDb: FirebaseListObservable<any>;
  userData: {
    uid: string, 
    email: string,
    name: string,
    role: string,
    key: string,
    trackNumber: string,
    usersByTrack: Array<any>
  } = {
    uid: '', 
    email: '',
    name: '',
    role: '',
    key: '',
    trackNumber: '',
    usersByTrack: []
  };

  constructor(
    public fire: AngularFire,
    public events: Events
  ) {

  }

  // функция будет вызывать подписку и говорить о том что нужно обновить 
  // список водителей
  public listenNeedUpdateUsersData() {
    this.needUpdateUsersDb = this.fire.database.object('/needUpdateUsersData');

    this.needUpdateUsersDb.subscribe(data => {
      if (data.userKey === 'null') return;
      this.events.publish('needUpdateUsersData: true', data);
    });
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

  public updateUsersByTrack(userKey: string, obj: Object) {
    return this.usersDb.update(userKey, obj);
  }
  
  public updateData(obj: Object) {
    return this.userDb.update(this.userData.key, obj);
  }

  private createUserData() {
    this.userDb.push({
      email: this.userData.email,
      publicData: {
        name: '',
        trackNumber: '',
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

  // обновляем значение в БД тем самым сработает подписка на событие в других приложения 
  // и юзер с данным ключем будет удален с карты
  public needUpdateAllUsersData(key: string) {
    return this.needUpdateUsersDb.update({'userKey': key});
  }

  public getUsersByTrack() {
    let trackNumber = this.userData.trackNumber;

    this.usersDb = this.fire.database.list('/users', {
      query: {
        orderByChild: 'publicData/trackNumber',
        equalTo: trackNumber
      }
    });

    this.usersDb.take(1).subscribe(data => {
      if (data.length) {
        this.userData.usersByTrack = data.filter(item => {
          // получаем все данные водителей у которых inMove = true, исключая текущего юзера
          if (item.publicData.inMove && this.userData.uid != item.publicData.uid) return item; 
        })
      }
      this.events.publish('usersByTrackData: finish');
    });
  }
}
