var https 	= require("https");
var fs 		= require('fs');
var wget 	= require('mfx-wget');
var colors  = require('colors/safe');
var xmlobj 	= require('nodexml');

var kwet = require('./kwETTLib');
var eveapis = kwet.eveapis;

var accounts = require('./accounts.json');


var paidUntil = function(charname, apikey, vcode) {
	var url = eveapis.root + eveapis.accountStatus + '?keyID=' + apikey + '&vCode=' + vcode;
	var req = https.get(url, function(res){
		res.setEncoding('utf8');
		res.on('data', function(xmlString){
			console.log(xmlString);
			var obj = xmlobj.xml2obj(xmlString);
			var paid = obj.eveapi.result.paidUntil;

			console.log(colors.yellow.bold(charname) + ' paid until ' + colors.bold(paid) );			

			return paid; // returned undefined!!! Async ?

		});
	});
};

// iterate accounts from config file
Object.keys(accounts).forEach(function(charname) {
	var paid = paidUntil(charname, accounts[charname]['keyID'], accounts[charname]['vCode']);
});

