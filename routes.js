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

exports.postVideo = function (req, res, next) {
	req.pipe(gfs.createWriteStream({
	    filename: 'test',
	    metadata: {
	    	videoTitle: 'testTitle',
	    	date: 'testDate'
	    }
	}));
	res.send("Success!");
};

exports.watchVideo = function (req, res, next) {
	gfs.findOne({_id: req.params.id}, function (err, file) {
		if (err) {
			return res.status(400).send(err);
		} else if (!file) {
			return res.status(404).send('File not found');
		} else if (req.headers['range']){
			var parts = req.headers['range'].replace(/bytes=/, "").split("-");
		    var partialstart = parts[0];
		    var partialend = parts[1];
		    var start = parseInt(partialstart, 10);
		    var end = partialend ? parseInt(partialend, 10) : file.length -1;
		    var chunksize = (end-start)+1;

		    console.log('Range ',start,'-',end);

		    res.writeHead(206, {
			    'Content-Range': 'bytes ' + start + '-' + end + '/' + file.length,
			    'Accept-Ranges': 'bytes',
			    'Content-Length': chunksize,
			    'Content-Type': 'video/mp4'
	    	});

    		var readStream = gfs.createReadStream({
    			_id: file._id,
    			range: {
    				startPos: start,
    				endPos: end
    			}
    		});

    		readStream.pipe(res);
		} else {

			res.header('Content-Type', 'video/mp4');
			res.header('Content-Length', file.length);
			res.header("X-Content-Type-Options", "nosniff");
		    res.header("Accept-Ranges", "bytes");

			var readStream = gfs.createReadStream({
				_id: file._id
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
		res.send('Success!');
	});
};