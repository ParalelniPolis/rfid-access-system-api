'use strict';

var _ = require('underscore');
var async = require('async');
var bcrypt = require('bcrypt');
var EventEmitter = require('events');

var config = require('../config');
var db = require('../db');

var tableName = 'users';

var allowedFields = {
	create: [
		'username',
		'password'
	],
	update: [
		'username',
		'password'
	]
};

var Model = module.exports = db.Model.extend({

	// Prototype/Instance.

	tableName: tableName,

	constructor: function() {

		db.Model.apply(this, arguments);

		_.bindAll(this, 'onCreating', 'onUpdating', 'onSaving');

		this.on('creating', this.onCreating);
		this.on('updating', this.onUpdating);
		this.on('saving', this.onSaving);

		_.each([
			'creating', 'created',
			'updating', 'updated',
			'saving', 'saved',
			'deleting', 'deleted'
		], function(eventName) {

			this.on(eventName, _.bind(Model.emit, Model, eventName));

		}, this);
	},

	onCreating: function() {

		var now = new Date();

		this.attributes.created_at = now;
		this.attributes.updated_at = now;

		return this;
	},

	onUpdating: function() {

		var now = new Date();

		this.attributes.updated_at = now;

		return this;
	},

	onSaving: function() {

		return this;
	}

}, {

	// Class.

	tableName: tableName,

	create: function(data, cb) {

		data || (data = {});
		data = _.pick(data, allowedFields.create);

		async.series([

			function hashPassword(next) {

				if (!data.password) {
					// No password provided.
					return next();
				}

				Model.hashPassword(data.password, function(error, hash) {

					if (error) {
						return next(error);
					}

					data.password = hash;
					next();
				});
			}

		], function(error) {

			if (error) {
				return cb(error);
			}

			var instance = Model.forge(data);

			instance.save().then(function() {
				cb(null, instance.toJSON());
			}).catch(cb);
		});
	},

	findById: function(id, cb) {

		var query = Model.query();

		query.select();
		query.where('id', id);
		query.limit(1)
		query.then(function(results) {

			results = _.map(results, function(result) {
				return Model.forge(result).toJSON();
			});

			cb(null, results[0] || null);

		}).catch(cb);
	},

	findByUsername: function(username, cb) {

		var query = Model.query();

		query.select();
		query.where('username', username);
		query.limit(1)
		query.then(function(results) {

			results = _.map(results, function(result) {
				return Model.forge(result).toJSON();
			});

			cb(null, results[0] || null);

		}).catch(cb);
	},

	checkPassword: function(password, hash, cb) {

		bcrypt.compare(password, hash, function(error, isMatch) {

			if (error) {
				return cb(error);
			}

			cb(null, isMatch);
		});
	},

	hashPassword: function(password, cb) {

		var workFactor = config.passwords.workFactor;

		bcrypt.genSalt(workFactor, function(error, salt) {

			if (error) {
				return cb(error);
			}

			bcrypt.hash(password, salt, function(error, hash) {

				if (error) {
					return cb(error);
				}

				cb(null, hash);
			});
		});
	},

	setUpTable: function(cb) {

		db.knex.schema.hasTable(tableName).then(function(exists) {

			if (exists) {
				return cb();
			}

			db.knex.schema.createTable(tableName, function(table) {

				table.increments('id').unsigned().primary();
				table.string('username').unique().notNullable();
				table.string('password');
				table.dateTime('created_at').notNullable();
				table.dateTime('updated_at').notNullable();
				table.engine('InnoDB');
				table.charset('utf8');
				table.collate('utf8_bin');

			}).then(function() {

				cb();

			}).catch(cb);

		}).catch(cb);
	}
});

_.extend(Model, EventEmitter.prototype);
