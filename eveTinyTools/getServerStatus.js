var https 	= require("https");
var fs 		= require('fs');
var wget 	= require('mfx-wget');
var colors  = require('colors/safe');
var xmlobj 	= require('nodexml');

var kwet = require('./kwETTLib');

var eveapis = kwet.eveapis;

var req = https.get(eveapis.root + eveapis.serverStatus, function(res) {
	res.setEncoding('utf8');
	res.on('data', function(xmlStr){
		var stat = kwet.parseServerStatus(xmlStr);

		var serverOpen = stat.serverOpen ? 'online' : 'offline';
		var online = stat.onlinePlayers;

		console.log('EVE Server is ' + colors.yellow.bold(serverOpen) + ', players online: ' + 
		colors.yellow.bold(online)  );
		
	});
});