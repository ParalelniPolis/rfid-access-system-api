'use strict';

module.exports = function(app) {

	require('./api')(app);
	require('./login')(app);
	require('./logout')(app);
	require('./manage')(app);
	require('./redirects')(app);
};
