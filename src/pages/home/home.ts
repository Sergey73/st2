import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
// import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // books: FirebaseListObservable<any>;
  // users: FirebaseObjectObservable<any>;

  constructor(
    public navCtrl: NavController, 
    // fire: AngularFire
    
  ) {
    // this.books = fire.database.list('/books');
    // this.users = fire.database.object('/users');
    
  }

  presentAlert() {
 
  }

  loginP():void {
    
  }

}
