import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MyApp } from './app.component';

// pages 
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
// import { ToolTrackPagePage } from '../pages/tool-track-page/tool-track-page';

import { ProfilePage } from '../pages/profile/profile';

// my servicies
import { MapProvider } from '../providers/map-provider';
import { AuthService } from '../providers/auth';
import { MsgService } from '../services/msg.service';
import { UserDataProvider } from '../providers/user-data-provider';
import { OtherUsersProvider } from '../providers/other-users-provider';
import { TrackProvider } from '../providers/track-provider';
import { DevelopProvider } from '../providers/develop-provider';
import { MarkerProvider } from '../providers/marker-provider';

// any servicies
import {AngularFireModule, AuthProviders, AuthMethods} from 'angularfire2';

// components
import { TimerComponent } from '../components/timer/timer';
import { CheckpointPanelComponent } from '../components/checkpoint-panel/checkpoint-panel';
import { TrackPanelComponent } from '../components/track-panel/track-panel';

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
  // делает все элементы видимыми для всего приложения
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ProfilePage,
    TimerComponent,
    CheckpointPanelComponent,
    TrackPanelComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    ResetPasswordPage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}, 
    MapProvider,
    AuthService, 
    MsgService, 
    UserDataProvider,
    OtherUsersProvider,
    TrackProvider,
    DevelopProvider,
    MarkerProvider
  ]
})
export class AppModule {}
