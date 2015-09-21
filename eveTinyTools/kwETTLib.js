// kwEveTools
// ----------
/* 
# Required:
npm install mfx-wget
npm install colors

*/

module.exports = {
	eveapis : {
		'root'		: 'https://api.eveonline.com',
		'characterID' 	: '/eve/CharacterID.xml.aspx?names=',
		'serverStatus'	: '/server/ServerStatus.xml.aspx',
		'accountStatus' : '/account/AccountStatus.xml.aspx'
	},

	loadJSONFile : function (filename, encoding) {
		var fs = require('fs');
		try {
			if (typeof (encoding) == 'undefined') encoding = 'utf8';
			var contents = fs.readFileSync(filename, encoding);
			return JSON.parse(contents);
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

	getAccountStatus : function(key, vcode) {

	}

};