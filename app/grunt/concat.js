'use strict';

module.exports = {
	all_min_css: {
		src: [
			'build/min/reset.min.css',
			'build/min/fonts.min.css',
			'build/min/styles.min.css'
		],
		dest: 'build/all.min.css'
	},
	all_js: {
		src: [
			'web/js/extend.js',
			'web/js/domready.js',
			'web/js/manage.js'
		],
		dest: 'build/all.js'
	},
	all_min_js: {
		src: [
			'build/min/extend.min.js',
			'build/min/domready.min.js',
			'build/min/manage.min.js'
		],
		dest: 'build/all.min.js'
	}
};
