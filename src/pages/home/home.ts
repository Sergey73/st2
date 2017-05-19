import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
// import { Geolocation } from 'ionic-native';

import * as L from 'mapbox.js';

// pages
import { LoginPage } from '../../pages/login/login';

// providers
import { AuthService } from '../../providers/auth';
import { TrackProvider } from '../../providers/track-provider';
import { UserDataProvider } from '../../providers/user-data-provider';
import { OtherUsersProvider } from '../../providers/other-users-provider';
import { DevelopProvider } from '../../providers/develop-provider';
import { MarkerProvider } from '../../providers/marker-provider';
import { MapProvider } from '../../providers/map-provider';

// components
// import { AdminPanelComponent } from '../../components/admin-panel/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  
  // переменная  выбранного маршрута, для отображения пользователю
  public selectedTrack: number;

  // флаг для отображения селекта для выбора номера маршрута
  // если не ставить, селект появляется с пустым значением 
  // тк данные еще не загружены
  public loadDataUser: boolean = true;
  public loadDataAllTracks: boolean = true;

  // существующие маршруты
  public allTracks: Array<any>;

  // выбранный маршрут 
  public selectedIndexTrack: any = '';
  public showBtnStart: boolean = false;
  public showBtnStop: boolean = false;
  

  // функция для обновления коориднат маркера
  private updateCoordsInterval: any;

  // функчия для получения данных о активных пользователях по 
  // выбранному маршруту
  private getOtherUsersInterval: any;

  // в объект сохраним водителей, 
  // которые находятся на выбранном маршруте

  // { id: {
  // маркер
  //   marker: '',  
  // предыдущие координаты для срванения с настоящими. Если координаты не обновляются
  // следовательно водитель стоит на месте, либо вышел из приложения
  //   prevCoords: '',  
  // счетчик в котором записано сколько раз предидущие координаты совпали с настоящими 
  //   coutn: ''
  // }
  private localOnlineOtherUsers: Object = {};

  // частота обновления координат в милисекундах других водителей
  private intervalUpdateSelfCoords: number = 1000;

  // когда марекер выходит за экран, перемещаем карту, чтобы маркер был в центре экрана 
  public watchToSelfMarker: boolean = false;

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public trackProvider: TrackProvider,
    public userDataProvider: UserDataProvider,
    public otherUsersProvider: OtherUsersProvider,
    public developProvider: DevelopProvider,
    public markerProvider: MarkerProvider,
    public mapProvider: MapProvider,
    public events: Events
  ) {

  }

  public ngOnInit() { 
    // обновление своего маркера при измененным именем
    this.events.subscribe('changeSelfUserName: update', () => {
      let data =  this.userDataProvider.userData;
      // если маркер был создан заменяем его на новый с новым 
      // именем иначе ничего
      if (data.selfMarker) {
        // удалить старый маркер
        this.markerProvider.removeMarker(data.selfMarker);
        // создать и сохранить новый маркер
        let newSelfMarker = this.markerProvider.createAddMarker(data.name, 'self');
        data.selfMarker = newSelfMarker;
      }
    });

    // как только данные о текущем юзере придут происходит событие
    this.events.subscribe('userData: finish', () => {
      this.loadDataUser = false;
    });

    // данные маршрутов 
    this.events.subscribe('tracksData: finish', () => {
      this.allTracks = this.trackProvider.tracksData;
      this.loadDataAllTracks = false;

      // для разработки удалить после
      // this.selectedIndexTrack = 1;
      // this.selectTrack();
      // для разработки удалить после
    });

    // слушает когда будут готовы данные водителей на выбранном маршруте,
    // которые сейчас находятся online
    this.events.subscribe('usersByTrackData: finish', () => {
      // для каждого online юзера
      this.otherUsersProvider.usersDataByTrack.online.forEach(item => {
        // обрабокта данных online юзера
        this.dataProcessingOtherUserOnline(item);
      });

      // для каждого offline юзера
      this.otherUsersProvider.usersDataByTrack.offline.forEach(item => {
        // обрабокта данных offline юзера
        this.dataProcessingOtherUserOffline(item);
      });
    });

    // создание слоя для маршрута
    this.trackProvider.createTrackLayer();

    this.getSelfUserData();
    this.getTracks();
  }

  // разрешает/запрещает позиционировать карту так, чтобы маркер оказался в центре
  public setWatchToSelfMarker() {
    this.userDataProvider.userData.watchToSelfMarker = this.watchToSelfMarker;
  }

  public logout() {
    // прекращаем запись в БД
    this.stopSetSelfUserCoords();
    // переходим на станицу входа
    this.authService.logout().then(response => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

  // private getSelfCoords() {
  //   let data = this.userDataProvider.userData;


  //   var watch = Geolocation.watchPosition({
  //     // maximumAge: 1000, 
  //     timeout: 2000, 
  //     enableHighAccuracy: true
  //   });
    
  //   watch.subscribe( (resp) => {

  //     // console.dir(resp);
  //     // console.log('Latitude: '            + resp.coords.latitude          + '\n' +
  //     //         'Longitude: '         + resp.coords.longitude         + '\n' +
  //     //         'Altitude: '          + resp.coords.altitude          + '\n' +
  //     //         'Accuracy: '          + resp.coords.accuracy          + '\n' +
  //     //         'Altitude Accuracy: ' + resp.coords.altitudeAccuracy  + '\n' +
  //     //         'Heading: '           + resp.coords.heading           + '\n' +
  //     //         'Speed: '             + resp.coords.speed             + '\n' +
  //     //         'Timestamp: '         + resp.timestamp                + '\n');


  //     // var lat: any = resp.coords.latitude;
  //     // var lon: any = resp.coords.longitude;
  //     // myLatitude = ((lat.toFixed(4) * 10000) + 2) / 10000;
  //     // myLongitude = ((lon.toFixed(4) * 10000) + 2) / 10000;
     

  //     data.myLatitude = resp.coords.latitude;
  //     data.myLongitude = resp.coords.longitude;
      
  //     this.events.publish('coord: start', resp.coords);

  //     data.selfMarker.setLatLng([data.myLatitude, data.myLongitude]);

  //     // this.setPosition(resp.coords.latitude, resp.coords.longitude);
  //   });
  //   // var lat: any = 54.311096;
  //   // var lon: any = 48.3257941;
    
  //   // setInterval(() => {
  //   //   lat =  ((lat.toFixed(4) * 10000) + 2) / 10000;
  //   //   lon =  ((lon.toFixed(4) * 10000) + 2) / 10000;
  //   //   this.setPosition(lat, lon);
  //   // }, 3000);
  // }

  private getSelfUserData() {
    this.userDataProvider.getData();
  }

  public showAllDrivers() {
    // функция имитирует передвижение текущего водителя
    // удалить после разработки !!! 
    this.developProvider.moveMarker();

    this.showBtnStop = true;
    this.showBtnStart = false;
    this.setSelfUserCoords();
    this.getUsersDataByTrack();
  }

  public hideAllDrivers() {
    let data =  this.userDataProvider.userData;

    this.showBtnStart = true;
    this.showBtnStop = false;
    this.stopSetSelfUserCoords();

    // останавливаем функцию для получения координат других 
    // водителей
    clearInterval(this.getOtherUsersInterval);

    // останавливаем обновление координат своего маркера
    this.developProvider.stopSelfMoveMarker();

    // удаляем свой маркер с карты
    this.markerProvider.removeMarker(data.selfMarker);

    // удаляем свой маркер из локальной переменной
    data.selfMarker = null;
    
    // удаляем все маркеры других пользователей с карты
    this.removeAllOnlineMarkers();

  }

  private removeAllOnlineMarkers() {
    // объект в котором хранятся маркеры активных водителей
    let obj = this.localOnlineOtherUsers;

    // проходимся по локальному объекту в котором содержатся 
    // online маркеры и удаляем их с карты + удаляем данные водителя из 
    // локальной переменной
    for (let key in obj ) {
      this.markerProvider.removeMarker(obj[key].marker);
      obj[key] = null;
    }
  }

  /////////////////// user ////////////////////////
  // выбираем маршрут по которому поедем
  private setUserTrack() {
    let number = this.selectedTrack;
    let obj = {'publicData/trackNumber': number};
    // сохраняем маршрут в БД
    this.userDataProvider.updateData(obj).then( authData => {
      // показываем кнопку старта
      this.showBtnStart = true;

      // для разработки удалить после
      this.showAllDrivers();
      // для разработки удалить после
    }, error => {
      console.dir(error);
    });
  }

  // останавливаем обновление координат текущего водителя в БД 
  private stopSetSelfUserCoords() {
    let data = this.userDataProvider.userData;
    // останавливаем обновление координат
    clearInterval(this.updateCoordsInterval);

    // говорим что другие водители не будут учитывать координаты этого водителя
    data.inMove = false;
    let obj = {
      'publicData/inMove': data.inMove
    };
    // обновляем данные в БД
    this.userDataProvider.updateData(obj).then( authData => {

    }, error => {
      console.dir(error);
    });
  }

  // сохраняем свои координаты в БД когда поедем
  private setSelfUserCoords() {
    let data = this.userDataProvider.userData;

    this.updateCoordsInterval = setInterval(() => {
      // говорим что другие водители будут учитывать координаты этого водителя
      data.inMove = true;

      let obj = {
        'publicData/latitude': data.myLatitude,
        'publicData/longitude': data.myLongitude,
        'publicData/inMove': data.inMove
      };

      // обновляем данные
      this.userDataProvider.updateData(obj).then( authData => {

      }, error => {
        console.dir(error);
      });

    }, this.intervalUpdateSelfCoords);
  }

  // получаем всех юзеров которые находятся на выбранном маршруте
  private getUsersDataByTrack() {
    this.getOtherUsersInterval = setInterval(() => {
      this.otherUsersProvider.getUsersByTrack();
    }, 2000);
  }
  /////////////////// end user ////////////////////////


  /////////////// other users //////////
  // удаляем маркер если он отображается на крте (т.е. есть в локальном объект)
  private dataProcessingOtherUserOffline(item) {
    let key = item.$key;
    if (this.localOnlineOtherUsers[key] ) { 
      let marker = this.localOnlineOtherUsers[key].marker;
      this.markerProvider.removeMarker(marker);
      delete this.localOnlineOtherUsers[key];
    }
  }

  // записываем данные юзера в локальный объект, 
  // создаем и устанавливаем маркер 
  private dataProcessingOtherUserOnline(item) {
    let data = this.userDataProvider.userData;

    // новые координаты широты 
    let newLat = item.publicData.latitude;
    // новые координаты долготы
    let newLon = item.publicData.longitude;

    // текущее имя
    let currentName = item.publicData.name;

    // ключ в массиве водителей
    let key = item.$key;
    
    // если данных водителя нет в локальном объекте, создаем их
    if (!this.localOnlineOtherUsers[key] ) {
      this.createLocalOtherUser(key);    

      // имя водителя 
      let driversName: string = item.publicData.name;
      // сохраняем в локальный объект имя водителя
      this.localOnlineOtherUsers[key].name = driversName;

      // создаем маркер с именем водителя
      let marker = this.markerProvider.createAddMarker(driversName, 'other');
      // сохраняем маркер в локальный объект
      this.localOnlineOtherUsers[key].marker = marker;
    }

    let oldName = this.localOnlineOtherUsers[key].name;
    // если водитель поменял имя обновляем маркер с именем
    if (oldName !== currentName) this.changeNameDriverByKey(item)

    // предидущие координаты долготы 
    let prevLat = this.localOnlineOtherUsers[key].prevCoords.latitude;
    // предидущие координаты широты 
    let prevLon = this.localOnlineOtherUsers[key].prevCoords.longitude;

    // узнаем изменились ли текущие координаты от предидущих.
    // Если нет  прибавляем к переменной count единицу
    if (prevLat == newLat && prevLon == newLon) {

      ++this.localOnlineOtherUsers[key].count;
      // если координаты какого-либо водителя повторялись 3 раза 
      // (вероятно что-то случилось с его приложением) ставим его статус inMove = false
      if (this.localOnlineOtherUsers[key].count == 3) {
        data.inMove = false;
        let obj = {
          'publicData/inMove': data.inMove
        };
        // устанавливаем inMove = false водителю у которого не обновляются данные  
        this.updateDriverByKey(key, obj);
      } 
    } else {
      // если изменились обнуляем счетчик
      this.localOnlineOtherUsers[key].count = 0;
      // записываем координаты в объект для того чтобы при следующем запросе знать изменились они или нет
      this.localOnlineOtherUsers[key].prevCoords.latitude = newLat;
      this.localOnlineOtherUsers[key].prevCoords.longitude = newLon;
      
      let map = this.mapProvider.getMap();
      // координаты видимой области карты
      let bounds = map.getBounds();
      // узнаем находится ли водитель в зоне видимости карты
      let showDirver = bounds.contains([newLat, newLon]);
      // если водитель находится вне зоны выдимости карты не отрисовываем его маркер, 
      // если находится в зоне устанавливаем новое положение маркеру
      showDirver ? this.localOnlineOtherUsers[key].marker.setLatLng([newLat, newLon]) : null;
    }
  }

  // удаляем старый маркер и создаем с новым именем
  private changeNameDriverByKey(item) {
    // текущее имя 
    let currentName = item.publicData.name;
    // ключ в массиве водителей
    let key = item.$key;
    // обновляем имя в локальном объекте
    this.localOnlineOtherUsers[key].name = currentName;
    // старый маркер
    let oldMarker = this.localOnlineOtherUsers[key].marker;
    // стираем маркер со старым именем
    this.markerProvider.removeMarker(oldMarker);
    // устанавливаем маркер с новым именем
    let newMarker = this.markerProvider.createAddMarker(currentName, 'other');
    // записываем в локальный объект новый маркер
    this.localOnlineOtherUsers[key].marker = newMarker;
  }

  // сохраняем данные о водителе в локальный объект
  private createLocalOtherUser(key) {

    this.localOnlineOtherUsers[key] = {
      name: '',
      marker: '',
      prevCoords: {latitude: null, longitude: null},
      count: 0
    };
  }

  // обновление водителя по ключу
  private updateDriverByKey(key, obj) {
    this.otherUsersProvider.updateUsersByTrack(key ,obj).then( authData => {
      console.dir(`Успешное бновление по ключу : ${key}.`);
    }, error => {
      console.dir(error);
    });
  }
  /////////////// end other users //////////
  

  /////////////////// track ////////////////////////
  private getTracks() {
    this.trackProvider.getAllTracks();
  }

  public selectTrack() {
    // индекс выбранного трека
    let index = this.selectedIndexTrack;
    
    // отрисовываем маршрут на карте
    this.trackProvider.showTrack(index);

    // выбранный маршрут 
    this.selectedTrack = this.userDataProvider.userData.trackNumber;

    this.setUserTrack();
  }

  // end track
}
