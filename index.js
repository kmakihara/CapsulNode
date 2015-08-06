var http = require('http'),
	express = require('express'),
	bodyParser = require('body-parser'),
	movies = require('./data').array(),
	Movie = require('./movieSchema'),
	db = require('./db');

var app = express();

// A simulation of creating new IDs. Basically get the last element and increase the value of an ID.
function getNewId(){
    return movies[movies.length -1].id + 1;
}

// Function findIndexOfElement helps to identify the array index according to specified key/value pair.
function findIndexOfElement(inputArray, key, value){
    for (var i = 0; i < inputArray.length; i++){
        if (inputArray[i][key] === value){
            return i;
        }
    }
return -1;
}

// Use body-parser to help process incoming requests
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Sets default port as 3000, but can also add a new port
app.set('port', process.env.PORT || 3000);

// Define various routes
// GET a list of all records
app.get('/api/movies', function (req, res, next) {
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
});

// GET - list of a record with particular id. If not found, forward the request to 404 - not found. 
app.get('/api/movies/:id', function (req, res, next) {
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
});

// POST - create new element
app.post('/api/movies/', function (req, res, next) {
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
});

// PUT - Update existing element
app.put('/api/movies/:id', function (req, res, next) {
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
});

// DELETE - remove particular record from array
app.delete('/api/movies/:id', function (req, res, next) {
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
});

// Use express middleware to handle 404 and 500 errors
app.use(function (req, res) {
	// Set status as 404 is none of the above routes process
	res.status(404);

	// Generate output
	res.send('404 - not found');
});

app.use(function (err, req, res) {
	// Set response type
	res.type('/application/json');

	// Set status as 500 for internal processing error
	res.status(500);

	// Generate output
	res.send('500 - internal service errro');
});

// Create server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
























