'use strict';

var http = require('http'),
    CITIES = require('./cities.js'),
    interval;


function _generateCallback(city) {
  return function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(' ++ ', city, ' weather -->', str);
    });
  };
}


// make a weather forecast request for some random cities
function _stiffCities() {
  for (var i = 0; i < 5; i++) {
    var idx = Math.floor(Math.random() * 30101),
        city = CITIES[idx][0],
        state = CITIES[idx][1],
        callback = _generateCallback(city);

    var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/wevver/' + encodeURIComponent(city) + '/' + encodeURIComponent(state)
    };
    http.request(options, callback).end();
  }
}


function start() {
  console.log(' ++ start stifflerizing');
  interval = setInterval(_stiffCities, 2000);
}


function stop() {
  if (interval) {
    console.log(' ++ stop stifflerizng');
    clearInterval(interval);
  }
}

// exports
module.exports = {
  start: start,
  stop: stop
};
