'use strict';

var _ = require('underscore');

module.exports = function(app) {

	// List of cards.
	app.get('/manage/cards', app.middleware.requireAuthenticationRedirect, function(req, res, next) {

		var templateData = {
			title: 'Cards',
			bodyClasses: 'manage manage-cards',
			layout: 'main'
		};

		var query = app.models.Card.query();

		query.select('cards.*');

		if (req.query.with_access_to) {

			// Show only cards with access to the given lock.

			query.leftJoin('card_lock_access', 'card_lock_access.card_id', 'cards.id');
			query.leftJoin('locks', 'locks.id', 'card_lock_access.lock_id');
			query.where('locks.name', req.query.with_access_to);
		}

		query.orderBy('cards.id', 'desc');

		query.then(function(cards) {

			getAccesses(_.pluck(cards, 'id'), function(error, accesses) {

				if (error) {
					app.lib.util.error(error);
				}

				templateData.withAccessTo = req.query.with_access_to || null;
				templateData.cards = _.map(cards, function(card) {

					card.accesses = _.chain(accesses).filter(function(access) {
						return access.card_id === card.id;
					}).pluck('lock_name').value();

					return card;
				});

				res.render('cards-list', templateData);
			});

		}).catch(next);
	});

	function getAccesses(cardIds, cb) {

		var query = app.models.CardLockAccess.query();
		query.select('card_lock_access.card_id', 'locks.name AS lock_name');
		query.where('card_id', 'in', cardIds);
		query.leftJoin('locks', 'locks.id', 'card_lock_access.lock_id');
		query.then(function(results) {
			cb(null, results);
		}).catch(cb);
	}
};
