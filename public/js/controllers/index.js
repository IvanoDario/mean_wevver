'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', '$http', '$interval', function ($scope, $http, $interval) {

  // TODO move this to a dedicated CitiesController
  function checkWeather() {
    $http({method: 'GET', url: '/api/wevver/'}).
      success(function(data) {
        var cities = [];
        for (var city in data) {
          cities.push(data[city]);
        }
        $scope.cities = cities;
      }).error(function(data) {
        $scope.error = data;
      });
  }


  // TODO remove when WebSockets portion is available
  $interval(checkWeather, 3000);

}]);