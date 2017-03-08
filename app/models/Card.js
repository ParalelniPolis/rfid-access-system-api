'use strict';

var _ = require('underscore');
var BaseModel = require('./BaseModel');

module.exports = BaseModel.extend({

	tableName: 'cards',

	findById: function(id, cb) {

		this.query()
			.select()
			.where('id', id)
			.limit(1)
			.then(function(results) {
				cb(null, results[0] || null);
			}).catch(cb);
	},

	create: function(data, cb) {

		var now = new Date;

		data || (data = {});
		data = _.pick(data, 'identifier', 'contact_name', 'contact_email');
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

	update: function(id, data, cb) {

		var now = new Date;

		data || (data = {});
		data = _.pick(data, 'contact_name', 'contact_email');
		data.updated_at = now;

		this.query()
			.update(data)
			.where('id', id)
			.limit(1)
			.then(function() {
				cb(null, data);
			}).catch(cb);
	},

	defineSchema: function(table) {

		BaseModel.defineSchema.apply(this, arguments);

		table.increments('id').primary();
		table.string('identifier').unique().notNullable();
		table.string('contact_name');
		table.string('contact_email');
		table.dateTime('created_at').notNullable();
		table.dateTime('updated_at').notNullable();
		table.engine('InnoDB');
		table.charset('utf8');
		table.collate('utf8_bin');
	}

});
