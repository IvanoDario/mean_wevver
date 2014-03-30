'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * City Schema
 */
var CitySchema = new Schema({
  name: {
    type: String,
    default: '',
    trim: true
  },
  state: {
    type: String,
    default: '',
    trim: true
  },
  latitude: {
    type: Number,
    default: 0.0
  },
  longitude: {
    type: Number,
    default: 0.0
  }
});

/**
 * Validations
 */
CitySchema.path('name').validate(function(name) {
  return name.length;
}, 'City name cannot be blank');

CitySchema.path('state').validate(function(state) {
  return state.length;
}, 'City state cannot be blank');

mongoose.model('City', CitySchema);
