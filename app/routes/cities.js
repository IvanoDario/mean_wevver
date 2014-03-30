'use strict';

module.exports = function(app) {
    
  // grab the cities controller
  var cities = require('../controllers/cities');

  // defined the api cities (and wevver) routes.
  app.get('/api/cities', cities.getCities);
  app.get('/api/city/:city', cities.city);
  app.get('/api/city/:city/:state', cities.city);
  app.get('/api/wevver/:city/:state', cities.wevver);

  // Debug routes for demo purposes
  app.get('/api/wevver/', cities.allWevver);
  app.get('/api/clear', cities.clear);

};
