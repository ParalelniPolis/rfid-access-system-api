'use strict';

var config = require('./config');
var knex = require('knex')(config.db);
module.exports = require('bookshelf')(knex);
