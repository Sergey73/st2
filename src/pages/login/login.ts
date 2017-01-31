import { Component, ElementRef, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
  constructor(public navCtrl: NavController, public element: ElementRef ) { 
    this.element.nativeElement
  }

  ngOnInit() { 
    // var root = this.element.nativeElement;
    // console.dir(root);
  }
}

// https://javebratt.com/firebase-3-email-auth/