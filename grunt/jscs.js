'use strict';

module.exports = {
	src: [
		'test/**/*.js',
		'gruntFile.js',
		'index.js'
	],
	options: {
		config: '.jscsrc',
		requireCurlyBraces: [ 'if', 'for', 'while' ]
	}
};
