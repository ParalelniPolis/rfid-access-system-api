'use strict';

var inquirer = require('inquirer');

var validate = {
	required: function(value) {
		return !value ? 'This field is required' : true;
	}
};

inquirer.prompt([

	{
		name: 'username',
		message: 'Username',
		type: 'input',
		validate: validate.required
	},
	{
		name: 'password',
		message: 'Password',
		type: 'password',
		validate: validate.required
	}

], function(answers) {

	var UserModel = require('../models/User');

	UserModel.create(answers, function(error, user) {

		if (error) {
			console.error(error);
			return process.exit(1);
		}

		console.log('Success! A new admin user has been created.');
		process.exit(0);
	});
});
