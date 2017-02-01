import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { LoginPage } from '../pages/login/login';
import { AuthService } from '../providers/auth';
import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';

export const firebaseConfig = {
  apiKey: 'AIzaSyD8cHdez2j1JTcQ4hfPoFs3YCsRSgtPfGY',
  authDomain: 'streetcity73-a464b.firebaseapp.com',
  databaseURL: 'https://streetcity73-a464b.firebaseio.com',
  storageBucket: 'streetcity73-a464b.appspot.com',
  messagingSenderId: '367568561460'
};

// данные входе
const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage
    // AboutPage,
    // ContactPage,
    // TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage


    // AboutPage,
    // ContactPage,
    // TabsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, AuthService ]
})
export class AppModule {}
