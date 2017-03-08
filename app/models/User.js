'use strict';

var _ = require('underscore');
var async = require('async');
var BaseModel = require('./BaseModel');
var bcrypt = require('bcrypt');
var config = require('../config');

var Model = module.exports = BaseModel.extend({

	tableName: 'users',

	create: function(data, cb) {

		var now = new Date;

		data || (data = {});
		data = _.pick(data, 'username', 'password');
		data.created_at = now;
		data.updated_at = now;

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

		], _.bind(function(error) {

			if (error) {
				return cb(error);
			}

			this.query()
				.insert(data)
				.then(function(results) {
					var result = _.clone(data);
					result.id = results[0];
					cb(null, result);
				}).catch(cb);

		}, this));
	},

	findById: function(id, cb) {

		this.query()
			.select()
			.where('id', id)
			.limit(1)
			.then(function(results) {
				cb(null, results[0] || null);
			}).catch(cb);
	},

	findByUsername: function(username, cb) {

		this.query()
			.select()
			.where('username', username)
			.limit(1)
			.then(function(results) {
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

	defineSchema: function(table) {

		BaseModel.defineSchema.apply(this, arguments);

		table.increments('id').unsigned().primary();
		table.string('username').unique().notNullable();
		table.string('password');
		table.dateTime('created_at').notNullable();
		table.dateTime('updated_at').notNullable();
		table.engine('InnoDB');
		table.charset('utf8');
		table.collate('utf8_bin');
	}

});
