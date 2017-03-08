'use strict';

module.exports = function(app) {

	// List of logs.
	app.get('/manage/logs', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Failed Access Logs',
			bodyClasses: 'manage manage-logs',
			layout: 'main'
		};

		var query = app.db.models.FailureLog.query();

		query.select().orderBy('id', 'desc');

		query.then(function(results) {

			templateData.logs = results;
			res.render('logs-list', templateData);

		}).catch(next);
	});
};
