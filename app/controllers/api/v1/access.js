'use strict';

module.exports = function(app) {

	var async = require('async');

	app.get('/:lang/LockAuthorize/:lock/:card', function(req, res, next) {

		checkAccess(req.params.lock, req.params.card, req, res, next);
	});

	app.get('/api/v1/access', function(req, res, next) {

		var error;

		if (!req.query.lock) {
			error = new Error('Missing required query parameter: "lock"');
			error.status = 400;
			return next(error);
		}

		if (!req.query.card) {
			error = new Error('Missing required query parameter: "card"');
			error.status = 400;
			return next(error);
		}

		checkAccess(req.query.lock, req.query.card, req, res, next);
	});

	function checkAccess(lockName, cardIdentifier, req, res, next) {

		app.db.models.CardLockAccess.query()
			.select('card_lock_access.id')
			.leftJoin('locks', 'locks.id', 'card_lock_access.lock_id')
			.leftJoin('cards', 'cards.id', 'card_lock_access.card_id')
			.where('locks.name', lockName)
			.andWhere('cards.identifier', cardIdentifier)
			.limit(1)
			.then(function(results) {

				var canAccess = results.length > 0;

				res.json(makeResponseObject(lockName, canAccess));

				if (!canAccess) {

					app.db.models.FailureLog.create({
						lock_name: lockName,
						card_identifier: cardIdentifier
					}, function(error) {

						if (error) {
							app.lib.util.error(error);
						}
					});
				}

			}).catch(next);
	}

	function makeResponseObject(lockName, canAccess) {

		var data = {};
		data[lockName] = canAccess === true;
		return data;
	}
};
