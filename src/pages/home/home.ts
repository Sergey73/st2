import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import * as L from 'mapbox.js';

import { AuthService } from '../../providers/auth';
import { TrackProvider } from '../../providers/track-provider';
import { UserDataProvider } from '../../providers/user-data-provider';
import { LoginPage } from '../../pages/login/login';

// import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public map: any;
  public myMarker: any;
  public trackLayer: any;
  public loadDataUser: boolean = true;

  public allTracks: any;
  public selectedIndexTrack: any = '';
  public featureGroup: any;
  public showBtnStart: boolean = false;


  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public trackProvider: TrackProvider,
    public userDataProvider: UserDataProvider,
    public events: Events
  ) {

  }

  ngOnInit() { 
    // как только данные юзера придут происходит событие
    this.events.subscribe('userData: finish', (data) => {
      this.loadDataUser = false;
    });

    this.initMap();
    this.initTrack();
    this.getUserData();
    this.createAddMarker();
    this.getTracks();
  }

  private initMap() {
    // вынести в константу
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2VyZ2V5NzMiLCJhIjoiY2lyM3JhYnAxMDAyeGh5bnFmczh3cTRseiJ9.KVe54Q2NCigy3J0j3didAA';
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      minZoom: 9,
      // drawControl: true
      // maxBounds: [[54.46605, 48.08372], [53.86225, 50.21576]]
    }).setView([54.33414, 48.42499], 9);
  }

  private initTrack() {
    // слой для маршрута
    this.trackLayer = L.mapbox.featureLayer().addTo(this.map);
  }

  logout() {
    this.authService.logout().then(response => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  // for develop
  moveMarker() {
    var lat: any = 54.30801120099681;
    var lng: any = 48.39649200439454;
    var left = true;
    var up = true;
    var val: any;

    var d: any = 1000;
    var l: any = 3;
    var interval = setInterval(() => {

      if (lng > 48.24920654296876 && left) {
        up = true;
        val = (lng.toFixed(l)-0) * d;
        lng = (val - 1)/d;
      } else if (lat < 54.36935859782679 && up) {
        left = false;
        val = (lat.toFixed(l)-0) * d;
        lat = (val + 1)/d;
      } else if (lng <  48.380355834960945 && !left) {
        up = false;
        val = (lng.toFixed(l)-0) * d;
        lng = (val + 1)/d;
      } else if (lat > 54.30801120099681 && !up) {
        
        val = (lat.toFixed(l)-0) * d;
        lat = (val - 1)/d;
      } else {
        left = true;
      }
      this.myMarker.setLatLng([lat, lng]);
    },100);

  }

  // end for develop
  private getUserData() {
    this.userDataProvider.getData();
  }

  private createAddMarker() {
    this.myMarker = L.marker([54.4151707, 48.3257941], { draggable: true });
    this.myMarker.addTo(this.map);
  }

  public showAllDrivers() {
    this.moveMarker();
    // let lng = 1;
    // let lat = 3;

    // let obj = {
    //   'publicData/latitude': lat,
    //   'publicData/longitude': lng 
    // };

    // this.userDataProvider.updateData(obj).then( authData => {
    //   // показываем кнопку старта
    //   this.showBtnStart = true;
    // }, error => {
    //   console.dir(error);
    // });
  }


  /////////////////// user ////////////////////////
  // выбираем маршрут по которому поедеь
  setUserTrack(number) {
    let obj = {'publicData/trackNumber': number};
    this.userDataProvider.updateData(obj).then( authData => {
      // показываем кнопку старта
      this.showBtnStart = true;
    }, error => {
      console.dir(error);
    });
  }
  /////////////////// end user ////////////////////////


  /////////////////// track ////////////////////////
  private getTracks() {
    this.allTracks = this.trackProvider.getAllTracks();
  }

  selectTrack() {
    var index = this.selectedIndexTrack;
    // this.allTracks.push({"number": 4, "path": "path test"})
    // forEach возвращает массив данных
    this.allTracks.forEach((arr) => {
      let path = JSON.parse(arr[index].path)
      this.showTrack(path);
      this.setUserTrack(arr[index].number);
    });
  }

  private showTrack(path) {
    this.trackLayer.setGeoJSON(path);
  }
  // end track
}
