'use strict';

var _ = require('underscore');
var EventEmitter = require('events');

var db = require('../db');

var tableName = 'cards';

var allowedFields = {
	create: [
		'identifier',
		'contact_name',
		'contact_email'
	],
	update: [
		'contact_name',
		'contact_email'
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

		if (!this.attributes.identifier) {
			throw new Error('Identifier is required.');
		}

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

	findById: function(id, cb) {

		var query = Model.query();

		query.select();
		query.where('id', id);
		query.limit(1);
		query.then(function(results) {

			results = _.map(results, function(result) {
				return Model.forge(result).toJSON();
			});

			cb(null, results[0] || null);

		}).catch(cb);
	},

	create: function(data, cb) {

		data || (data = {});
		data = _.pick(data, allowedFields.create);

		var instance = Model.forge(data);

		instance.save().then(function() {
			cb(null, instance.toJSON());
		}).catch(cb);
	},

	update: function(id, data, cb) {

		Model.findById(id, function(error, instance) {

			if (error) {
				return cb(error);
			}

			data || (data = {});
			data = _.pick(data, allowedFields.update);
			data.id = id;

			instance = Model.forge(data);

			instance.save().then(function() {
				cb(null, instance.toJSON());
			}).catch(cb);
		});
	},

	query: function() {

		return db.knex(tableName);
	},

	setUpTable: function(cb) {

		db.knex.schema.hasTable(tableName).then(function(exists) {

			if (exists) {
				return cb();
			}

			db.knex.schema.createTable(tableName, function(table) {

				table.increments('id').primary();
				table.string('identifier').unique().notNullable();
				table.string('contact_name');
				table.string('contact_email');
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
