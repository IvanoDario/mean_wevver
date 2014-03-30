'use strict';

/**
 * Simple SOAP-y service for populating the WEVVER data object
 * We match forecast data to the city up by name + state and
 * emit events every time we get a result
 */
var http = require('http'),
    events = require('events'),
    em = new events.EventEmitter(),
    xml2js = require('xml2js'),
    parser = new xml2js.Parser(),
    keys = require('../utils/keys.js'),
    host = 'graphical.weather.gov',
    path = '/xml/SOAP_server/ndfdSOAPclientByDay.php?whichClient=NDFDgenByDay&format=24+hourly&numDays=7&Unit=e',
    WEVVER = {},
    START_DATE;

// Return the start date (i.e now - 1 day) as a String in required format 'YYYY-MM-DD'
function _startDate() {
  return START_DATE || (new Date(Date.now() - (24 * 60 * 60 * 1000))).toISOString().replace(/T.+/, '');
}

function _parseTemps(data) {
  var pint = function(st) { return parseInt(st, 10); };
  var max_ts = data.parameters[0].temperature[0].value.map(pint);
  var min_ts = data.parameters[0].temperature[1].value.map(pint);

  return {
    max_temps: max_ts,
    min_temps: min_ts
  };
}


function _updateWevver(city, forecast) {
  var key = keys.getKey(city);
  if (WEVVER[key]) {
    return;
  }
  // lob the weather data into memory in an appetising format
  WEVVER[key] = {
    city: city.name,
    state: city.state,
    max_temps: forecast.max_temps,
    min_temps: forecast.min_temps
  };

  // inform all listeners that we have a new forecast to display.
  em.emit('forecast', WEVVER[key]);
}


function _generateCallback(city, next) {
  return function(response) {
    var str = '';

    response.on('data', function (chunk) {
      str += chunk;
    });

    // the whole response has been received, so parse the String
    response.on('end', function () {
      parser.parseString(str, function(err, result) {
        if (result && result.dwml) {
          var forecast = _parseTemps(result.dwml.data[0]);
          _updateWevver(city, forecast);
          next(WEVVER[keys.getKey(city)]);
        }
      });
    });
  };
}


function _slurpWeather(city, next) {
  console.log(' ++ slurping wevver for', city);
  var callback = _generateCallback(city, next);
  var options = {
    host: host,
    path: path + '&lat=' + city.longitude + '&lon=' + city.latitude + '&startDate=' + _startDate()
  };

  console.log(' ++ GET weather', options);
  http.request(options, callback).end();
}


/**
 * Public method for getting the weather forecast for an
 * individual city.
 * @param city The city to check for our forecast
 * @param next The callback to fire after forecast data has been generated
 */
function getWeather(city, next) {
  var key = keys.getKey(city);
  if (WEVVER[key]) {
    next(WEVVER[key]);
  } else {
    _slurpWeather(city, next);
  }
}

// exports
module.exports = {
  WEVVER: WEVVER,
  START_DATE: _startDate(),
  getWevver: getWeather
};
