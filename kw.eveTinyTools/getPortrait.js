var https = require("https");

const kwet = require('./kwETT/kwETTLib');
var eveapi_urls = kwet.eveapi_urls;

/* args */
var charname = process.argv[2] || "Rain Skylark";
var imagesize = process.argv[3] || 1024;
var eveapi_charname = charname.replace(' ', '+');


/* main */
var req = https.get(eveapi_urls.root + eveapi_urls.characterID + eveapi_charname, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (xmlStr) {
        var id = kwet.parseCharacterId(xmlStr);
        kwet.wgetPortrait(id, imagesize, charname, './images/');
    });
});