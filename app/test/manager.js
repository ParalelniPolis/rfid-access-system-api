'use strict';

var _ = require('underscore');
var async = require('async');

var app = require('../server');
var db = app.db;
var testLib = require('./lib');

var manager = module.exports = {

	app: app,
	db: db,
	config: app.config,
	lib: app.lib,
	models: app.db.models,
	testLib: testLib,

	url: function(uri) {

		return 'http://' + app.config.host + ':' + app.config.port + uri;
	},

	// Wait for the app to be ready.
	onReady: function(cb) {

		if (app.ready) {
			// App is already ready.
			// Execute the callback at the next loop.
			return _.defer(cb);
		}

		// App not ready yet.
		// Wait a little time and then check again.
		setTimeout(function() {
			manager.onReady(cb);
		}, 25);
	},

	setUp: function(cb) {

		async.series([
			manager.onReady,
			manager.tearDown,
			db.setUp
		], cb);
	},

	tearDown: function(cb) {

		async.series([
			manager.dropDatabaseTables
		], cb);
	},

	dropDatabaseTables: function(cb) {

		// Drop tables in reverse order (because of foreign keys).
		var models = _.values(db.models).reverse();
		async.eachSeries(models, function(model, next) {
			db.schema.dropTableIfExists(model.tableName).then(function() {
				next();
			}).catch(next);
		}, cb);
	},

	client: function(options) {

		options = _.defaults(options || {}, {
			host: app.config.host,
			port: app.config.port
		});

		return new testLib.Client(options);
	}
};
