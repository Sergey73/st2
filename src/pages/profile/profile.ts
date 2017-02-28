import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { FormBuilder, Validators } from '@angular/forms';
import { MsgService } from '../../providers/msg-service';
import { UserDataProvider } from '../../providers/user-data-provider';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  public profileForm;
  profileData: {name: string} = {name: ''};
  submitAttempt: boolean = false

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public msgService: MsgService,
    public userDataProvider: UserDataProvider
  ) {
    this.profileData.name = this.userDataProvider.userData.name;
    this.profileForm = formBuilder.group({
      name: [this.profileData.name, Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  elementChanged(input){
    let field = input.inputControl.name;
    this[field + "Changed"] = true;
  }

  saveProfile(){
    this.submitAttempt = true;
    if (!this.profileForm.valid){
      console.log(this.profileForm.value);
    } else {
      let obj = {'publicData/name': this.profileForm.value.name};
      this.userDataProvider.updateData( obj ).then( authData => {
        let msg = `Профиль успешно изменен.`
        let callback = () => {
          this.navCtrl.pop();
        }
        this.msgService.alert(msg, callback);
      }, error => {
         this.msgService.alert(error.message, null);
      });
    }
  }


}
