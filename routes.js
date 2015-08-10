// Define various routes
// GET a list of all records
var Movie = require('./movieSchema'),
	index = require('./index');

var mongoose = require('mongoose'),
	db = require('./db'),
	Grid = require('gridfs-stream'),
	fs = require('fs'),
	path = require('path'),
	multer = require('multer');

var Schema = mongoose.Schema;
	Grid.mongo = mongoose.mongo;

var gfs = Grid(db.db);

/*exports.getAll = function (req, res, next) {
	Movie.find(function (err, movies) {
		if (err) {
			next();
		} else {
			res.json(movies.map(function (movie) {
					return {
						id: movie._id,
						name: movie.name,
						director: movie.director,
						release: movie.release
					}
			}));
		}
	});
};

// GET - list of a record with particular id. If not found, forward the request to 404 - not found. 
exports.getOne = function (req, res, next) {
	Movie.findById(req.params.id, function (err, movie) {
		if (movie != null) {
			res.json({
				id: movie._id,
				name: movie.name,
				director: movie.director,
				release: movie.release
			});
		} else {
			next();
		}
	});
};

// POST - create new element
exports.post = function (req, res, next) {
	var reqBody = req.body;

	var movie = new Movie({
		name: reqBody.name,
		director: reqBody.director,
		release: reqBody.release
	});

	movie.save(function (err, movie) {
		if (err) {
			next();
		} else {
			res.json({id: movie._id});
			res.status(200).end();
		}
	});
};

// PUT - Update existing element
exports.put = function (req, res, next) {
	var reqBody = req.body;

	Movie.findById(req.params.id, function (err, movie) {
		if (movie != null) {
			movie.name = reqBody.name;
			movie.director = reqBody.director;
			movie.release = reqBody.release;

			movie.save(function (err, movie) {
				if (err) {
					next();
				} else {
					res.json({id: movie._id});
					res.status(200).end();
				}
			});
		} else {
			next();
		}
	});
};

// DELETE - remove particular record from array
exports.delete = function (req, res, next) {
	Movie.findById(req.params.id, function (err, movie) {
		if (movie != null) {
			movie.remove(function (err) {
				if (err) {
					next();
				} else {
					res.json({id: movie._id});
					res.status(200).end();
				}
			});
		} else {
			next();
		}
	});
};*/

exports.postVideo = function (req, res, next) {
	req.pipe(gfs.createWriteStream({
    filename: 'test'
  }));
  res.send("Success!");
};

exports.watchVideo = function (req, res, next) {
	gfs.findOne({_id: req.params.id}, function (err, file) {
		if (err) {
			return res.status(400).send(err);
		} else if (!file) {
			return res.status(404).send(' ');
		} else {
			res.header("Content-Type","video/mp4");
		    res.header("X-Content-Type-Options", "nosniff");
		    res.header("Accept-Ranges", "bytes");
		    res.header("Content-Length",file.length);

			var readStream = gfs.createReadStream({_id: file._id});
			readStream.on('open', function () {
				console.log('Starting download...');
			});
			readStream.on('data', function (chunk) {
				console.log('Loading...');
			});
			readStream.on('end', function () {
				console.log('Video is ready to play');
			});
			readStream.on('error', function (err) {
				console.log('There was an error with the download' + err);
				res.end();
			});
			readStream.pipe(res);
		}
	});
};

exports.deleteVideo = function(req, res, next) {
	gfs.remove({_id: req.params.id}, function (err) {
		if (err) {
			return res.status(400).send(err);
		}
		res.status(200).end;
		console.log('success');
	});
};