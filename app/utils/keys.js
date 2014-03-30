'use strict';

function getKey(city) {
  return city.name + '-' + city.state;
}

module.exports = {
  getKey: getKey
};