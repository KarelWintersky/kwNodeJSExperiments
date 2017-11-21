const fs = require('fs');
const path = require('path');
const colors = require('colors');

const mkdirSync = function (dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}
const vhost_template = '~vhost-template.conf';
/* ==================================================================== */

if ( process.argv.length < 3 ) {
	console.log(colors.yellow.bold('Use:') + 'node' + colors.yellow.bold(' HTTP-HOST [VHOST-FOLDER] [VHOST-HTDOCS-FOLDER]'));
	return;
}

var vhost = process.argv[2];
var vfolder = process.argv[3] || 'www';

/* Create directories */

mkdirSync( path.resolve('./' + vhost ));
mkdirSync( path.resolve('./' + vhost + '/.logs'));
mkdirSync( path.resolve('./' + vhost + '/' + vfolder));

/* load config */

