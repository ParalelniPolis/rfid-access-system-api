'use strict';

module.exports = function(app) {

	app.middleware = {};

	// The order here is important.
	require('./security')(app);
	require('./parsers')(app);
	require('./template')(app);
	require('./static')(app);
	require('./session')(app);
	require('./auth')(app);
};
