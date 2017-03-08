'use strict';

module.exports = {
	dev: {
		script: '../server.js',
		options: {
			args: ['dev'],
			nodeArgs: ['--debug'],
			ignore: [
				'../grunt',
				'../node_modules',
				'../test'
			],
			watch: ['../'],
			ext: 'js',
			debug: true,
			delay: 1000,
			cwd: __dirname
		}
	}
};
