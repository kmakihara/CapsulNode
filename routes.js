// Define various routes
// GET a list of all records
var movies = require('./data').array(),
	Movie = require('./movieSchema'),
	index = require('./index');

exports.getAll = function (req, res, next) {
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
};