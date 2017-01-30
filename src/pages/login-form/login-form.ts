import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'login-form',
  templateUrl: 'login-form.html'
})
export class LoginForm {

  constructor(public navCtrl: NavController) {
    console.dir('login-form');
  }

}
