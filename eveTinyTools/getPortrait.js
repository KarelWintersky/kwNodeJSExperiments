var https 	= require("https");
// var xmlobj 	= require('nodexml');

var kwet = require('./kwETTLib');
var eveapis = kwet.eveapis;

/* args */
var charname = process.argv[2] || "Rain Skylark";
var imagesize = process.argv[3] || 1024;
var eveapi_charname = charname.replace(' ', '+'); 


/* main */
var req = https.get(eveapis.root + eveapis.characterID + eveapi_charname, function(res) {
	res.setEncoding('utf8');
	res.on('data', function(xmlStr){
		var id = kwet.parseCharacterId(xmlStr);
		kwet.wgetPortrait(id, imagesize, charname, './images/');
	});
});