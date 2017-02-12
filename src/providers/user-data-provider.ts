import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';

import { 
  AngularFire, 
  FirebaseObjectObservable,
  FirebaseListObservable
} from 'angularfire2';

@Injectable()
export class UserDataProvider {
  user: FirebaseObjectObservable<any>;
  userDataAuth: any;

  constructor(
    public http: Http,
    public fire: AngularFire
  ) {
    this.userDataAuth = {};
  }

  getData() {
    this.user = this.fire.database.object('/users/' + this.userDataAuth.uid);
    this.user.subscribe(userData => {
      if (userData.$value === null) {
        // если нет юзер создаем его
        this.saveUser();
      } else {
        this.userDataAuth.name = userData.publicData.name;
      }
    });
  }

  private saveUser() {
    this.user.set({
      email: this.userDataAuth.email,
      publicData: {
        name: 'user',
      },
      role: 1
    });
  }

}
