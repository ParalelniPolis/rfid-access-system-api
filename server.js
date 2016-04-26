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

var lib = app.lib = require('./lib');
var config = app.config = require('./config');
var db = app.db = require('./db');
var models = app.models = require('./models');

var onReadyQueue = [];

app.onReady = function(fn) {

	if (app.isReady) {
		return fn();
	}

	onReadyQueue.push(fn);
};

async.parallel([

	function prepareDatabase(next) {

		async.eachSeries(models, function(model, nextModel) {
			model.setUpTable(nextModel);
		}, next);
	},

	function prepareSessionStore(next) {

		var MySQLStore = require('express-mysql-session');

		var options = _.extend(
			{},
			app.config.db.connection,
			app.config.sessions.storeOptions
		);

		app.sessionStore = new MySQLStore(options, next);
	}

], function(error) {

	if (error) {
		console.error(error);
		return process.exit(1);
	}

	// The app should be ready now.

	require('./middleware')(app);
	require('./controllers')(app);

	app.use(function(error, req, res, next) {

		// Catches errors from middleware and controllers.

		if (error) {

			error.status || (error.status = 500);

			if (error.status === 500) {
				util.error(error);
				error.message = 'Unexpected error.';
			}

			return res.status(error.status).send(error.message || 'Unexpected error.');
		}

		next();
	});

	var server = app.server = app.listen(config.port, config.host);

	console.log('Server listening on', config.host + ':' + config.port);

	app.isReady = true;

	_.each(onReadyQueue, function(fn) {
		fn();
	});

	onReadyQueue = [];
});
