'use strict';

var http = require('http');
var querystring = require('querystring');

var Client = module.exports = function(options) {

	this.options = options || {};
};

Client.prototype.get = function(uri, data, cb) {

	return this.request('GET', uri, data, cb);
};

Client.prototype.post = function(uri, data, cb) {

	return this.request('POST', uri, data, cb);
};

Client.prototype.put = function(uri, data, cb) {

	return this.request('PUT', uri, data, cb);
};

Client.prototype.delete = function(uri, data, cb) {

	return this.request('DELETE', uri, data, cb);
};

Client.prototype.request = function(method, uri, data, cb) {

	if (typeof data === 'function') {
		cb = data;
		data = null;
	}

	method = method.toString().toUpperCase();

	var options = {
		host: this.options.host,
		port: this.options.port,
		path: uri,
		method: method,
		headers: {}
	};

	var dataStr;

	if (data) {

		if (['GET', 'DELETE'].indexOf(method) !== -1) {

			if (typeof data !== 'string') {
				dataStr = querystring.stringify(data);
			} else {
				dataStr = data;
			}

			options.path += '?' + dataStr;

		} else if (['POST', 'PUT'].indexOf(method) !== -1) {

			if (typeof data !== 'string') {
				dataStr = JSON.stringify(data);
			} else {
				dataStr = data;
			}

			options.headers['Content-Type'] = 'application/json';
			options.headers['Content-Length'] = dataStr.length;
		}
	}

	if (this.options.idToken) {

		// Authentication via ID token.

		options.headers['Authorization'] = 'ID-Token ' + this.options.idToken;

	} else if (this.options.apiKey) {

		// Authentication via API key.

		options.headers['Authorization'] = 'API-Key ' + this.options.apiKey;
	}

	if (this.options.userAgent) {
		options.headers['User-Agent'] = this.options.userAgent;
	}

	var req = http.request(options, function(res) {

		res.setEncoding('utf8');

		var responseData = '';

		res.on('data', function(chunk) {

			responseData += chunk;
		});

		res.on('end', function() {

			if (res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') !== -1) {

				try {
					responseData = JSON.parse(responseData);
				} catch (error) {
					res.destroy();
					return cb(error);
				}
			}

			res.destroy();

			cb(null, responseData, res.statusCode, res.headers);
		});
	});

	req.on('error', cb);

	if (dataStr && ['POST', 'PUT'].indexOf(method) !== -1) {
		req.write(dataStr);
	}

	req.end();
};

Client.prototype.GET = Client.prototype.get;
Client.prototype.POST = Client.prototype.post;
Client.prototype.PUT = Client.prototype.put;
Client.prototype.DELETE = Client.prototype.delete;
