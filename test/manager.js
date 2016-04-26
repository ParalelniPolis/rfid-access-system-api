'use strict';

var _ = require('underscore');
var async = require('async');

var app = require('../');
var testLib = require('./lib');

var manager = module.exports = {

	db: app.db,
	config: app.config,
	lib: app.lib,
	models: app.models,
	testLib: testLib,

	url: function(uri) {

		return 'http://' + manager.config.host + ':' + manager.config.port + uri;
	},

	app: function() {

		return app;
	},

	client: function(options) {

		options = _.defaults(options || {}, {
			host: app.config.host,
			port: app.config.port
		});

		return new testLib.Client(options);
	},

	setUp: function(cb) {

		async.series([
			manager.tearDown,
			manager.createDatabaseTables
		], cb);
	},

	tearDown: function(cb) {

		async.series([
			manager.dropDatabaseTables
		], cb);
	},

	createDatabaseTables: function(cb) {

		async.eachSeries(app.models, function(model, next) {
			model.setUpTable(next);
		}, cb);
	},

	dropDatabaseTables: function(cb) {

		async.eachSeries(_.values(app.models).reverse(), function(model, next) {
			app.db.knex.schema.dropTableIfExists(model.tableName).then(_.bind(next, undefined, null)).catch(next);
		}, cb);
	},

	clearDatabaseTables: function(cb) {

		async.eachSeries(_.keys(app.models).reverse(), manager.clearModelDatabaseTable, cb);
	},

	clearModelDatabaseTable: function(modelName, cb) {

		manager.clearDatabaseTable(app.models[modelName].tableName, cb);
	},

	clearDatabaseTable: function(tableName, cb) {

		app.db.knex(tableName).del().then(_.bind(cb, undefined, null)).catch(cb);
	}
};
