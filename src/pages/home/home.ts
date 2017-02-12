import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import * as L from 'mapbox.js';

import { AuthService } from '../../providers/auth';
import { UserDataProvider } from '../../providers/user-data-provider';
import { LoginPage } from '../../pages/login/login';

// import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  // books: FirebaseListObservable<any>;
  // users: FirebaseObjectObservable<any>;
  map: any;
  userA: any;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public userDataProvider: UserDataProvider
    // fire: AngularFire
    
  ) {
    
    // this.books = fire.database.list('/books');
    // this.users = fire.database.object('/users');
    
  }

  ngOnInit() { 
    this.initMap();
    this.getUserData();
    // setTimeout(data => {
    //   this.userDataProvider.user
    //   debugger;
    // }, 6000);
  }

  initMap() {
    // вынести в константу
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2VyZ2V5NzMiLCJhIjoiY2lyM3JhYnAxMDAyeGh5bnFmczh3cTRseiJ9.KVe54Q2NCigy3J0j3didAA';
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      // drawControl: this.showAdminTools,
      minZoom: 9,
      // maxBounds: [[54.46605, 48.08372], [53.86225, 50.21576]]
    }).setView([54.33414, 48.42499], 9);
  }

  logout() {
    this.authService.logout().then(response => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  getUserData() {
    this.userDataProvider.getData();
    this.userA = this.userDataProvider.userDataAuth;
  }
}
