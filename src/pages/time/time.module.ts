import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimePage } from './time';

@NgModule({
  declarations: [
    TimePage,
  ],
  imports: [
    IonicPageModule.forChild(TimePage),
  ],
  exports: [
    TimePage
  ]
})
export class TimePageModule {}
