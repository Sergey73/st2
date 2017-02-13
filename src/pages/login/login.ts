import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth';
import { MsgService } from '../../providers/msg-service';
import { UserDataProvider } from '../../providers/user-data-provider';

import { SignupPage } from '../../pages/signup/signup';
import { HomePage } from '../../pages/home/home';
import { ResetPasswordPage } from '../../pages/reset-password/reset-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;

  login: string = 'streetCity73@gmail.com';
  password: string = '671310';

  constructor(
    public navCtrl: NavController, 
    public formBuilder: FormBuilder,
    public authService: AuthService,
    public msgService: MsgService,
    public userDataProvider: UserDataProvider
  ) { 
    this.loginForm = formBuilder.group({
      email: [this.login, Validators.compose([Validators.required])],
      password: [this.password, Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  ngOnInit() { 

  }

  loginUser(){
    this.submitAttempt = true;

    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password).then( authData => {
        if(authData.auth.emailVerified) {
          this.userDataProvider.userData['email'] = authData.auth.email;
          this.userDataProvider.userData['uid'] = authData.auth.uid;
          this.navCtrl.setRoot(HomePage);
        } else {
          let msg = `Для входа подтвердите аккаунт.Перейдите по ссылке отправленную на ваш електронный ящик.`
          this.msgService.alert(msg);
        }
      }, error => {
         this.msgService.alert(error.message);
      });
    }
  }

  goToSignup(){
    this.navCtrl.push(SignupPage);
  }

  goToResetPassword(){
    this.navCtrl.push(ResetPasswordPage);
  }
}
