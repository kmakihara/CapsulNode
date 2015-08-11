initial routes

if (err) {
			return res.status(400).send(err);
		} else if (!file) {
			return res.status(404).send(' ');
		} else if (req.headers['range']) {
			//// new stuff
			var range = req.headers.range;
			var total = file.length;
		    var parts = range.replace(/bytes=/, "").split("-");
		    var partialstart = parts[0];
		    var partialend = parts[1];

		    var start = parseInt(partialstart, 10);
		    var end = partialend ? parseInt(partialend, 10) : total-1;
		    var chunksize = (end-start)+1;
		    console.log('RANGE: ' + start + ' - ' + end + ' = ' + chunksize);

		    var readStream = gfs.createReadStream({
		    	_id: file._id,
		    	range: {
		    		start: start,
		    		end: end
		    	}
		    });

			res.writeHead(206, {
	            'Transfer-Encoding': 'chunked',
	            'Content-Type': 'video/mp4',
	            'Content-Length': chunksize,
	            'Content-Ranges': 'bytes' + start + "-" + end + "/" + total,
	            'Accept-Ranges': 'bytes'
				});

		    readStream.on('data', function (chunk) {
		      start += chunk.length;
		      console.log(start, end, start >= end);
		      if (start >= end) {
		          res.end();
		      } else {
		          res.write(chunk);
		      }

		      if (start >= end) {
		      	res.end();
		      }
		  	});

			readStream.pipe(res);
		} else {
			///// new stuff

			res.header("Content-Type","video/mp4");
		    res.header("X-Content-Type-Options", "nosniff");
		    res.header("Accept-Ranges", "bytes");
		    res.header("Content-Length",file.length);

			var readStream = gfs.createReadStream({_id: file._id});
			readStream.on('open', function () {
				console.log('Starting stream...');
			});
			readStream.on('data', function (chunk) {
				console.log('Loading...');
			});
			readStream.on('end', function () {
				console.log('Video is ready to play');
			});
			readStream.on('error', function (err) {
				console.log('There was an error with the stream' + err);
				res.end();
			});
			readStream.pipe(res);
		}