'use strict';

var _ = require('underscore');
var BaseModel = require('./BaseModel');

module.exports = BaseModel.extend({

	tableName: 'failure_log',

	create: function(data, cb) {

		var now = new Date;

		data || (data = {});
		data = _.pick(data, 'lock_name', 'card_identifier');
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

	defineSchema: function(table) {

		BaseModel.defineSchema.apply(this, arguments);

		table.increments('id').primary();
		table.string('lock_name').notNullable();
		table.string('card_identifier').notNullable();
		table.dateTime('created_at').notNullable();
		table.dateTime('updated_at').notNullable();
		table.engine('InnoDB');
		table.charset('utf8');
		table.collate('utf8_bin');
	}

});
