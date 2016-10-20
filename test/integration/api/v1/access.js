'use strict';

var _ = require('underscore');
var expect = require('chai').expect;

var manager = require('../../../manager');
var app = manager.app();

_.each([

	{
		description: 'GET /api/v1/access',
		makeRequest: function(client, query, cb) {

			client.get('/api/v1/access', query, cb);
		}
	},

	{
		description: 'GET /:lang/LockAuthorize/:lock/:card',
		makeRequest: function(client, query, cb) {

			client.get('/en/LockAuthorize/' + query.lock + '/' + query.card, cb);
		}
	}

], function(test) {

	describe(test.description, function() {

		before(app.onReady);
		before(manager.setUp);
		after(manager.tearDown);

		var client;

		before(function() {

			client = manager.client();
		});

		var lock;

		before(function(done) {

			app.models.Lock.create({
				name: 'someLock'
			}, function(error, result) {

				if (error) {
					return done(error);
				}

				lock = result;
				done();
			});
		});

		var card;

		before(function(done) {

			app.models.Card.create({
				identifier: 'someIdentifier'
			}, function(error, result) {

				if (error) {
					return done(error);
				}

				card = result;
				done();
			});
		});

		before(function(done) {

			app.models.CardLockAccess.create({
				lock_id: lock.id,
				card_id: card.id
			}, done);
		});

		var otherLock;

		before(function(done) {

			app.models.Lock.create({
				name: 'someOtherLock'
			}, function(error, result) {

				if (error) {
					return done(error);
				}

				otherLock = result;
				done();
			});
		});

		it('lock does not exist', function(done) {

			var query = {
				lock: 'doesNotExist',
				card: card.identifier
			};

			test.makeRequest(client, query, function(error, data, status) {

				if (error) {
					return done(error);
				}

				var expected = {};

				expected[query.lock] = false;

				try {
					expect(status).to.equal(200);
					expect(data).to.deep.equal(expected);
				} catch (error) {
					return done(error);
				}

				done();
			});
		});

		it('card does not have access to lock', function(done) {

			var query = {
				lock: otherLock.name,
				card: card.identifier
			};

			test.makeRequest(client, query, function(error, data, status) {

				if (error) {
					return done(error);
				}

				var expected = {};

				expected[query.lock] = false;

				try {
					expect(status).to.equal(200);
					expect(data).to.deep.equal(expected);
				} catch (error) {
					return done(error);
				}

				done();
			});
		});

		it('card does not exist', function(done) {

			var query = {
				lock: lock.name,
				card: 'doesNotExist'
			};

			test.makeRequest(client, query, function(error, data, status) {

				if (error) {
					return done(error);
				}

				var expected = {};

				expected[query.lock] = false;

				try {
					expect(status).to.equal(200);
					expect(data).to.deep.equal(expected);
				} catch (error) {
					return done(error);
				}

				// Should have logged the failed access request.

				var dbQuery = app.models.FailureLog.query();
				dbQuery.select();
				dbQuery.where('lock_name', query.lock);
				dbQuery.where('card_identifier', query.card);
				dbQuery.limit(1);
				dbQuery.then(function(results) {
					expect(results).to.have.length(1);
					done();
				}).catch(done);
			});
		});

		it('card has access to lock', function(done) {

			var query = {
				lock: lock.name,
				card: card.identifier
			};

			test.makeRequest(client, query, function(error, data, status) {

				if (error) {
					return done(error);
				}

				var expected = {};

				expected[query.lock] = true;

				try {
					expect(status).to.equal(200);
					expect(data).to.deep.equal(expected);
				} catch (error) {
					return done(error);
				}

				// Should NOT have logged the successful access request.

				var dbQuery = app.models.FailureLog.query();
				dbQuery.select();
				dbQuery.where('lock_name', query.lock);
				dbQuery.where('card_identifier', query.card);
				dbQuery.limit(1);
				dbQuery.then(function(results) {
					expect(results).to.have.length(0);
					done();
				}).catch(done);
			});
		});
	});
});
