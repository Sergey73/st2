import { Component } from '@angular/core';

import { NavController, AlertController } from 'ionic-angular';
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
    // fire: AngularFire,
    public alertCtrl: AlertController
    
  ) {
    // this.books = fire.database.list('/books');
    // this.users = fire.database.object('/users');
    
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Вход',
      subTitle: '10% of battery remaining',
      message: 'Введител логин и пароль',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  loginP():void {
    let prompt = this.alertCtrl.create({
      title: 'Вход',

      inputs: [
        {
          name: 'логин',
          placeholder: 'Введите логин'
        },
        {
          name: 'пароль',
          placeholder: 'введите пароль',
          type: 'password'
        }
      ]
      // buttons: [
      //   {
      //     text: 'Войти',
      //     handler: data => {
      //       console.dir(data);
      //     }
      //   }
      // ] 
    });
    prompt.present();
  }

}
