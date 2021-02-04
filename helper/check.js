// const { reduce } = require("bluebird");

// let arr = [2 , 3 , 1, 4,5,7, 8, 9]

// let res = arr.map(d=> {
//   if(d> 3)
//   return d
// })
// console.log(res)
// let res2 =[];

// arr.forEach(d=>{
//   res2.push(d)
// })
// console.log(res2)

// let res3 = arr.filter(checkPrime)
// console.log("res3",res3)

// let res4 = arr.reduce((d , e)=> d+e)
// console.log(res4)

// function checkPrime(number){
//    let isPrime = true;

//   // check if number is equal to 1
//   if (number === 1) {
//       return ""
//   }
  
//   // check if number is greater than 1
//   else if (number > 1) {
  
//       // looping through 2 to number-1
//       for (let i = 2; i < number; i++) {
//           if (number % i == 0) {
//               isPrime = false;
//               break;
//           }
//       }
  
//       if (isPrime) {
//           return number
//       } else {
//         return ``
//       }
//   }
  
//   // check if number is less than 1
//   else {
//       return ""
//   }}

//   function numberOfPrimeNumber(n){
//     console.log("Prime numbers are")
//     let listPrime=[]
//     for(i =1; i<=n; i++){
//       console.log(checkPrime(i))

//     }

//   }

//   numberOfPrimeNumber(5);
  

let cooking=()=>{
  setTimeout(console.log("Cooking is going on"),4000)

}
let serveing=()=>{
  setTimeout(console.log("Serving is going on"),3000)
}
let eating=()=>{
  setTimeout(console.log("eating is going on"),4000)
}

cooking();
serveing();
eating()