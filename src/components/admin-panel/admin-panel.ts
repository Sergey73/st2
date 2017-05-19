import { Component } from '@angular/core';

@Component({
  selector: 'admin-panel',
  templateUrl: 'admin-panel.html'
})
export class AdminPanelComponent {

  text: string;

  constructor() {
    console.log('Hello AdminPanelComponent Component');
    this.text = 'Hello World';
  }

}
