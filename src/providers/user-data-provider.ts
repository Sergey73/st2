import { Injectable } from '@angular/core';


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
    public fire: AngularFire
  ) {

  }

  getData() {
    this.userDb = this.fire.database.object('/users/' + this.userData.uid);
    this.userDb.subscribe(data => {
      if (data.$value === null) {
        // если нет юзера создаем его
        this.createUserData();
      } else {
        this.getUserData(data);
      }
    });
  }

  public updateData (obj: Object) {
    return this.userDb.update(obj);
  }

  private createUserData() {
    this.userDb.set({
      email: this.userData.email,
      publicData: {
        name: '',
      },
      role: 1
    });
  }

  private getUserData(data: any) {
    this.userData.name = data.publicData.name;
    this.userData.role = data.role;
  }

}
