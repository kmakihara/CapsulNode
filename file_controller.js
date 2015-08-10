var mongoose = require('mongoose'),
	db = require('./db'),
	Grid = require('gridfs-stream'),
	fs = require('fs'),
	path = require('path');

var TARGET_PATH = path.resolve(__dirname, '../writable/');

var Schema = mongoose.Schema;
	Grid.mongo = mongoose.mongo;

module.exports = function () {
	db.once('open', function () {
	console.log('open');
	var gfs = Grid(db.db);

	// streaming to gridfs
	// filename stored mongodb
	return {
		upload: function () {
			// create instream
			var is = fs.createReadStream('./data/MongoTestVId.m4v');
			var os = gfs.createWriteStream({filename: 'test video'})
			is.pipe(os);

			os.on('close', function () {
				/*delete file from temp folder
				fs.unlink(req.files.file.path, function () {
					res.json(200, file);
				});*/
				console.log("file uploaded!")
			});
		}
	};

	});
}