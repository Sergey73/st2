import { Component } from '@angular/core';
// import { Platform } from 'ionic-angular';
// import { StatusBar, Splashscreen } from 'ionic-native';



import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(public authService: AuthService) {  
    if (this.authService.authenticated) {
      this.rootPage = HomePage;
    } else {
      this.rootPage = LoginPage;
    }
  }
  
}
