'use strict';

var expect = require('chai').expect;
var request = require('request');
var manager = require('../../../manager');

describe('GET /api/v1/status', function() {

	before(manager.setUp);
	after(manager.tearDown);

	it('should respond with 200 OK', function(done) {

		var uri = manager.url('/api/v1/status');

		request.get(uri, function(error, response, body) {

			try {
				expect(error).to.equal(null);
				expect(response.statusCode).to.equal(200);
				expect(body).to.equal('Ahoj!');
			} catch (error) {
				return done(error);
			}

			done();
		});
	});
});
