'use strict';

module.exports = function(app) {

	app.get('/logout', function(req, res, next) {

		if (!req.isAuthenticated()) {
			// Already logged out.
			return res.redirect('/');
		}

		req.logout(function(error) {

			if (error) {
				return next(error);
			}

			res.redirect('/');
		});
	});
};
