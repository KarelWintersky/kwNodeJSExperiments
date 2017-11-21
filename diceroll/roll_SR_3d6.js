var default_sides = 6;
var rolled = 0;
var logstr = '';

var dicecount
    = (typeof process.argv[2] == 'undefined')
    ? 1
    : process.argv[2];

RollDice = function(sides) {
    var sides = sides || default_sides;
    return Math.floor( Math.random() * sides + 1);
}

Rolld6 = function() {
    return Math.floor ( Math.random() * 6 + 1);
}

RollSRDice = function() {
    var d = Rolld6();
    logstr += ' ' + d + ' ';

    if (d==6) {
        return 1 + RollSRDice()
    } else if (d==5) {
        return 1;
    } else {
        return 0;
    }
}

/* for (var i = 1; i<30; i++) {
    logstr = '[ ';
    rolled = RollSRDice();
    logstr += ' ]';
    console.log(rolled + ' <== ' + logstr);
}   */

var sum = 0;
for (var i = 1; i<= dicecount; i++) {
    sum += RollSRDice();
}

console.log('Rolled ' + dicecount + ' dices, total result is ' + sum);
// console.log('Average is : ', Math.floor(sum / dicecount, 2));