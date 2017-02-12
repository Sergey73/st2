import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';
// import { StatusBar, Splashscreen } from 'ionic-native';


import { AuthService } from '../providers/auth';

// import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  @ViewChild('contentId') nav: Nav;
  rootPage: any;
  pages: Array<{title: string, component: any}>;

  constructor(
    public authService: AuthService
  ) { 
    this.pages = [
      { title: 'профиль', component: ProfilePage }
    ];
    
    this.initializeApp();
  }

  initializeApp() {
    // if (this.authService.authenticated) {
    //   this.rootPage = HomePage;
    // } else {
      this.rootPage = LoginPage;
    // }
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
  
}
