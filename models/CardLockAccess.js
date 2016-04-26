'use strict';

var _ = require('underscore');
var EventEmitter = require('events');

var db = require('../db');

var tableName = 'card_lock_access';

var allowedFields = {
	create: [
		'lock_id',
		'card_id'
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

		if (!this.attributes.lock_id) {
			throw new Error('Lock ID is required.');
		}

		if (!this.attributes.card_id) {
			throw new Error('Card ID is required.');
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

	create: function(data, cb) {

		data || (data = {});
		data = _.pick(data, allowedFields.create);

		var instance = Model.forge(data);

		instance.save().then(function() {
			cb(null, instance.toJSON());
		}).catch(cb);
	},

	createBulk: function(dataArray, cb) {

		var instances;

		db.transaction(function(trx) {

			try {

				instances = _.map(dataArray, function(data) {
					data = _.pick(data, allowedFields.create);
					return Model.forge(data).onCreating().onSaving();
				});

			} catch (error) {
				return trx.rollback(error);
			}

			dataArray = _.map(instances, function(instance) {
				return instance.attributes;
			});

			db.knex(tableName).transacting(trx).insert(dataArray).then(function() {

				instances = _.map(instances, function(instance) {
					instance.emit('created', instance);
					return instance.toJSON();
				});

				trx.commit();

			}).catch(function(error) {
				trx.rollback(error);
			});

		}).then(function() {
			cb(null, instances);
		}).catch(cb);
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
				table.integer('lock_id').unsigned().references('id').inTable('locks').notNullable();
				table.integer('card_id').unsigned().references('id').inTable('cards').notNullable();
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
