//module.exports = function() {

	var http = require('http'),
		express = require('express'),
		db = require('./db'),
		bodyParser = require('body-parser'),
		routes = require('./routes'),
		morgan = require('morgan'),
		//upload = multer({dest: 'uploads/'}),
		multer = require('multer');

	var app = express();

	// Sets default port as 3000, but can also add a new port
	app.set('port', process.env.PORT || 3000);

	// Use body-parser to help process incoming requests
	app.engine('.html', require('ejs').__express);
	app.use(bodyParser.urlencoded({extended: true}));
	app.use(bodyParser.json());
	app.use(morgan('dev'));
	app.use('/data', express.static(__dirname + '/writable'));
	app.set('views', __dirname + '/views');
	app.set('view engine', 'html');
	app.use(express.static(__dirname + '/public'));
	// new stuff
	app.get('/', function(req, res, next) {res.render('index');});
	app.post('/upload', routes.postVideo);
	//app.post('/upload', upload.single('video'), routes.postVideo)
	app.get('/api/movies/:id', routes.watchVideo);
	app.delete('/api/movies/:id', routes.deleteVideo);

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

//}