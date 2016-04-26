'use strict';

var config = require('./config');

var knex = require('knex')(config.db);
var db = module.exports = require('bookshelf')(knex);
