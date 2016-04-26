'use strict';

module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: 'web/js',
			src: ['*.js'],
			dest: 'build/min/',
			ext: '.min.js'
		}]
	}
};
