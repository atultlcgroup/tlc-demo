var request = require("request");
const fs = require("fs")
var options = { method: 'GET',
   encoding: null,
  url: 'https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/0681y000000PkNXAA0/VersionData',
  headers: 
   { 'postman-token': '415fe161-03f9-0381-1c3d-a7df352568af',
     'cache-control': 'no-cache',
     authorization: 'Bearer 00D1y0000008obX!ARAAQEu6Ruj64af9hYp72BOVUm88Tav7hJrBPGkOzXVBg9fJRWX7BAnL.Q3j5okYGhHoougfpMdL0w95lOYg6yNIlqnMkHKE' } };

request(options, function (error, response, body) {
    // let decodedBase64 = base64.base64Decode(body.toString('base64'), 'test.pdf');
    fs.writeFileSync('tes1t.pdf',body.toString('base64'),{encoding:'base64'} )

    
  if (error) throw new Error(error);

});