import { NavController } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth';
import { MsgService } from '../../providers/msg-service';

@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
  public resetPasswordForm;
  emailChanged: boolean = false;
  passwordChanged: boolean = false;
  submitAttempt: boolean = false;


  constructor(
    public authService: AuthService,
    public formBuilder: FormBuilder, 
    public navCtrl: NavController,
    public msgService: MsgService
  ) {

    this.resetPasswordForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
    })
  }

  /**
   * Receives an input field and sets the corresponding fieldChanged property to 'true' to help with the styles.
   */
  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  /**
   * If the form is valid it will call the AuthData service to reset the user's password displaying a loading
   *  component while the user waits.
   *
   * If the form is invalid it will just log the form value, feel free to handle that as you like.
   */
  resetPassword(){

    this.submitAttempt = true;

    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authService.resetPassword(this.resetPasswordForm.value.email).then((user) => {
        let message = "Для сброса пароля зайдите на вашу почту и перейдите по указанной в нем ссылке.";
        this.msgService.alert(message);
        this.navCtrl.pop();
      }, (error) => {
        let errorMessage: string = error.message;
        this.msgService.alert(errorMessage);
      });
    }
  }
}