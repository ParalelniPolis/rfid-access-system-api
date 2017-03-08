'use strict';

var _ = require('underscore');
var seedrandom = require('seedrandom');

var util = module.exports = {

	generateRandomString: function(length, charset) {

		var str = '';

		charset || (charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

		if (_.isString(charset)) {
			charset = charset.split('');
		}

		var rng = seedrandom();

		while (str.length < length) {
			str += charset[ Math.floor( rng() * charset.length ) ];
		}

		return str;
	},

	timestamp: function() {

		return (new Date()).toISOString().replace(/T/, ' ').replace(/\..+/, '');
	},

	log: function(message) {

		console.log('[ ' + util.timestamp() + ' ] ' + message);
	},

	error: function(error) {

		if (!(error instanceof Error)) {
			error = new Error(error);
		}

		console.error(error.stack);
	}
};
