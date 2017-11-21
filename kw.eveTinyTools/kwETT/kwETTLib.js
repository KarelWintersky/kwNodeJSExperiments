// kwEveTools
// ----------
/* 
# Required:
npm install mfx-wget
npm install colors

*/

module.exports = {
	eveapi_urls : {
		'root'		: 'https://api.eveonline.com',
		'characterID' 	: '/eve/CharacterID.xml.aspx?names=',
		'characters'	: '/account/Characters.xml.aspx',
		'serverStatus'	: '/server/ServerStatus.xml.aspx',
		'accountStatus' : '/account/AccountStatus.xml.aspx'
	},

	loadJSONFile : function (filename, encoding) {
		var fs = require('fs');
		try {
			if (typeof (encoding) == 'undefined') encoding = 'utf8';
			return JSON.parse( fs.readFileSync(filename, encoding) );
		} catch (err) {
			throw err;	
		}
	}, 

	wgetPortrait : function (id, size, charname, targetdir) {
		var wget 	= require('mfx-wget');
		var colors  = require('colors/safe');

		var tdir = targetdir || "./";
		var req_filename = id + "_" + size + ".jpg";
		var dst =  charname.replace('+', '_') + ' -- ' + size + '.jpg';
		var src = "https://image.eveonline.com/Character/" + req_filename;
		wget.download(src, tdir + dst, {});
		console.log('File ' + colors.yellow.bold(dst) + ' downloaded.');
	},

	parseCharacterId : function (xmlString) {
		var xmlobj 	= require('nodexml').xml2obj(xmlString);
		
		return xmlobj.eveapi.result.rowset.row.characterID;
	},

	parseServerStatus : function(xmlString) {
		var xmlobj 	= require('nodexml').xml2obj(xmlString);
		return xmlobj.eveapi.result;
	},

	getAccountStatus : function(charname, key, vcode) {
        const https     = require("https");
        const colors    = require('colors/safe');
        const xmlobj 	= require('nodexml');

		var status = '';
        var url = this.eveapi_urls.root + this.eveapi_urls.accountStatus + '?keyID=' + key + '&vCode=' + vcode;

        var req = https.get(url, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (xmlStr) {
                var obj = xmlobj.xml2obj(xmlStr);

                if (obj.eveapi.result) {
                    var paid_date_as_string = obj.eveapi.result.paidUntil;
                    var paid_date_as_mss = new Date(paid_date_as_string).getTime();

                    if ( Date.now() < paid_date_as_mss) {
                        status = colors.yellow.bold(charname) + ' paid until ' + colors.green.bold(paid_date_as_string);
                    } else {
                        status = colors.yellow.bold(charname) + colors.red.bold(' expired! ');
                    }
                } else {
                    status = require('colors/safe').yellow.bold(charname) + ' Auth error: ' + obj.eveapi.error.code;
                }
                console.log(status);
            });
        });
        // req.end();
	},

	getCharacterName : function( keyid, vcode ) {
		var url = this.eveapi_urls.root + this.eveapi_urls.characters + '?keyID=' + apikey + '&vCode=' + vcode;
		var xmlString = request('GET', url).body.toString('utf-8');
		var obj = xmlobj.xml2obj(xmlString);
		return 	obj.eveapi.result.rowset.row.name;
	}

};