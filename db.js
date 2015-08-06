var mongoose = require('mongoose');

mongoose.connect('mongodb://kmakihara:capsultest@ds029803.mongolab.com:29803/capsultest');

module.exports = mongoose.connection;