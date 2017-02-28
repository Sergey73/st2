import { Injectable } from '@angular/core';

import { 
  AngularFire, 
  FirebaseObjectObservable,
  FirebaseListObservable
} from 'angularfire2';


@Injectable()
export class TrackProvider {
  private tracksDb: FirebaseListObservable<any>;
  private activeTracksDb: FirebaseObjectObservable<any>;
  
  constructor(public fire: AngularFire) {

  }

  getAllTracks() {
    return this.tracksDb = this.fire.database.list(
      '/tracks/', 
      {
        query: {
          orderByChild: 'number'
        }
      }
    );
  }

  createTrack(trackData) {
    return this.tracksDb.push(trackData);
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

    // active track
    setActiveTrack(trackNumber: any) {
      this.activeTracksDb = this.fire.database.object('/activeTrack/' + trackNumber);
      this.activeTracksDb.set( [{x:1}] );
    }
    // end active track
}
