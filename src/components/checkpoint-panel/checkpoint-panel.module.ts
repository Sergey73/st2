import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckpointPanelComponent } from './checkpoint-panel';

@NgModule({
  declarations: [
    CheckpointPanelComponent,
  ],
  imports: [
    IonicPageModule.forChild(CheckpointPanelComponent),
  ],
  exports: [
    CheckpointPanelComponent
  ]
})
export class CheckpointPanelComponentModule {}
