'use strict';

module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: 'web/css',
			src: ['*.css'],
			dest: 'build/min/',
			ext: '.min.css'
		}]
	}
};
