'use strict';

module.exports = {
	test: {
		PRASE_HOST: 'localhost',
		PRASE_PORT: 3002,
		PRASE_DB_HOST: process.env.PRASE_DB_HOST || '127.0.0.1',
		PRASE_DB_PORT: process.env.PRASE_DB_PORT || 3306,
		PRASE_DB_USER: process.env.PRASE_DB_USER || 'prase_test',
		PRASE_DB_PASS: typeof process.env.PRASE_DB_PASS !== 'undefined' ? process.env.PRASE_DB_PASS : 'password',
		PRASE_DB_NAME: process.env.PRASE_DB_NAME || 'prase_test',
		PRASE_SESSIONS_SECRET: process.env.PRASE_SESSIONS_SECRET || 'super secret'
	}
};
