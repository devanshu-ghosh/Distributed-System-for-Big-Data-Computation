var app = angular.module('dataCompute', []);

app.factory('socket', ['$rootScope', function($rootScope) {
  var socket = io();

  return {
    on: function(eventName, callback){
      socket.on(eventName, callback);
    },
    emit: function(eventName, data) {
      socket.emit(eventName, data);
    }
  };
}]);

app.controller('DataComputeController', function DataComputeController($scope,$interval,socket) {
	$scope.display = [];
	setInterval(function(){$scope.getData();}, 1000);
	$scope.getData = function(){
		socket.emit('getData');
		$scope.display.push("GET DATA");
		$scope.$apply();
	};
	$scope.performComputations = function(num){
		var sum = 0;
		for(var index = 0;index < num.length ; index++)
			sum+= num[index];
		return sum;
	}
	socket.on('takeData',function(data){
		var resultData = {};
		resultData.id = data.id;
		resultData.result = $scope.performComputations(data.data);
		$scope.display.push("RESULT CALCULATED AND SENT FOR ID : "+data.id);
		socket.emit('result',resultData);
		$scope.$apply();
	});
	socket.on('Data Queue Empty',function(){
		$scope.display.push("NO DATA . WAIT");
		$scope.$apply();
	});

});