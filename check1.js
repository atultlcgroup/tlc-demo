var request = require("request");
const fs = require("fs")
var options = {
  method: 'GET',
  encoding: null,
  url: 'https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/0681y000000PkNXAA0/VersionData',
  headers: 
   { 'postman-token': '415fe161-03f9-0381-1c3d-a7df352568af',
     'cache-control': 'no-cache',
     authorization  : 'Bearer 00D1y0000008obX!ARAAQFJKLT_x8AEJ8rZBTSnaFgfumSKMzeJLm_k0TuIxKDT0m30hXENWdHKXvYNb5lSrtFt9nH09A1NlZNQitE5ubM0O4Nmn' } 
    };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  // console.log(response)
  try{
    console.log(JSON.parse(body.toString()))

  }catch(e){
    fs.writeFileSync('newDSR1122.pdf' , body.toString('base64'), {encoding:'base64'});
  }

});