let arr = [1, 2, 3, 4, 5, 6, 9, 7, 8, 9, 10];

let used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);

var os = require('os'); 
console.log(os.freemem());
 console.log(os.totalmem());