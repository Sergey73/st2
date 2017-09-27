import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { UserDataProvider } from '../../providers/user-data-provider';

import { Timer } from '../../interfaces/timer'

@Component({
  selector: 'timer',
  templateUrl: 'timer.html'
})


export class TimerComponent {
  timer: Timer;

  constructor(
    public events: Events,
    public userDataProvider: UserDataProvider
  ) {
    this.initTimer();
  }
  
  ngOnInit() {
    this.events.subscribe('timer:start', () => {
      this.start();
    });
    this.events.subscribe('timer:stop', () => {
      this.stop();
    });
    this.events.subscribe('timer:resume', () => {
      this.resumeTimer();
    });
  }
  
  private initTimer() {
    // инициализация значений
    this.timer = <Timer>{
      secondsPassed: 0,
      runTimer: false,
      displayTime: '00:00:00'
    };
  }
  
  private start() {
    this.timer.runTimer = true;
    this.timerTick();
  }

  private stop() {
    this.timer.secondsPassed = 0;
    this.timer.runTimer = false;
    this.getSecondsAsDigitalClock();
  }

  private pause() {
    this.timer.runTimer = false;
  }

  private setTime(time: number) {
    // время в миллисекундах
    this.timer.secondsPassed = time / 1000;
    // запускаем таймер учитывая старт круга
    this.start();

  }

  private resumeTimer() {
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
    this.start();
  }

  private timerTick() {
    
    setTimeout(() => {
      if (!this.timer.runTimer) { return; };
      this.timer.secondsPassed++;
      this.getSecondsAsDigitalClock();
      this.timerTick();
    }, 1000);
  }

  private getSecondsAsDigitalClock() {
    let inputSeconds = this.timer.secondsPassed;
    let sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);
    let hoursString = '';
    let minutesString = '';
    let secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
    this.timer.displayTime = hoursString + ':' + minutesString + ':' + secondsString;
  }
}



// методы:
  // старт секундомера
  // пауза секундомера
  // стоп
  // установка времени