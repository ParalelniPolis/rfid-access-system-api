'use strict';

module.exports = function(app) {

	// List of locks.
	app.get('/manage/locks', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Locks',
			bodyClasses: 'manage manage-locks',
			layout: 'main'
		};

		var query = app.models.Lock.query();

		query.select().orderBy('name', 'asc');

		query.then(function(results) {

			templateData.locks = results;
			res.render('locks-list', templateData);

		}).catch(next);
	});
};
