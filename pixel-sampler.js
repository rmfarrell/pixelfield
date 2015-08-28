var Canvas = require('canvas');
var fs = require('fs');
var Promise = require('bluebird');
var merge = require('merge');

/*
	Takes an image path and returns an array of rgb values of each pixel with .rgb
	want just red, green, or blue values? No problemo. just call PixelSampler.green(img)
*/

var PixelSampler = {

	img: null,
	settings: {
		file: null,
		height: 0,
		width: 0
	},

	_createCanvas: function(img, callback, dataLoop) {

		var iWidth = this.settings.width
		var iHeight = this.settings.height
		var canvas = new Canvas(iWidth, iHeight);
		var ctx = canvas.getContext('2d');
		var that = this;

		return new Promise(function(resolve, reject){

			fs.readFile(img, function(err, img){
				if (err) reject(err);
				var ci = new Canvas.Image;
				ci.src = img;
				ctx.drawImage(ci, 0, 0);
				var imgData=ctx.getImageData(0,0, iWidth, iHeight);
				pixelArray = dataLoop.call(that, imgData)
				resolve(pixelArray);
			})
		})
	},

	_validate: function(img, callback) {
		if (!img) return callback(new Error('no image found'))
		if (!callback) return callback(new Error('no callback found'))
	},

	_init: function(options, callback, loopFunction) {
		this.settings = merge(this.settings, options)
		this._validate(this.settings.file, callback)
		this._createCanvas(this.settings.file, callback, loopFunction).then(function(data) {
			callback(null, data)
		})
	},

	_rgbLoop: function(imgData, _) {
		var pixels = [];
		var row = [];
    for (var x=0; x < imgData.data.length; x=x+4) {
    	var arr=[];
    	arr.push(imgData.data[x]) //red value
			arr.push(imgData.data[x+1]) //green value
			arr.push(imgData.data[x+2]) //blue value
			arr.push(imgData.data[x+3]) //alpha value
			row.push(arr)
			if (row.length == this.settings.width) {
				pixels.push(row)
				row = []
			}
    }
    return pixels;
	},

	_singleColor: function(imgData, addr) {
		var pixels = [];
    for (var x=0; x < imgData.data.length; x=x+4) {
    	pixels.push(imgData.data[x + addr])
    }
    return pixels;
	},

	_redLoop: function(imgData) {
		return this._singleColor.call(this, imgData, 0)
	},

	_greenLoop: function(imgData) {
		return this._singleColor(imgData, 1)
	},

	_blueLoop: function(imgData) {
		return this._singleColor(imgData, 2)
	},

	rgb: function(options, callback) {
		this._init(options, callback, this._rgbLoop)
	},

	green: function(options, callback) {
		this._init(options, callback, this._greenLoop)
	},

	blue: function(options, callback) {
		this._init(options, callback, this._blueLoop)
	},

	red: function(options, callback) {
		this._init(options, callback, this._redLoop)
	},
}

module.exports = PixelSampler;