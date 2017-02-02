import { Injectable } from '@angular/core';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';

@Injectable()
export class AuthService {
  private authState: FirebaseAuthState;

  constructor(public auth$: AngularFireAuth) {
    this.authState = auth$.getAuth();
    auth$.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
    });
  }

  get authenticated(): boolean {
    return this.authState !== null;
  }

  signOut(): void {
    this.auth$.logout();
  }
  
  // сделать promise
  // login(email: string, password: string): firebase.Promise<FirebaseAuthState> {
  login(email: string, password: string) {
    return this.auth$.login({ email: email, password: password });
  }

  signup(email: string, password: string){
    return this.auth$.createUser({ email: email, password: password });
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
