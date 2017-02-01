import { Component, OnInit } from '@angular/core';
import { 
  NavController, 
  LoadingController, 
  AlertController
} from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth';


// import { SignupPage } from '../../pages/signup/signup';
import { HomePage } from '../../pages/home/home';
// import { ResetPasswordPage } from '../../pages/reset-password/reset-password';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage implements OnInit {
  public loginForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;
  loading: any;

  login: string = 'streetCity73@gmail.com';
  password: string = '671310';

  constructor(
    public navCtrl: NavController, 
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController, 
    public loadingCtrl: LoadingController
    // public element: ElementRef
  ) { 
    this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
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
      this.navCtrl.setRoot(HomePage);
    }, error => {
      this.loading.dismiss().then( () => {
        let alert = this.alertCtrl.create({
          message: error.message,
          buttons: [
            {
              text: "Ok",
              role: 'cancel'
            }
          ]
        });
        alert.present();
      });
    });

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
    }
  }

  goToSignup(){
    // this.navCtrl.push(SignupPage);
  }

  goToResetPassword(){
    // this.navCtrl.push(ResetPasswordPage);
  }
}
