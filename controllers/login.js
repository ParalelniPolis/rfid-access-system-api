'use strict';

module.exports = function(app) {

	app.get('/login', function(req, res, next) {

		if (req.isAuthenticated()) {
			// Already logged in.
			return res.redirect('/manage');
		}

		res.render('login', {
			title: 'Login',
			bodyClasses: 'login',
			layout: 'main'
		});
	});

	app.post('/login', function(req, res, next) {

		if (req.isAuthenticated()) {
			// Already logged in.
			return res.redirect('/manage');
		}

		var username = req.body.username;
		var password = req.body.password;

		if (!username) {
			return res.status(400).render('login', {
				title: 'Login',
				bodyClasses: 'login',
				layout: 'main',
				errors: {
					username: 'Username is required'
				}
			});
		}

		if (!password) {
			return res.status(400).render('login', {
				title: 'Login',
				bodyClasses: 'login',
				layout: 'main',
				errors: {
					password: 'Password is required'
				}
			});
		}

		app.models.User.findByUsername(username, function(error, user) {

			if (error) {
				return next(error);
			}

			if (!user || !user.password) {
				// User does not exist, or the user has no password (so cannot login).
				return res.status(400).render('login', {
					title: 'Login',
					bodyClasses: 'login',
					layout: 'main',
					errors: ['Incorrect username or password']
				});
			}

			app.models.User.checkPassword(password, user.password, function(error, isMatch) {

				if (error) {
					return next(error);
				}

				if (!isMatch) {
					return res.status(400).render('login', {
						title: 'Login',
						bodyClasses: 'login',
						layout: 'main',
						errors: ['Incorrect username or password']
					});
				}

				req.login(user, function(error) {

					if (error) {
						return next(error);
					}

					res.redirect('/manage');
				});
			});
		});
	});
};
