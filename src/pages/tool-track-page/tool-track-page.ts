import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';

import * as L from 'mapbox.js';
import * as leafletDraw from 'leaflet-draw';

import { TrackProvider } from '../../providers/track-provider';
import { MsgService } from '../../providers/msg-service';

@Component({

  selector: 'page-tool-track-page',
  templateUrl: 'tool-track-page.html',
  inputs: ['map']
})
export class ToolTrackPagePage {
  // карта создается в home.ts и передается сюда как параметр
  map: any;
  featureGroup: any;
  lat: Number;
  lng: Number;
  latLng: String;

  // форма
  public toolTrackForm: any;
  public trackData: {number: any, path: string} = {number: '', path: ''};
  public submitAttempt: boolean = false;
  // end форма

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public trackProvider: TrackProvider,
    public msgService: MsgService,
  ) {
    // нужен сдесь иначе модуль не работает.
    leafletDraw

    this.toolTrackForm = formBuilder.group({
      trackNumber: [this.trackData.number, Validators.compose([ Validators.required ])]
    });
  }

  // для формы 
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }
  // end для формы

  ngOnInit() {
    this.createDrawControl();
    this.ceateTrackEvent();
    this.moveMarker();
  }


  private moveMarker() {
     this.map.on('click', (e) => {
      this.latLng = `
        lat: ${e.latlng.lat},
        lng: ${e.latlng.lng}
      `;
     });

     // показываем долготу широту 
     this.map.on('mousemove', (e) => {
       this.lat = e.latlng.lat;
       this.lng = e.latlng.lng;
    });
  }

  private createDrawControl () {
    this.featureGroup = L.featureGroup().addTo(this.map);

    new L.Control.Draw({
      edit: {
        featureGroup: this.featureGroup
      },
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false
      }
    }).addTo(this.map);

  }

  private ceateTrackEvent() {
    this.map.on('draw:created', (e) => { 
      let layerType = e.layerType;
      let layer = e.layer;
      let shape = layer.toGeoJSON();
      let shapeForDb = JSON.stringify(shape);
      this.trackData.path = shapeForDb;

      this.showPolygonArea(e); 
    });
  }

  public saveTrackInDb() {
    this.submitAttempt = true;
    this.toolTrackForm.pristine
    if (!this.toolTrackForm.valid){
      console.log(this.toolTrackForm.value);
    } else {
      if(!this.trackData.path) {
        let message = 'Постройте маршрут!';
        this.msgService.alert(message, null);
        return;
      }
      this.trackData.number = +this.toolTrackForm.value.trackNumber;
      this.trackProvider.createTrack(this.trackData).then((data) => {

        let message = `Маршрут №${this.trackData.number} успешно создан.`;
        this.msgService.alert(message, null);
        this.featureGroup.clearLayers();
        this.clearTrackData();
      }).catch((error) => {
        console.dir(error);
      });
    }
  }

  //   // this.map.on('draw:edited', (e) => {
  //   //   this.showPolygonAreaEdited(e);
  //   //   this.options.track = e;
  //   // });

  //   // this.map.on('draw:delete', (e) => {
  //   //   console.log(`delete ${e}`);
  //   //   this.options.track = e;
  //   // });

  

  private showPolygonArea(e) {
    this.featureGroup.clearLayers();
    this.featureGroup.addLayer(e.layer);
    // e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
    e.layer.openPopup();
  }

  // ! узнать как нормально сбрасывать данные формы
  // очищаем объект в котором хранятся данные  и поле значение формы
  private clearTrackData() {
    this.trackData.number = '';
    this.trackData.path = '';
    // сбарсываем данные фомы
    this.toolTrackForm.reset();
    
    // сбарсываем занчения для валидации
    this.submitAttempt = false;
    this['trackNumberChanged'] = false;
  }
}
