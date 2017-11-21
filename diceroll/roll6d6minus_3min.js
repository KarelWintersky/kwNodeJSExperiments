var logstr = '';
var sides = 6; 		// sides of dice
var dices = 6; 		// dices number
var max_roll = 18; 	// maximum roll on dices
var statcount = 1000000; // stats count 

// http://stackoverflow.com/a/9547981/5127037
zeroFilledArray = function(size) {
    return new Array(size + 1).join('0').split('').map(Number);
}

// used max_roll + 1 because first index of Array(18) unused. Our array must be one element larger
// it will be real max_roll index, elsether in last element will be NaN. 
var stats = zeroFilledArray(max_roll + 1); 

Roll6d6minus_3lesser = function() {
	var arr = [
		Math.floor ( Math.random() * sides + 1),
		Math.floor ( Math.random() * sides + 1),
		Math.floor ( Math.random() * sides + 1),
		Math.floor ( Math.random() * sides + 1),
		Math.floor ( Math.random() * sides + 1),
                Math.floor ( Math.random() * sides + 1)
	];
	return arr.sort().slice(-3).reduce(function add(pv, cv) { return pv + cv; }, 0);
}

for (var i = 1; i<=statcount; i++) {
    rolled = Roll6d6minus_3lesser();
	stats[ rolled ]++;
}

console.log('Rolled ' + statcount + ' times: ');
// print results 
for (var i = 1; i<=18; i++) {
    logstr = '[ ';
    logstr += ( 100 * stats[i] / statcount  ).toFixed(3);
    logstr += ' ]';
    console.log(i + ' <== ' + logstr);
}

