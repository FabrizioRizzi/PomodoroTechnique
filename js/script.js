let app = angular.module('PomodoroTechnique', []);

app.component('countDownTimer', {
  template: "<div class='CountDownTimer'>" +
  "<p id='demo'></p>" +
  "<button ng-click='vm.startTimer()'>Start</button>" +
  "<button ng-click='vm.stopTimer()'>Stop</button>" +
  "<button ng-click='vm.resetTimer()'>Reset</button>" +
  "</div>",
  bindings: {
    startFrom: '<'
  },
  controllerAs: 'vm',
  controller: function ($scope) {
    let vm = $scope.vm;

    vm.$onInit = function () {
      let display = document.querySelector('#demo');
      let timer = new CountDownTimer(vm.startFrom);
      let timeObj = timer.parse(vm.startFrom);

      format(timeObj.minutes, timeObj.seconds);

      timer.onTick(format);

      function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
      }

      vm.startTimer = () => {
        timer.start();
      };

      vm.stopTimer = () => {
        timer.stop();
      };

      vm.resetTimer = () => {
        timer.reset();
      };

    };

    class CountDownTimer {
      constructor(duration, granularity) {
        this.duration = this.originalDuration =duration;
        this.granularity = granularity || 1000;
        this.tickFtns = [];
        this.running = false;
      }

      onTick(ftn) {
        if (typeof ftn === 'function') {
          this.tickFtns.push(ftn);
        }
        return this;
      }

      start() {
        if (this.running) {
          return;
        }
        let that = this;
        this.running = true;
        let start = Date.now();
        let obj;

        (function timer() {
          if (that.running === true) {
            if (that.restarting === true) {
              that.duration = that.diff;
              that.restarting = false;
            }
            that.diff = that.duration - (((Date.now() - start) / 1000) | 0);

            if (that.diff > 0) {
              setTimeout(timer, that.granularity);
            } else {
              that.diff = 0;
              that.running = false;
            }

            obj = that.parse(that.diff);
            that.tickFtns.forEach(function (ftn) {
              ftn.call(that, obj.minutes, obj.seconds);
            }, that);
          }
        }())
      }

      reset() {
        this.running = false;
        this.duration = this.originalDuration;
        let res = this.parse(this.duration);
        this.tickFtns.forEach(function (ftn) {
          ftn.call(this, res.minutes, res.seconds);
        });
      }

      stop() {
        this.running = false;
        this.restarting = true;
      }

      parse(seconds) {
        return {
          'minutes': (seconds / 60) | 0,
          'seconds': (seconds % 60) | 0
        };
      };
    }
  }
});


app.controller('MainController', [ function () {

  let vm = this;

  vm.pomodoro = true;
  vm.shortBreak = false;
  vm.longBreak = false;
  vm.pomodoroTime = 1500;
  vm.shortBreakTime = 300;
  vm.longBreakTime = 600;

  vm.setPomodoro = () => {
    vm.pomodoro = true;
    vm.shortBreak = false;
    vm.longBreak = false;
  };

  vm.setShortBreak = () => {
    vm.pomodoro = false;
    vm.shortBreak = true;
    vm.longBreak = false;
  };

  vm.setLongBreak = () => {
    vm.pomodoro = false;
    vm.shortBreak = false;
    vm.longBreak = true;
  };

}]);

