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
  login: string = 'streetCity73@gmail.com';
  password: string = '671310';
  rootPage: any;

  constructor(public auth: AuthService) {
    
    // this.auth.login(this.login, this.password).then((isLoggedIn) => {
    //   debugger;
      
      if (this.auth.authenticated) {
        this.rootPage = HomePage;
      } else {
        this.rootPage = LoginPage;
      }
    // });
  }
  
}
