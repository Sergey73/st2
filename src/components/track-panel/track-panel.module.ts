import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackPanelComponent } from './track-panel';

@NgModule({
  declarations: [
    TrackPanelComponent,
  ],
  imports: [
    IonicPageModule.forChild(TrackPanelComponent),
  ],
  exports: [
    TrackPanelComponent
  ]
})
export class TrackPanelComponentModule {}
