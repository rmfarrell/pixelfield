var uuid = require('node-uuid');
var gm = require('gm');
var fs = require('fs');

var ImageEnsmaller = {

	errors: [],
	destinationSize: [],

	_isFile: function(file) {
		try {
			file.path
		} catch(err) {
			return this.errors.push(new Error('file arg is not a valid file'))
		}
	},

	_validateInput: function(file, dest) {
		if (!file) this.errors.push (new Error('no file specified'))
		if (!dest) this.errors.push (new Error('no destination specified'))
		// if (!this._isFile(file)) this.errors.push(new Error('file arg is not a valid file'))
		this._isFile(file)
		return this.errors;
	},

	_getExtention: function(file) {
		try {
			return file.type.split('/')[1]
		} catch(e) {
			return this.errors.push(new Error('could not get file type'))
		}
	},

	_collisionProofDestination: function(dest, extension) {
		dest = dest + uuid.v4() + '.' + extension
		return dest;
	},

	_resizeAndSave: function(path, destination, callback) {
		var that = this;
		var size = 0;
		size = this.destinationSize;
		gm(fs.createReadStream(path))
			.resize(size[0], size[1])
			.autoOrient()
			.write(destination, function(err) {
				if (err) {
					console.log(err)
					this.errors.push(err)
					return
				}
				gm(destination).size(function(err, size) {
					return callback(this.errors, destination, size)
				});
			})
	},

	shrink: function(file, dest, height, width, callback) {

		var extension, destination

		this.destinationSize = [height, width]


		// Validate input and return if errors
		this._validateInput(file, dest)
		if (this.errors.length) return callback(this.errors)

		//-- Create a writestream
		extension = this._getExtention(file)

		// append uuid to prevent name collision
		destination = this._collisionProofDestination(dest, extension)

		// resize the image and create writestream in destination path
		this._resizeAndSave(file.path, destination, callback)

		// return if errors
		if (this.errors.size) return callback(this.errors, null)
	}
}

module.exports = ImageEnsmaller;	