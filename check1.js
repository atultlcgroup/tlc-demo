var request = require("request");
const btoa = require("btoa")
const fs = require("fs")
var options = { method: 'GET',
  url: 'https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/0681y000000PkNXAA0/VersionData',
  headers: 
   { 'postman-token': '415fe161-03f9-0381-1c3d-a7df352568af',
     'cache-control': 'no-cache',
     authorization: 'Bearer 00D1y0000008obX!ARAAQEu6Ruj64af9hYp72BOVUm88Tav7hJrBPGkOzXVBg9fJRWX7BAnL.Q3j5okYGhHoougfpMdL0w95lOYg6yNIlqnMkHKE' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
//   console.log(body);
// let buff = new Buffer(body, 'base64'); let text = buff.toString('ascii'); 
// console.log(text)
const contents = fs.writeFileSync('DSRBatchFile1.pdf',body);
// console.log(contents)
// fs.writeFileSync(`DSRBatchFile1.pdf`, contents,{encoding: 'base64'})// let data = 'stackabuse.com';
// let buff = new Buffer(data);
// console.log(buff)
// let base64data = buff.toString('base64');
// console.log(base64data)
//   const fs = require("fs");
//      fs.writeFileSync('abcd.pdf', base64data);
});





