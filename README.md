# rfid-access-system-api

Web API for [RFID access system](https://github.com/ParalelniPolis/rfid-locks) at [Paralelni Polis](https://www.paralelnipolis.cz/).

[![Build Status](https://travis-ci.org/ParalelniPolis/rfid-access-system-api.svg?branch=master)](https://travis-ci.org/ParalelniPolis/rfid-access-system-api)


## Requirements

* [Node.js](https://nodejs.org/)
* [grunt-cli](http://gruntjs.com/using-the-cli)
* [MySQL](https://www.mysql.com/)
* [Git](https://git-scm.com/)


## Setup

Make sure you have the necessary [requirements](#requirements) before continuing. 

Get the code:
```bash
git clone git@github.com:ParalelniPolis/rfid-access-system-api.git
```

Change into the project's app directory:
```bash
cd rfid-access-system-api/app
```

Install application dependencies via npm:
```bash
npm install
```

Build web files:
```bash
grunt build
```

### Database

You will need to create a MySQL database and user:
```mysql
CREATE DATABASE IF NOT EXISTS prase_local;
GRANT USAGE ON *.* TO  'prase_local'@'localhost' IDENTIFIED BY 'password' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0 ;
GRANT ALL PRIVILEGES ON `prase_local`.* TO 'prase_local'@'localhost';
```

### Configuration

Configuration variables should be set via environment variables (database credentials, session secret, etc). The application's configuration options are contained in the [config.js](https://github.com/ParalelniPolis/rfid-access-system-api/blob/master/config.js) file. __Do not modify config.js directly for this purpose__.


### Running the Server

To run the node.js server app:
```bash
npm start
```


## Tests

If you are working on the server part of the app, then you should run the tests to verify that you haven't broken anything:
```bash
npm test
```


## Production

The production instance of the PRASE system is running on a [raspberry pi](https://www.raspberrypi.org/products/raspberry-pi-3-model-b/) in the Hackerspace of Paralelni Polis. It has a static IP address (192.168.53.114) on the Local Area Network. It is possible to connect to it via SSH, but you must be connected to the Institut wifi network.

The production PRASE web service can be reached at [prase.paralelnipolis.cz](https://prase.paralelnipolis.cz/) when you are connected to any wifi in Paralelni Polis. This works because the network at Polis is configured to route this sub-domain to the pi's static IP.

The SSL certificate is self-signed, so you will need to add it to your system's list of trusted certificates if you want to skip error screens.

There is a deployment script which allows updating the web app on the raspberry pi. You need to have root access to the raspberry pi to be able to deploy changes. To deploy to the production instance:
```bash
./scripts/deploy.sh prod
```
