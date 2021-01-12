var axios = require('axios');
var qs = require('qs');
var request = require("request");
const fs = require("fs")
const base64 = require('base64topdf');
var data = qs.stringify({
 'Authorization': 'Bearer 00D1y0000008obX!ARAAQFJKLT_x8AEJ8rZBTSnaFgfumSKMzeJLm_k0TuIxKDT0m30hXENWdHKXvYNb5lSrtFt9nH09A1NlZNQitE5ubM0O4Nmn' 
});
var options = { method: 'GET',
   encoding: null,
  url: 'https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/0681y000000PkNXAA0/VersionData',
  headers: 
   { 'postman-token': '415fe161-03f9-0381-1c3d-a7df352568af',
     'cache-control': 'no-cache',
     authorization: 'Bearer 00D1y0000008obX!ARAAQFJKLT_x8AEJ8rZBTSnaFgfumSKMzeJLm_k0TuIxKDT0m30hXENWdHKXvYNb5lSrtFt9nH09A1NlZNQitE5ubM0O4Nmn' } };



     axios(options)
     .then(function (response) {
       
        console.log(typeof response)
        console.log(response)
       //console.log(response.toString('base64'));
     })
     .catch(function (error) {
       console.log(error);
     });
