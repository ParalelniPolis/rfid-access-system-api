'use strict';

var util = require('./lib/util');

process.on('uncaughtException', function(error) {
	util.error(error);
});

var _ = require('underscore');
var async = require('async');
var express = require('express');
var app = module.exports = express();

app.env = process.env.NODE_ENV || 'development';
app.lib = require('./lib');
app.config = require('./config');
app.db = require('./database');

async.parallel([

	app.db.setUp,

	function prepareSessionStore(next) {

		var MySQLStore = require('express-mysql-session');

		var options = _.extend(
			{},
			app.config.db,
			app.config.sessions.storeOptions
		);

		app.sessionStore = new MySQLStore(options, next);
	}

], function(error) {

	if (error) {
		throw error;
	}

	require('./middleware')(app);
	require('./controllers')(app);

	// This is where we catch express errors. No "app.use" beyond this one!
	app.use(function(error, req, res, next) {

		// Catches errors from middleware and controllers.

		if (error) {

			error.status || (error.status = 500);

			if (error.status === 500) {
				util.error(error);
				error.message = 'Oops! Something went wrong.';
			}

			return res.status(error.status).send(error.message || 'Oops! Something went wrong.');
		}

		next();
	});

	app.listen(app.config.port, app.config.host, function() {
		console.log('Server running at ' + app.config.host + ':' + app.config.port);
	});

	app.ready = true;
});
