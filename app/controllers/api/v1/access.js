'use strict';

module.exports = function(app) {

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

		var query = app.db.models.CardLockAccess.query();

		query.select('card_lock_access.id');
		query.leftJoin('locks', 'locks.id', 'card_lock_access.lock_id');
		query.leftJoin('cards', 'cards.id', 'card_lock_access.card_id');
		query.where('locks.name', lockName);
		query.andWhere('cards.identifier', cardIdentifier);
		query.limit(1);

		query.then(function(results) {

			var canAccess = results.length > 0;

			if (canAccess) {
				return res.json(makeResponseObject(lockName, true));
			}

			app.db.models.FailureLog.create({
				lock_name: lockName,
				card_identifier: cardIdentifier
			}, function(error) {

				if (error) {
					util.error(error);
				}

				res.json(makeResponseObject(lockName, false));
			});

		}).catch(next);
	}

	function makeResponseObject(lockName, canAccess) {

		var data = {};
		data[lockName] = canAccess === true;
		return data;
	}
};
