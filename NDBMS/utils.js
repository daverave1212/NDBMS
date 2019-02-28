
const ReadLine = require('readline')

const rl = ReadLine.createInterface({
  input: process.stdin,
  output: process.stdout
});


var scan = function(callback){
	rl.question('> ', answer => {
		callback(answer);
	});
}

module.exports.scan = scan;