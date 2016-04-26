'use strict';

var _ = require('underscore');

module.exports = function(app) {

	app.use(function(req, res, next) {

		if (req.isApiEndPoint()) {
			// Don't do session authentication for API end-points.
			return next();
		}

		if (req.isAuthenticated()) {
			// Already authenticated.
			// Continue with the request.
			return next();
		}

		var userId = req.session.user && req.session.user.id;

		if (!userId) {
			return next();
		}

		app.deserializeUser(userId, function(error, user) {

			if (error) {
				return next(error);
			}

			req.user = user;
			next();
		});
	});

	app.use(function(req, res, next) {

		req.login = function(user, cb) {

			this.session.user = {
				id: user.id
			};

			this.session.save(cb);
		};

		req.logout = function(cb) {

			this.session.destroy(cb);
		};

		req.checkNonce = function() {

			var nonce = this.body && this.body.nonce || this.query && this.query.nonce;

			return this.session.nonces && !!_.findWhere(this.session.nonces, { nonce: nonce });
		};

		next();
	});

	app.use(function(req, res, next) {

		if (!req.isAuthenticated()) {
			// Don't worry about nonces for unauthenticated users.
			return next();
		}

		req.session.nonces = req.session.nonces || [];

		var now = (new Date).getTime();

		req.session.nonces = _.filter(req.session.nonces, function(nonce) {
			return now - nonce.createdAt <= app.config.nonce.maxAge;
		});

		var newNonce = app.lib.util.generateRandomString(32);

		req.session.nonces.push({
			nonce: newNonce,
			createdAt: now
		});

		req.session.save(function(error) {

			if (error) {
				return next(error);
			}

			res.locals.nonce = newNonce;
			next();
		});
	});

	app.middleware.requireNonce = function(req, res, next) {

		if (!req.checkNonce()) {
			var error = new Error('Valid nonce required');
			error.status = 400;
			return next(error);
		}

		next();
	};
};
