var filepath = process.argv[2];

var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(filepath)
});

lineReader.on('line', function (line) {
    console.log('Line from file:', line);
});