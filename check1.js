var request = require("request");

var options = { method: 'GET',
  url: 'https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/0681y000000PkNXAA0/VersionData',
  headers: 
   { 'postman-token': 'f0e2d752-4a30-006b-ae27-127092943dd1',
     'cache-control': 'no-cache',
     authorization: 'Bearer 00D1y0000008obX!ARAAQGtwhkpbEaBykXGiJrolJMFCWsh83kbvC04fxqheX9g0WX.dWBZ8UOi.XVV7B23trhz7Q1asIauqlfFhqNeqxSbW6zVn' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
