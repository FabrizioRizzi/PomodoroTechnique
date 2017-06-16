let app = angular.module('PomodoroTechnique', []);

app.controller('MainController', [function () {

  let vm = this;

  vm.pomodoroTime = {
    pomodoro: 1500,
    shortBreakTime: 300,
    longBreakTime: 600
  }

}]);

