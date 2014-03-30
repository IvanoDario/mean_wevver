'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    City = mongoose.model('City'),
    wevver = require('../services/wevver');


exports.getCities = function(req, res) {
  City
    .find()
    .exec(function(err, data) {
      res.json(data);
    });
};


/**
 * Find City by name and optionally state.
 */
exports.city = function(req, res) {
  var q = { name: req.params.city};
  if (req.params.state) {
    q.state = req.params.state;
  }
  console.log(' ++ Searching for city using query:', q);

  City
    .find(q)
    .exec(function(err, data) {
      if (data) {
        console.log(' ++ received city data:', data);
        res.json(data);
      }
    });
};

/**
 * Find weather forecast for a city and state
 */
exports.wevver = function(req, res) {
  var city = req.params.city;
  var state = req.params.state;
  if (!city || !state) {
    res.send(400, 'Bad request: Weather forecast must be supplied with a city and state');
  }
  console.log(' ++ Looking for weather forecast city:', city, ' state:', state);

  City
    .findOne({name: city, state: state})
    .exec(function(err, data) {
      if (!data) {
        res.send(404, 'Could not find data for city: ' + city + ' and state: ' + state);
      } else {
        wevver.getWevver(data, function(forecast) {
          res.json(forecast);
        });
      }
    });
};


/**
 * Get all the current weather forecasts.
 * Useful only for debug really
 */
exports.allWevver = function(req, res) {
  res.json(wevver.WEVVER);
};


/**
 * clear out 10 records from our wevver list.
 */
exports.clear = function(req, res) {
  var delete_count = 0;
  for (var key in wevver.WEVVER) {
    delete wevver.WEVVER[key];
    delete_count++;
    if (delete_count === 10) {
      break;
    }
  }
  res.send(200, 'Deleted ' + delete_count + ' weather forecasts at ' + new Date());

};
