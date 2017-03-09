'use strict';

var _ = require('underscore');
var BaseModel = require('./BaseModel');

module.exports = BaseModel.extend({

	tableName: 'card_lock_access',

	create: function(data, cb) {

		var now = new Date;

		data || (data = {});
		data = _.pick(data, 'lock_id', 'card_id');
		data.created_at = now;
		data.updated_at = now;

		this.query()
			.insert(data)
			.then(function(results) {
				var result = _.clone(data);
				result.id = results[0];
				cb(null, result);
			}).catch(cb);
	},

	createBulk: function(dataArray, cb) {

		var now = new Date;

		dataArray = _.map(dataArray, function(data) {
			data = _.pick(data, 'lock_id', 'card_id');
			data.created_at = now;
			data.updated_at = now;
			return data;
		});

		this.query()
			.insert(dataArray)
			.then(function(results) {
				cb(null, dataArray);
			}).catch(cb);
	},

	defineSchema: function(table) {

		BaseModel.defineSchema.apply(this, arguments);

		table.increments('id').primary();
		table.integer('lock_id').unsigned().references('id').inTable('locks').notNullable();
		table.integer('card_id').unsigned().references('id').inTable('cards').notNullable();
		table.dateTime('created_at').notNullable();
		table.dateTime('updated_at').notNullable();
		table.engine('InnoDB');
		table.charset('utf8');
		table.collate('utf8_bin');
	}

});


