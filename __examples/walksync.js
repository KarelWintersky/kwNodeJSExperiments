// рекурсивный обход каталога
// возвращает структуру со вложенными массивами (каждый массив - подкаталог)
// к плоскому виду приводится через  [].concat.apply([], walkSync( args.path ))
"use strict"

const fs = require('fs');
const path = require('path');
const walkSync = (d) => fs.statSync(d).isDirectory() ? fs.readdirSync(d).map(f => walkSync(path.join(d, f))) : d;

var flatten_array = function(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten_array(toFlatten) : toFlatten);
    }, []);
};

var filepath = process.argv[2];

var list = flatten_array( walkSync(filepath) );

list.forEach( function(line) {
    console.log(line);
});