'use strict';

module.exports = function(app) {

	require('./access')(app);
	require('./status')(app);
};
