'use strict';

var _ = require('underscore');

module.exports = function(app) {

	var redirects = {
		// From --> To
		'/': '/manage/cards',
		'/manage': '/manage/cards'
	};

	_.each(redirects, function(to, from) {
		app.get(from, function(req, res, next) {
			res.redirect(to);
		});
	});
};
