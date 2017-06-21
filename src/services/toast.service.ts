import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class ToastService {
  private duration: number;
  
  constructor(public toastCtrl: ToastController) {
    this.duration = 3000;
  }

  showMsg(msg:string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: this.duration
    });
    toast.present();
  }
  // alert(message, callback) {
  //   if(!callback) callback = () => {};
  //   let alert = this.alertCtrl.create({
  //     message: message,
  //     buttons: [
  //       {
  //         text: "Ok",
  //         handler: () => {
  //           callback();
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

}
