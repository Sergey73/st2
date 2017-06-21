import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth';
import { MsgService } from '../../services/msg.service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public signupForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;


  constructor(
    public navCtrl: NavController, 
    public authService: AuthService, 
    public formBuilder: FormBuilder,
    public msgService: MsgService
  ) {

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    })
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  signupUser(){
    this.submitAttempt = true;

    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authService.signup(this.signupForm.value.email, this.signupForm.value.password).then((data) => {
        data.auth.sendEmailVerification().then(() => {
          this.navCtrl.pop();
          
          let message = `Ваш аккаунт создан. На указанный при регистрации электронный ящик, 
          вам отправлено письмо. Перейдите по ссылке внутри письма, чтобы завершить 
          регистрацию и пользоваться сервисом.`;
          this.msgService.alert(message, null);
        });
      }, error => {
        this.msgService.alert(error.message, null);
      });
    }
  }
}