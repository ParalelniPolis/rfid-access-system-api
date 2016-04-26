'use strict';

var exphbs = require('express-handlebars');
var url = require('url');

module.exports = function(app) {

	var hbs = exphbs.create({ 
		extname: app.config.template.extension,
		defaultLayout: app.config.template.defaultLayout,
		layoutsDir: app.config.template.viewsDir + '/layouts/',
		partialsDir: app.config.template.viewsDir + '/partials/',
		helpers: {
			prettyDate: function(date, options) {
				return prettyDate(date);
			},
			isoDate: function(date, options) {
				return (new Date(date)).toISOString().replace(/T/, ' ').replace(/\..+/, '')
			},
			isEnv: function(env, options) {

				if (env === app.env) {
					return options.fn(this);
				}

				return options.inverse(this);
			},
			isUri: function(uri, options) {

				if (uri === this.uri) {
					return options.fn(this);
				}

				return options.inverse(this);
			}
		}
	});

	function prettyDate(date) {

		if (!(date instanceof Date)) {
			date = new Date(date);
		}

		var now = (new Date()).getTime();
		var diff = (now - date.getTime()) / 1000;
		var day_diff = Math.floor(diff / 86400);

		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 ) {
			return '';
		}

		return day_diff == 0 &&
			(
				diff < 60 && 'just now' ||
				diff < 120 && '1 minute ago' ||
				diff < 3600 && Math.floor( diff / 60 ) + ' minutes ago' ||
				diff < 7200 && '1 hour ago' ||
				diff < 86400 && Math.floor( diff / 3600 ) + ' hours ago'
			) ||
			day_diff == 1 && 'Yesterday' ||
			day_diff < 7 && day_diff + ' days ago' ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + ' weeks ago';
	}

	app.engine(app.config.template.extension, hbs.engine);
	app.set('views', app.config.template.viewsDir);
	app.set('view engine', app.config.template.extension);
	// app.enable('view cache');

	app.use(function(req, res, next) {

		res.locals.site = app.config.site;
		res.locals.uri = url.parse(req.url).pathname;

		if (req.body) {
			res.locals.postData = req.body;
		}

		if (req.query) {
			res.locals.query = req.query;
		}

		next();
	});
};
