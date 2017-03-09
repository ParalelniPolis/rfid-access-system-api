'use strict';

module.exports = function(app) {

	// List of logs.
	app.get('/manage/logs', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Failed Access Logs',
			bodyClasses: 'manage manage-logs',
			layout: 'main'
		};

		app.db.models.FailureLog.query()
			.select()
			.orderBy('id', 'desc')
			.then(function(results) {
				templateData.logs = results;
				res.render('logs-list', templateData);
			}).catch(next);
	});
};
