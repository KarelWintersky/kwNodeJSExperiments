var https = require("https");
var fs = require('fs');
var wget = require('mfx-wget');
var colors = require('colors/safe');
var xmlobj = require('nodexml');

const kwet = require('./kwETT/kwETTLib');

var eveapi_urls = kwet.eveapi_urls;

var req = https.get(eveapi_urls.root + eveapi_urls.serverStatus, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (xmlStr) {
        var stat = kwet.parseServerStatus(xmlStr);

        var serverOpen = stat.serverOpen ? 'online' : 'offline';
        var online = stat.onlinePlayers;

        console.log('EVE Server is ' + colors.yellow.bold(serverOpen) + ', players online: ' +
            colors.yellow.bold(online));

    });
});