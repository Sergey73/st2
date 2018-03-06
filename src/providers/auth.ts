import { Injectable } from '@angular/core';

import { 
  // AuthProviders, 
  AngularFireAuth
  /* FirebaseAuthState, */ 
  // AuthMethods 
} from 'angularfire2/auth';


import * as firebase from 'firebase';

@Injectable()
export class AuthService {
  private authState/* : FirebaseAuthState */;

  constructor(
    public auth$: AngularFireAuth
  ) {
    // this.authState = auth$.getAuth();
    // auth$.subscribe((state/* : FirebaseAuthState */) => {
      //   this.authState = state;
    // });
      
    this.authState = auth$.authState;
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }


  logout() {
    return this.auth$.auth.signOut();
  }
  
  // сделать promise
  // login(email: string, password: string): firebase.Promise<FirebaseAuthState> {
  login(email: string, password: string) {
    return this.auth$.auth.signInWithEmailAndPassword(email, password);
  }

  signup(email: string, password: string){
    return this.auth$.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string){
    var auf = firebase.auth();
    return auf.sendPasswordResetEmail(email);
  }



}
