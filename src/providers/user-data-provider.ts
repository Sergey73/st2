import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { 
  AngularFire, 
  // FirebaseObjectObservable
  FirebaseListObservable
} from 'angularfire2';

@Injectable()
export class UserDataProvider {
  // private userDb: FirebaseObjectObservable<any>;
  private userDb: FirebaseListObservable<any>;

  userData: {
    uid: string, 
    email: string,
    name: string,
    role: string,
    key: string
  } = {
    uid: '', 
    email: '',
    name: '',
    role: '',
    key: ''
  };

  constructor(
    public fire: AngularFire,
    public events: Events
  ) {

  }

  public getData() {
    let value = this.userData.uid ? this.userData.uid : ''
    this.userDb = this.fire.database.list('/users', {
      query: {
        orderByChild: 'uid',
        equalTo: value
        // equalTo:  this.userData.uid
      }
    });

    this.userDb.subscribe(data => {
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

}
