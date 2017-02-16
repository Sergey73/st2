import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

// import * as leafletDraw from 'leaflet-draw';

@Component({

  selector: 'page-tool-track-page',
  templateUrl: 'tool-track-page.html',
  inputs: ['map']
})
export class ToolTrackPagePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  //  private drawControl () {
  //   this.featureGroup = L.featureGroup().addTo(this.map);

  //   new L.Control.Draw({
  //     edit: {
  //       featureGroup: this.featureGroup
  //     },
  //     draw: {
  //       polygon: true,
  //       polyline: false,
  //       rectangle: false,
  //       circle: false,
  //       marker: false
  //     }
  //   }).addTo(this.map);

  //   this.map.on('draw:created', (e) => { 
  //     this.showPolygonArea(e); 
  //     this.options.track = e;

  //     // сохранение полигона
  //     var type = e.layerType;
  //     var layer = e.layer;

  //     var shape = layer.toGeoJSON();
  //     var shapeForDb = JSON.stringify(shape);
  //     this.options.trackPath = shapeForDb;
  //     console.dir(`track создан!`);
  //     // var dataTrack = {
  //     //   number: 50,
  //     //   path: shapeForDb
  //     // };
  //     // this.fire.saveTrack(dataTrack);

  //     // end сохранение полигона
  //   });

  //   // this.map.on('draw:edited', (e) => {
  //   //   this.showPolygonAreaEdited(e);
  //   //   this.options.track = e;
  //   // });

  //   // this.map.on('draw:delete', (e) => {
  //   //   console.log(`delete ${e}`);
  //   //   this.options.track = e;
  //   // });

  // }

  // private showPolygonArea(e) {
  //   this.featureGroup.clearLayers();
  //   this.featureGroup.addLayer(e.layer);
  //   // e.layer.bindPopup((LGeo.area(e.layer) / 1000000).toFixed(2) + ' km<sup>2</sup>');
  //   e.layer.openPopup();
  // }

}
