import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdminPanelComponent } from './admin-panel';

@NgModule({
  declarations: [
    AdminPanelComponent,
  ],
  imports: [
    IonicPageModule.forChild(AdminPanelComponent),
  ],
  exports: [
    AdminPanelComponent
  ]
})
export class AdminPanelComponentModule {}
