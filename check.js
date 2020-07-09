// // var start = new Date()
// // var simulateTime = 1000

// // setTimeout(function (argument) {
// //   // execution time simulated with setTimeout function
// //   var end = new Date() - start
// //   console.info('Execution time: %dms', end)
// // }, simulateTime)

// const perf = require('execution-time')(console.log);

//  //at beginning of your code
//   perf.start(); 

//   console.log("hbhbkn")
//   console.log("hbhbkn")
  
//  perf.stop();

console.time("dbsave");
var i;

for(let i =0 ;i< 100;i++){
  console.log(`hi`)
}
console.timeEnd("dbsave");