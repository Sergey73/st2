import { Component, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  login: string = 'streetCity73@gmail.com';
  password: string = '671310';

  constructor(public navCtrl: NavController, public element: ElementRef, public authService: AuthService) { 
    this.element.nativeElement
  }

  ngOnInit() { 
    // var root = this.element.nativeElement;
    // console.dir(root);
    this.authService.login(this.login, this.password).then(x=> {
      debugger
    });
  }
}

// https://javebratt.com/firebase-3-email-auth/