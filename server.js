/* 
    server.js
    mongodb-rest

    Created by Tom de Grunt on 2010-10-03.
    Copyright (c) 2010 Tom de Grunt.
		This file is part of mongodb-rest.
*/ 

var fs = require("fs"),
		sys = require("sys"),
		express = require('express');
		
var config = { "db": {
  'port': 27017,
  'host': "localhost"
  },
  'server': {
    'port': 3000,
    'address': "0.0.0.0"
  },
  'flavor': "regular",
  'debug': true
};

var app = module.exports.app = express.createServer();

try {
  config = JSON.parse( fs.readFileSync( process.cwd() + "/config.json" ) );
} 
catch(e) {
  console.log("Unable to load config.json due to " + e + ". Using defaults");	
  // ignore
}

module.exports.config = config;

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(process.cwd() + '/public'));
    app.use(express.logger());
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
	
	if (config.accessControl){
		var accesscontrol = require('./lib/accesscontrol');
		app.use(accesscontrol.handle);
	}	
});

if (config.filters) {
	module.exports.filters = require( config.filters );
	console.log("Using filters: " + config.filters);
}

require('./lib/main');
require('./lib/command');
require('./lib/rest');

if(!process.argv[2] || !process.argv[2].indexOf("expresso")) {
  app.listen(config.server.port, config.server.address);
}
