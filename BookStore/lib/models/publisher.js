'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Schema
var Publisher = new Schema({
    name:String

});


mongoose.model('publisher', Publisher);
