'use strict';

var _ = require('underscore');
var session = require('express-session');

module.exports = function(app) {

	app.use(session(_.extend({}, app.config.sessions, {
		store: app.sessionStore
	})));
};
