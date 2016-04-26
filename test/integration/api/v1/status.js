'use strict';

var expect = require('chai').expect;

var manager = require('../../../manager');

var verb = 'GET';
var uri = '/api/v1/status';

describe(verb + ' ' + uri, function() {

	var client;

	before(function() {

		client = manager.client();
	});

	it('should respond with 200 OK', function(done) {

		client[verb](uri, function(error, data, status) {

			if (error) {
				return done(error);
			}

			try {
				expect(status).to.equal(200);
				expect(data).to.equal('Ahoj!');
			} catch (error) {
				return done(error);
			}

			done();
		});
	});
});
