# rfid-access-system-api

Web API for [RFID access system](https://github.com/ParalelniPolis/rfid-locks) at [Paralelni Polis](https://www.paralelnipolis.cz/).


## Dependencies

* [Node.js](https://nodejs.org/)
* [grunt-cli](http://gruntjs.com/using-the-cli)
* [MySQL](https://www.mysql.com/)
* [Git](https://git-scm.com/)


## Setup

Make sure you have the necessary [dependencies](#dependencies) before continuing. 

Get the code:
```
git clone git@github.com:ParalelniPolis/rfid-access-system-api.git
```

Change into the project directory:
```
cd rfid-access-system-api
```

Install application dependencies via npm:
```
npm install
```
This will install all node modules that the project requires and build any needed web files (for the web GUI).


## Running the Server

To run the node.js server app:
```
npm start
```


### Configuration

Configuration variables should be set via environment variables (database credentials, session secret, etc). The application's configuration options are contained in the [config.js](https://github.com/ParalelniPolis/rfid-access-system-api/blob/master/config.js) file. __Do not modify config.js directly for this purpose__.


## Tests

If you are working on the server part of the app, then you should run the tests to verify that you haven't broken anything:
```
npm test
```
