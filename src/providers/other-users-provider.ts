import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { 
  AngularFire, 
  FirebaseListObservable
} from 'angularfire2';

import "rxjs/add/operator/take";

// провайдер текущего юзера
import { UserDataProvider } from './user-data-provider';

@Injectable()
export class OtherUsersProvider {
  // private userDb: FirebaseListObservable<any>;
  private usersDb: FirebaseListObservable<any>;

  usersDataByTrack: {
    offline: Array<any>,
    online: Array<any>
  } = {
    offline: [],
    online: []
  };

  constructor(
    public fire: AngularFire,
    public events: Events,
    // данные водителей по выбранному маршруту
    public userDataProvider: UserDataProvider,

  ) {

  }

  // обновление данных конкретного водителя по ключу
  public updateUsersByTrack(userKey: string, obj: Object) {
    return this.usersDb.update(userKey, obj);
  }

  // получаем всех юзеров, которые находятся на маршруте,
  // который выбрал текущий юзер
  public getUsersByTrack() {
    let trackNumber = this.userDataProvider.userData.trackNumber;

    this.usersDb = this.fire.database.list('/users', {
      query: {
        orderByChild: 'publicData/trackNumber',
        equalTo: trackNumber
      }
    });

    this.usersDb.take(1).subscribe(data => {
      this.sortingDataUsersByTrack(data);
    });
  }

  // делим полученных водителей на тек кто online и offline
  private sortingDataUsersByTrack(data: Array<any>) {
    this.usersDataByTrack.online = [];
    this.usersDataByTrack.offline = [];
    if (data.length) {
      data.map(item => {
        // вырезаем текущего пользоваетеля из массива
        if (item.publicData.inMove && this.userDataProvider.userData.uid != item.publicData.uid) {
          this.usersDataByTrack.online.push(item);

        } else if (this.userDataProvider.userData.uid != item.publicData.uid) {
          this.usersDataByTrack.offline.push(item);
        }
      });
    }

    this.events.publish('usersByTrackData: finish');
  }
}
