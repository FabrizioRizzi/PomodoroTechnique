app.component('countDownTimer', {
  templateUrl: './components/countDownTimer/countDownTimer.html',
  bindings: {
    pomodoroTime: '<'
  },
  controllerAs: 'vm',
  controller: function ($scope) {
    let vm = this;
    let audio = new Audio('./sound/wahoo.mp3');

    vm.$onInit = function () {

      let display = document.querySelector('#display');

      vm.setPomodoro = (startFrom) => {
        !!vm.stopTimer && vm.stopTimer();
        let timer = new CountDownTimer(startFrom);
        let timeObj = timer.parse(startFrom);
        format(timeObj.minutes, timeObj.seconds);

        timer.onTick(format);

        vm.startTimer = () => {
          timer.start();
          vm.state = '';
        };

        vm.stopTimer = () => {
          timer.stop();
          vm.state = 'Paused';
        };

        vm.resetTimer = () => {
          timer.reset();
          vm.state = 'Paused';
        };

        vm.finished = () => {
          vm.state = 'Finished';
          $scope.$apply();
        };

        vm.resetTimer();
      };

      vm.setPomodoro(1500);

      function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        display.textContent = minutes + ':' + seconds;
      }

    };

    class CountDownTimer {
      constructor(duration, granularity) {
        this.duration = this.originalDuration = duration;
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
              audio.play();
              vm.finished();
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
        this.restarting = false;
        this.duration = this.originalDuration;
        this.diff = this.duration;
        let res = this.parse(this.duration);
        this.tickFtns.forEach(function (ftn) {
          ftn.call(this, res.minutes, res.seconds);
        });
      }

      stop() {
        if (!this.diff) {
          return;
        }
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
