'use strict';

angular.module('mean.system').controller('WevverController', ['$scope', function ($scope) {

  $scope.cities = ['OAKLAND', 'ROBERTS'];

  // TODO (implement this)
  $scope.forecasts = function() {
    console.log(' ++ finding forecast');
  };

  // TODO (implement this)
  $scope.cityForecast = function() {
    console.log(' ++ city forecast');
  };
}]);