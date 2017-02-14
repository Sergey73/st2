import { Injectable } from '@angular/core';

import { 
  AngularFire, 
  FirebaseObjectObservable
  // FirebaseListObservable
} from 'angularfire2';


@Injectable()
export class TrackProvider {
  private tracksDb: FirebaseObjectObservable<any>;
  
  constructor(public fire: AngularFire) {

  }


  getAllTracks() {
   return this.tracksDb = this.fire.database.object('/tracks/');
  }

    // this.tracksDb = this.fire.database.object('/users/' + this.userData.uid);

    // this.userDb.subscribe(data => {
    //   if (data.$value === null) {
    //     // если нет юзера создаем его
    //     this.createUserData();
    //   } else {
    //     this.getUserData(data);
    //   }
    // });

}
