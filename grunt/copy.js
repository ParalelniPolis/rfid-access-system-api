'use strict';

module.exports = {
	all: {
		files: [
			{
				nonull: true,
				expand: true,
				flatten: true,
				cwd: 'build/',
				src: '*.js',
				dest: 'public/js/'
			},
			{
				nonull: true,
				expand: true,
				flatten: true,
				cwd: 'build/',
				src: '*.css',
				dest: 'public/css/'
			},
			{
				nonull: true,
				expand: true,
				flatten: true,
				cwd: 'node_modules/open-sans-fontface/',
				src: [
					'fonts/**/*.{ttf,eot,svg,woff,woff2}'
				],
				dest: 'public/fonts/OpenSans/'
			}
		]
	}
};
