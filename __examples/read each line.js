var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('get-dir-data.js')
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);
});