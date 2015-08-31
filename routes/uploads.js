var express = require('express');
var fs = require('fs');
var imageShrink = require('../image-ensmaller');
var pixelSampler = require('../pixel-sampler');
var router = express.Router();

// Handle errors
router.use('/new-image', function(req, res, next) {
	next();
})

router.post('/modify', function(req, res, next) {


})

router.post('/new-image', function(req, res, next) {
  
	try {
		imageShrink.shrink(req.files['uploadme'], './public/temp/', req.body.height, req.body.width, function(error, dest, size) {
			pixelSampler.rgb({
					file: dest,
					height: size.height,
					width: size.width
				}, function(errors, pixels) {
					if (errors) res.status(500).end(errors)
    			res.setHeader('Content-Type', 'application/json');
    			res.send(JSON.stringify({
    				dimensions: {
    					height: size.height,
    					width: size.width
    				},
    				pixels: pixels
    			}, null, 3));
			})

			// pixelSampler.red({
			// 		file: dest,
			// 		height: 80,
			// 		width: 80
			// 	}, function(errors, pixels) {
			// 	if (errors) return
			// 	console.log(pixels)
			// 	res.status(202).end()
			// });
		});
	} catch(e) {
		console.log(e)
	}
});


module.exports = router;