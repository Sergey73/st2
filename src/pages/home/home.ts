import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';

import * as L from 'mapbox.js';

import { AuthService } from '../../providers/auth';
import { TrackProvider } from '../../providers/track-provider';
import { UserDataProvider } from '../../providers/user-data-provider';
import { LoginPage } from '../../pages/login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public map: any;
  public trackLayer: any;
  
  // выбранный маршрут
  public selectedTrack: number;

  // флаг для отображения селекта выбора номера маршрута
  // если не ставить селект появляется с пустым значением 
  // тк данные еще не загружены
  public loadDataUser: boolean = true;
  public allTracks: any;
  // выбранный маршрут 
  public selectedIndexTrack: any = '';
  public showBtnStart: boolean = false;
  public showBtnStop: boolean = false;
  // если false другие водители не будут получать координаты этого водителя
  private inMove: boolean = false;

  // 
  private updateCoordsInterval: any;

  private myLatitude: any;
  private myLongitude: any;

  private arr: Object = {};

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

    // слушает когда придут данные других водителей
    this.events.subscribe('usersByTrackData: finish', () => {
      this.userDataProvider.userData.usersByTrack.forEach(item => {
        if (!this.arr[item.$key] ) {
          let marker = this.createAddMarker();
          this.arr[item.$key] = marker;
        }
        this.arr[item.$key].setLatLng([item.publicData.latitude, item.publicData.longitude]);
      });
    });

    this.initMap();
    this.initTrack();
    this.getUserData();
    this.getTracks();
  }

  private initMap() {
    // вынести в константу
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2VyZ2V5NzMiLCJhIjoiY2lyM3JhNXR1MDAydGh6bWM3ZzBjaGlrYyJ9.MxdICo0uhxAtmyWpA_CeVw';
    this.map = L.mapbox.map('map', 'mapbox.streets', {
      minZoom: 10,
      // drawControl: true
      // maxBounds: [[54.46605, 48.08372], [53.86225, 50.21576]]
    }).setView([54.33414, 48.42499], 10);
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
  // функция эмитации поездки по квадрату в реале функция
  // определения координат текущего водителя
  moveMarker() {
    this.myLatitude = 54.30801120099681;
    this.myLongitude = 48.39649200439454;
    
    // разрешает/запрешает движение маркера влево
    let left = true;

    // разрешает/запрешает движение маркера вверх
    let up = true;
    
    // для каждого val
    // для правильного подсчета делаем целое число из дробного,
    // выполняем вычитание и снова делаем его дробным
    let val: any;

    // округляем до этого значения знаков после запятой
    let num: any = 3;
    
    // для того чтобы вернуть дробное значение из целого
    let d: any = Math.pow(10, num);
    
    // создаем маркер
    let marker = this.createAddMarker();

    let interval = setInterval(() => {
      if (this.myLongitude > 48.24920654296876 && left) {
        up = true;
        val = (this.myLongitude.toFixed(num)-0) * d;
        this.myLongitude = (val - 1)/d;
      } else if (this.myLatitude < 54.36935859782679 && up) {
        left = false;
        val = (this.myLatitude.toFixed(num)-0) * d;
        this.myLatitude = (val + 1)/d;
      } else if (this.myLongitude <  48.380355834960945 && !left) {
        up = false;
        val = (this.myLongitude.toFixed(num)-0) * d;
        this.myLongitude = (val + 1)/d;
      } else if (this.myLatitude > 54.30801120099681 && !up) {
        val = (this.myLatitude.toFixed(num)-0) * d;
        this.myLatitude = (val - 1)/d;
      } else {
        left = true;
      }

      marker.setLatLng([this.myLatitude, this.myLongitude]);
    },100);

  }
  // end for develop

  private getUserData() {
    this.userDataProvider.getData();
  }

  private createAddMarker() {
    let marker = L.marker([54.4151707, 48.3257941], { draggable: true });
    marker.addTo(this.map);
    return marker;
  }

  public showAllDrivers() {
    this.showBtnStop = true;
    this.showBtnStart = false;
    this.setUserCoords();
    this.getUsersDataByTrack();

  }

  public hideAllDrivers() {
    this.showBtnStart = true;
    this.showBtnStop = false;
    this.stopSetUserCoords();
  }

  /////////////////// user ////////////////////////
  // выбираем маршрут по которому поедем
  private setUserTrack() {
    let number = this.userDataProvider.userData.trackNumber;
    let obj = {'publicData/trackNumber': number};
    // сохраняем маршрут в БД
    this.userDataProvider.updateData(obj).then( authData => {
      // показываем кнопку старта
      this.showBtnStart = true;
      
      // функция имитирует передвижение текущего водителя
      // удалить после разработки !!! 
      this.moveMarker();
    }, error => {
      console.dir(error);
    });
  }

  // останавливаем обновление координат текущего водителя в БД 
  private stopSetUserCoords() {
    // останавливаем обновление координат
    clearInterval(this.updateCoordsInterval);

    // говорим что другие водители не будут учитывать координаты этого водителя
    this.inMove = false;
    let obj = {
      'publicData/inMove': this.inMove
    };

    // обновляем данные
    this.userDataProvider.updateData(obj).then( authData => {

    }, error => {
      console.dir(error);
    });
  }

  // сохраняем свои координаты в БД
  private setUserCoords() {
    // частота обновления координат в милисекундах
    let intervalUpdateCoords = 100;

    // предидущие значения координат
    let oldValue = {
      latitude: null,
      longitude: null
    } 

    // счетчик котрый учитывает время когда координаты текущего 
    // водителя не меняются
    let coutnEqualCoords = 0;

    this.updateCoordsInterval = setInterval(() => {
      // если предыдущие значения координат не равны текущим,
      //  записываем их в БД
      if (oldValue.latitude !== this.myLatitude || oldValue.longitude !== this.myLongitude) {
        // говорим что другие водители будут учитывать координаты этого водителя
        this.inMove = true;

        let obj = {
          'publicData/latitude': this.myLatitude,
          'publicData/longitude': this.myLongitude,
          'publicData/inMove': this.inMove
        };
        oldValue.latitude = this.myLatitude;
        oldValue.longitude = this.myLongitude;
       
        // обнуляем счетчик
        coutnEqualCoords = 0;

        // обновляем данные
        this.userDataProvider.updateData(obj).then( authData => {

        }, error => {
          console.dir(error);
        });
      } else if (coutnEqualCoords > intervalUpdateCoords * 2 ) {
        this.stopSetUserCoords();
      } else {
        // если координаты не обновляются увеличиваем счетчик на время через которое 
        // обновляются координаты
        coutnEqualCoords += intervalUpdateCoords; 
      }
    }, intervalUpdateCoords);
  }

  getUsersDataByTrack() {
    setInterval(() => {
      this.userDataProvider.getUsersByTrack();
    }, 100);
  }
  /////////////////// end user ////////////////////////


  /////////////////// track ////////////////////////
  private getTracks() {
    this.allTracks = this.trackProvider.getAllTracks();
  }

  selectTrack() {
    var index = this.selectedIndexTrack;
    // forEach возвращает массив данных
    this.allTracks.forEach((arr) => {
      this.selectedTrack = arr[index].number;
      let path = JSON.parse(arr[index].path);
      
      this.showTrack(path);
      // сохраняем выбранный маршрут который будем отслеживать
      this.userDataProvider.userData.trackNumber = arr[index].number;
      this.setUserTrack();
      this.trackProvider.setSelectedTrack(this.selectedTrack);
    });
  }

  private showTrack(path) {
    this.trackLayer.setGeoJSON(path);
  }
  // end track
}
