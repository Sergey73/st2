import { Component, Input } from '@angular/core';
import { Events } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data-provider';

export interface CountdownTimer {
    secondsPassed: number;
    // secondsRemaining: number;
    runTimer: boolean;
    hasStarted: boolean;
    hasFinished: boolean;
    displayTime: string;
}


@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})
export class TimerComponent {

  // @Input() timeInSeconds: number;
  timer: CountdownTimer;

  constructor(
    public events: Events,
    public userDataProvider: UserDataProvider
  ) {
  }
  
  ngOnInit() {
    this.initTimer();
    this.events.subscribe('timer: start', () => {
      this.startTimer();
    });
    this.events.subscribe('timer: setToZero', () => {
      this.setToZeroTimer();
    });
    this.events.subscribe('timer: resume', () => {
      this.resumeTimer();
    });
  }

  hasFinished() {
    return this.timer.hasFinished;
  }

  initTimer() {
    // if (!this.timeInSeconds) { this.timeInSeconds = 0; }

    this.timer = <CountdownTimer>{
      secondsPassed: 0,
      runTimer: false,
      hasStarted: false,
      hasFinished: false
      // secondsRemaining: this.timeInSeconds
    };

    // this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsPassed);
  }

  startTimer() {
    this.timer.hasStarted = true;
    this.timer.runTimer = true;
    this.timerTick();
  }

  setToZeroTimer() {
    this.timer.secondsPassed = -1;
  }

  pauseTimer() {
    this.timer.runTimer = false;
  }

  resumeTimer() {
    // получаем время начала круга
    let time = this.userDataProvider.userData.timeStartLap;
    // преобразуем его в миллисекунды
    let date = +new Date(time);
    // получаем время на данный момент
    let nowDate = +new Date();
    // вычисляем сколько прошло с момента старта 
    // круга и сохраняем в переменную ( в секундах)
    this.timer.secondsPassed = (nowDate - date) / 1000;
    // запускаем таймер учитывая старт круга
    this.startTimer();
  }

  timerTick() {
    setTimeout(() => {
      if (!this.timer.runTimer) { return; }
      // this.timer.secondsRemaining--;
      this.timer.secondsPassed++;
      this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsPassed);
      if (this.timer.secondsPassed > 0) {
        this.timerTick();
      }
      else {
        this.timer.hasFinished = true;
      }
    }, 1000);
  }

  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    return hoursString + ':' + minutesString + ':' + secondsString;
  }
}
