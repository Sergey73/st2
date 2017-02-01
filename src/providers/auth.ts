import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth) {
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      debugger
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  // signInWithFacebook(): firebase.Promise<FirebaseAuthState> {
  //   return this.auth$.login({
  //     provider: AuthProviders.Facebook,
  //     method: AuthMethods.Popup
  //   });
  // }

  signOut(): void {
    this.auth$.logout();
  }
  
  // сделать promise
  login(email: string, password: string): firebase.Promise<FirebaseAuthState> {
    return this.auth$.login({ email: email, password: password }).then((data) => {
      return data;
    }).catch((error) => {
    });
  }

  // login(email: string, password: string): Promise<boolean> {
  //           var creds: any = { email: email, password: password };
  //           var res: Promise<boolean> = new Promise((resolve, reject) => {
  //               this.auth.login(creds).then(result => {
  //                   resolve(result);
  //               })
  //           });
  //           return res;
  //       }

}
