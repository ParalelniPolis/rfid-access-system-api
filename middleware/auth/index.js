'use strict';

var _ = require('underscore');
var async = require('async');
var url = require('url');

var authMethods = {
	session: require('./session'),
};

module.exports = function(app) {

	app.use(function(req, res, next) {

		req.isAuthenticated = requestIsAuthenticated;
		next();
	});

	app.use(function(req, res, next) {

		var uri = url.parse(req.url).pathname;
		var isApiEndPoint = /^\/api\//.test(uri);

		req.isApiEndPoint = function() {

			return isApiEndPoint;
		};

		next();
	});

	app.middleware.requireAuthentication = function(req, res, next) {

		if (!req.isAuthenticated()) {
			var error = new Error('Authentication required');
			error.status = 401;
			return next(error);
		}

		next();
	};

	app.middleware.requireAuthenticationRedirect = function(req, res, next) {

		if (!req.isAuthenticated()) {
			return res.redirect('/login');
		}

		next();
	};

	app.normalizeUser = function(user) {

		return _.pick(user, 'id', 'username');
	};

	app.deserializeUser = function(userId, cb) {

		app.models.User.findById(userId, function(error, user) {

			if (error) {
				return cb(error);
			}

			if (!user) {
				return cb(null, null);
			}

			user = app.normalizeUser(user);

			cb(null, user);
		});
	};

	app.serializeUser = function(user, cb) {

		cb(null, user.id);
	};

	_.each(_.keys(authMethods), function(key) {
		authMethods[key](app);
	});

	app.use(function(req, res, next) {

		res.locals.isLoggedIn = req.isAuthenticated();
		res.locals.isNotLoggedIn = !res.locals.isLoggedIn;
		next();
	});
};

var requestIsAuthenticated = function() {

	return !!this.user;
};
