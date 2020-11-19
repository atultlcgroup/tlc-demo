let today = new Date();
today.setDate(today.getDate() - 1); 
console.log(today)
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
console.log(today)

// JavaScript program to illustrate 
// calculation of yesterday's date 

// create a date object using Date constructor 
var dateObj = new Date(); 

// subtract one day from current time						 
dateObj.setDate(dateObj.getDate() - 1); 

console.log(dateObj); 

