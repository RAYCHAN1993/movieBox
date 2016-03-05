var mongoose = require('mongoose');
var MovieSchema = require('../schemas/movie');
var MovieBox = mongoose.model('MovieBox', MovieSchema);

module.exports = MovieBox;
