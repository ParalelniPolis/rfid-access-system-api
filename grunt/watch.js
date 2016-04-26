'use strict';

module.exports = {
	all: {
		options: {
			cwd: __dirname + '/../'
		},
		files: [
			'web/css/**/*.css',
			'web/js/**/*.js'
		],
		tasks: ['build']
	}
};
