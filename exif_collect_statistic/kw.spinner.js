"use strict"
var readline = require('readline');
var sprintf = require("./kw.sprintf").sprintf;

let defaultSpinnerStringIndex = 0; // by index
let defaultSpinnerDelay = 60;

// вызывается по умолчанию на каждом тике, может быть перекрыто в опциях
function defaultOnTick(msg) {
    this.clearLine(this.stream);
    this.stream.write(msg);
};

var Spinner = function(options){
    if(!(this instanceof Spinner)) return new Spinner(options)

    if(typeof options === "string"){
        options = { text: options };
    } else if(!options){
        options = {};
    }

    this.text = options.text || '';
    this.onTick = options.onTick || defaultOnTick;
    this.stream = options.stream || process.stdout;
    this.chars = "|/-\\".split('');

    // old code: set default spinner string by index from spinners.json
    // this.setDefaultSpinnerString(defaultSpinnerStringIndex);

    this.current_step = 0;
};

Spinner.prototype.tickMessage = function(message) {
    let self = this;

    let msg = sprintf( self.text, self.chars[this.current_step], message)

    self.onTick(msg);
    self.current_step = ++self.current_step % self.chars.length;
    return this;
};

Spinner.prototype.tick = function() {
    let self = this;
    let args = [];
        args.push( self.chars[this.current_step] );
        args.push( Array.from( Object.keys( arguments ), k => arguments[k] ) );

    let msg = sprintf( self.text, [].concat.apply([], args) );

    self.onTick(msg);
    self.current_step = ++self.current_step % self.chars.length;
    return this;
};

Spinner.prototype.start = function() {
    this.current_step = 0;
    return this;
};

Spinner.prototype.isSpinning = function() {
    return this.id !== undefined;
}

Spinner.prototype.setSpinnerString = function(str) {
    this.chars = str.split('');
    return this;
};

Spinner.prototype.setSpinnerTitle = function(str) {
    this.text = str;
    return this;
}

Spinner.prototype.stop = function(clear) {
    this.id = undefined;
    if (clear) {
        this.clearLine(this.stream);
    }
    return this;
};

Spinner.prototype.clearLine = function(stream) {
    readline.clearLine(stream, 0);
    readline.cursorTo(stream, 0);
    return this;
}

/*
Spinner.spinners = [
  "|/-\\",
  "⠂-–—–-",
  "◐◓◑◒",
  "◴◷◶◵",
  "◰◳◲◱",
  "▖▘▝▗",
  "■□▪▫",
  "▌▀▐▄",
  "▉▊▋▌▍▎▏▎▍▌▋▊▉",
  "▁▃▄▅▆▇█▇▆▅▄▃",
  "←↖↑↗→↘↓↙",
  "┤┘┴└├┌┬┐",
  "◢◣◤◥",
  ".oO°Oo.",
  ".oO@*",
  "🌍🌎🌏",
  "◡◡ ⊙⊙ ◠◠",
  "☱☲☴",
  "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏",
  "⠋⠙⠚⠞⠖⠦⠴⠲⠳⠓",
  "⠄⠆⠇⠋⠙⠸⠰⠠⠰⠸⠙⠋⠇⠆",
  "⠋⠙⠚⠒⠂⠂⠒⠲⠴⠦⠖⠒⠐⠐⠒⠓⠋",
  "⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠴⠲⠒⠂⠂⠒⠚⠙⠉⠁",
  "⠈⠉⠋⠓⠒⠐⠐⠒⠖⠦⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈",
  "⠁⠁⠉⠙⠚⠒⠂⠂⠒⠲⠴⠤⠄⠄⠤⠠⠠⠤⠦⠖⠒⠐⠐⠒⠓⠋⠉⠈⠈",
  "⢄⢂⢁⡁⡈⡐⡠",
  "⢹⢺⢼⣸⣇⡧⡗⡏",
  "⣾⣽⣻⢿⡿⣟⣯⣷",
  "⠁⠂⠄⡀⢀⠠⠐⠈",
  "🌑🌒🌓🌔🌕🌝🌖🌗🌘🌚"
];

Spinner.prototype.setSpinnerStringByIndex = function (str) {
    this.chars = mapToSpinner(str, this.spinners).split('');
    return this;
}
*/

// Helpers
function isInt(value) {
    return (typeof value==='number' && (value%1)===0);
}

/*
function mapToSpinner(value, spinners) {
    // Not an integer, return as strng
    if (!isInt(value)) {
        return value + '';
    }

    let length = Spinner.spinners.length;

    // Check if index is within bounds
    value = (value >= length) ? 0 : value;
    // If negative, count from the end
    value = (value < 0) ? length + value : value;

    return Spinner.spinners[value];
}
*/

exports.Spinner = Spinner;


/*
var spinner = new Spinner({
    text: '[%1$s] : %2$s'
});

var spinner = new Spinner({
    text: '[%1$s] : %2$s : (%3$s) '
});

var spinner = new Spinner('[%1$s] : %2$s');
*/


