app.component('task', {
  templateUrl: './components/task/task.html',
  bindings: {
    task: '<'
  },
  controllerAs: 'vm',
  controller: function ($scope) {
    let vm = this;
    vm.tasks = [];
    vm.addTask = () => {
      if (!!vm.task) {
        vm.tasks.push({"name": vm.task, "count": 0});
        vm.task = "";
      }
    };
    vm.addCount = (index) =>{
      vm.tasks[index].count += 1;
    };
    vm.removeCount = (index) =>{
      if (vm.tasks[index].count > 0) {
        vm.tasks[index].count -= 1;
      }
    };
    vm.eliminaTask = (index) =>{
      vm.tasks.splice(index, 1);
    };
  }
});
