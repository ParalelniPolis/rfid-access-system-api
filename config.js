'use strict';

var config = module.exports = {

	host: process.env.PRASE_HOST || 'localhost',
	port: parseInt(process.env.PRASE_PORT || 3000),

	db: {
		client: process.env.PRASE_DB_CLIENT || 'mysql',
		connection: {
			host: process.env.PRASE_DB_HOST || '127.0.0.1',
			port: parseInt(process.env.PRASE_DB_PORT || 3306),
			user: process.env.PRASE_DB_USER || 'prase_local',
			password: process.env.PRASE_DB_PASS || 'password',
			database: process.env.PRASE_DB_NAME || 'prase_local',
			timezone: process.env.PRASE_DB_TIMEZONE || 'UTC'
		}
	},

	site: {
		name: 'p.r.a.s.e.',
		slogan: 'RFID access system at Paralelni Polis'
	},

	passwords: {
		workFactor: parseInt(process.env.PRASE_PASSWORDS_WORK_FACTOR || '10')
	},

	nonce: {
		maxAge: 5 * 60 * 1000// 5 minutes
	},

	sessions: {
		key: 'prase-session',
		secret: process.env.PRASE_SESSIONS_SECRET,
		cookie: {
			path: '/',
			maxAge: 30 * 86400 * 1000,// 30 days
			httpOnly: true,
			secure: false
		},
		secureProxy: false,
		proxy: false,
		resave: true,
		saveUninitialized: false,
		storeOptions: {
			expiration: 30 * 86400 * 1000,// 30 days
			autoReconnect: true,
			keepAlive: true
		}
	},

	template: {
		extension: '.html',
		defaultLayout: 'main',
		viewsDir: __dirname + '/views'
	},

	publicDir: __dirname + '/public'
};

if (!config.sessions.secret) {
	throw new Error('config.sessions.secret is required');
	process.exit(1);
}
