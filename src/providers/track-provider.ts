import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import "rxjs/add/operator/take";

import { 
  AngularFire, 
  FirebaseObjectObservable,
  FirebaseListObservable
} from 'angularfire2';


@Injectable()
export class TrackProvider {
  private tracksDb: FirebaseListObservable<any>;
  private activeTracksDb: FirebaseObjectObservable<any>;
  public tracksData: Array<any>;

  constructor(
    public fire: AngularFire,
    public events: Events
    ) {

  }

  getAllTracks() {
    this.tracksDb = this.fire.database.list(
      '/tracks/', 
      {
        query: {
          orderByChild: 'number'
        }
      }
    );

    this.tracksDb.take(1).subscribe(data => {
      // if (!data.length) {
      //   // если нет юзера создаем его
      //   this.createUserData();
      // } else {
      //   this.getUserData(data[0]);
      // }
      this.tracksData = data;
      this.events.publish('tracksData: finish');
    });
  }

  createTrack(trackData) {
    return this.tracksDb.push(trackData);
  }

}
