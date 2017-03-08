(function() {

	'use strict';

	window.addClassToEl = function(el, className) {

		var classes = el.className.split(' ');
		var index = classes.indexOf(className);

		if (index === -1) {
			classes.push(className);
			el.className = classes.join(' ');
		}
	};

	window.removeClassFromEl = function(el, className) {

		var classes = el.className.split(' ');
		var index = classes.indexOf(className);

		if (index !== -1) {
			classes.splice(index, 1);
			el.className = classes.join(' ');
		}
	};

	window.elHasClass = function(el, className) {

		var classes = el.className.split(' ');
		return classes.indexOf(className) !== -1;
	};

	window.ajax = function(method, uri, data, cb) {

		method = method.toUpperCase();

		var xmlhttp;

		if (window.XMLHttpRequest) {
			// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		} else {
			// code for IE6, IE5
			xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		}

		xmlhttp.onreadystatechange = function() {

			if (xmlhttp.readyState === XMLHttpRequest.DONE) {

				if (xmlhttp.status === 200) {

					try {

						var responseData = JSON.parse(xmlhttp.responseText);

					} catch (error) {
						return cb(error);
					}

					cb(null, responseData);

				} else {

					cb(new Error(xmlhttp.responseText));
				}
			}
		};

		var dataArray = [];

		for (var field in data) {
			dataArray.push(encodeURIComponent(field) + '=' + encodeURIComponent(data[field]));
		}

		var dataStr;

		switch (method) {

			case 'GET':
			case 'DELETE':
				if (dataArray.length) {
					uri += '?' + dataArray.join('&');
				}
				break;

			case 'POST':
			case 'PUT':
				xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				dataStr = dataArray.join('&');
				break;
		}

		xmlhttp.open(method, uri, true);
		xmlhttp.send(dataStr);
	};

	window.redirect = function(url) {

		if (window.location && window.location.replace) {
			// Similar behavior as an HTTP redirect:
			window.location.replace(url);
		} else {
			// Similar behavior as clicking on a link:
			window.location.href = url;
		}
	};

})();
