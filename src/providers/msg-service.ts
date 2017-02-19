import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

@Injectable()
export class MsgService {
  constructor(public alertCtrl: AlertController) {

  }

  alert(message, callback) {
    if(!callback) callback = () => {};
    let alert = this.alertCtrl.create({
      message: message,
      buttons: [
        {
          text: "Ok",
          handler: () => {
            callback();
          }
        }
      ]
    });
    alert.present();
  }

}
