import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  public allTracks: any;
  public selectedIndexTrack: any = [{number:'', path: ''}];


  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public trackProvider: TrackProvider,
    public userDataProvider: UserDataProvider
  ) {
    
  }

  ngOnInit() { 
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
      drawControl: true,
      minZoom: 9,
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

  private getUserData() {
    this.userDataProvider.getData();
  }

  private createAddMarker() {
    this.myMarker = L.marker([54.4151707, 48.3257941], { draggable: true });
    this.myMarker.addTo(this.map);
  }


  // когда разрастется перенести в отделный провайдер
  // track
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
    });
  }

  private showTrack(path) {
    this.trackLayer.setGeoJSON(path);
  }
  // end track
}
