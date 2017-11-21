"use strict";
const https     = require("https");
const fs 	    = require('fs');
const wget 	    = require('mfx-wget');
const colors    = require('colors/safe');
const xmlobj 	= require('nodexml');
const util      = require('util');

const kwet = require('./kwETT/kwETTLib');
const eveapi_urls = kwet.eveapi_urls;

var accounts = kwet.loadJSONFile('./accounts.json');

Object.keys(accounts).forEach(function(charname) {
    kwet.getAccountStatus(charname, accounts[charname]['keyID'], accounts[charname]['vCode']);
});


