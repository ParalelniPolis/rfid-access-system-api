'use strict';

module.exports = function(app) {

	// List of locks.
	app.get('/manage/locks', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Locks',
			bodyClasses: 'manage manage-locks',
			layout: 'main'
		};

		app.db.models.Lock.query()
			.select()
			.orderBy('name', 'asc')
			.then(function(results) {
				templateData.locks = results;
				res.render('locks-list', templateData);
			}).catch(next);
	});

	// Add lock form.
	app.get('/manage/locks/add', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		res.render('locks-add-form', {
			title: 'Add Lock',
			bodyClasses: 'manage manage-locks-add',
			layout: 'main'
		});
	});

	app.get('/manage/locks/remove', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		app.db.models.Lock.query()
			.del()
			.where('id', req.query.id)
			.limit(1)
			.then(function() {
				res.redirect('/manage/locks');
			})
			.catch(next);
	});

	// Handle add lock form submit.
	app.post('/manage/locks/add', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Add Lock',
			bodyClasses: 'manage manage-locks-add',
			layout: 'main',
			formData: req.body
		};

		if (!req.body.name) {
			templateData.errors = ['Lock name is required'];
			return res.status(400).render('locks-add-form', templateData);
		}

		app.db.models.Lock.query()
			.select('id')
			.where('name', req.body.name)
			.limit(1)
			.then(function(results) {

				if (results.length > 0) {
					templateData.errors = ['Lock name already used'];
					return res.status(400).render('locks-add-form', templateData);
				}

				app.db.models.Lock.create({
					name: req.body.name
				}, function(error) {

					if (error) {
						app.lib.util.error(error);
						templateData.errors = ['An unexpected error has occurred.'];
						return res.status(500).render('grant-access-form', templateData);
					}

					res.redirect('/manage/locks');
				});

			}).catch(next);
	});
};
