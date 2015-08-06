var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
	name: String,
	director: String,
	release: Number
});

module.exports = mongoose.model('Movie', movieSchema);