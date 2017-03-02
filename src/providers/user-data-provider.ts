import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { 
  AngularFire, 
  // FirebaseObjectObservable
  FirebaseListObservable
} from 'angularfire2';

import "rxjs/add/operator/take";

@Injectable()
export class UserDataProvider {
  // private userDb: FirebaseObjectObservable<any>;
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

  public getData() {
    let uidValue = this.userData.uid ? this.userData.uid : '';
    this.userDb = this.fire.database.list('/users', {
      query: {
        orderByChild: 'uid',
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
      uid: this.userData.uid,
      email: this.userData.email,
      publicData: {
        name: '',
        trackNumber: '',
        latitude: 54.30871225899285,   // широта
        longitude: 48.39597702026368, // долгота
        inMove: false
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
          if (item.publicData.inMove && this.userData.uid != item.uid) return item; 
        })
      }
      this.events.publish('usersByTrackData: finish');
    });
  }
}
