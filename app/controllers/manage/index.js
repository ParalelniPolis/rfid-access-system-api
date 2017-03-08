'use strict';

module.exports = function(app) {

	require('./cards')(app);
	require('./grant-access')(app);
	require('./locks')(app);
	require('./logs')(app);
};
