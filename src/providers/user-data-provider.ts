import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';

import { 
  AngularFire, 
  FirebaseObjectObservable
  // FirebaseListObservable
} from 'angularfire2';

@Injectable()
export class UserDataProvider {
  private userDb: FirebaseObjectObservable<any>;

  userData: {
    uid: string, 
    email: string,
    name: string,
    role: string
  } = {
    uid: '', 
    email: '',
    name: '',
    role: ''
  };

  constructor(
    public fire: AngularFire,
    public events: Events
  ) {

  }

  public getData() {
    this.userDb = this.fire.database.object('/users/' + this.userData.uid);

    this.userDb.forEach(data => {
      if (data.$value === null) {
        // если нет юзера создаем его
        this.createUserData();
      } else {
        this.getUserData(data);
      }
      this.events.publish('userData: finish');
    });
  }

  public updateData(obj: Object) {
    return this.userDb.update(obj);
  }

  private createUserData() {
    this.userDb.set({
      email: this.userData.email,
      publicData: {
        name: '',
        trackNumber: '',
        latitude: 54.30871225899285,   // широта
        longitude: 48.39597702026368, // долгота
        inMove: false
      },
      role: 1
    });
  }

  private getUserData(data: any) {
    this.userData.name = data.publicData.name;
    this.userData.role = data.role;
  }

}
