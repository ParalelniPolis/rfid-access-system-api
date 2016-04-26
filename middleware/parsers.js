'use strict';

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

module.exports = function(app) {

	app.use(cookieParser());

	app.use(bodyParser.urlencoded({
		extended: true
	}));

	app.use(bodyParser.json());

	app.use(function(error, req, res, next) {

		if (error) {
			error = new Error('Invalid JSON');
			error.status = 400;
			return next(error);
		}

		next();
	});
};
