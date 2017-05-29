import { Component } from '@angular/core';

/**
 * Generated class for the CheckpointPanelComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'checkpoint-panel',
  templateUrl: 'checkpoint-panel.html'
})
export class CheckpointPanelComponent {

  text: string;

  constructor() {
    console.log('Hello CheckpointPanelComponent Component');
    this.text = 'Hello World';
  }

}
