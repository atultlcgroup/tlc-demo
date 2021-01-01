

var axios = require('axios');
var data = JSON.stringify({"reservationId":"235732327"});

var config = {
  method: 'post',
  url: 'https://tlc-demo.herokuapp.com/api/UPL/url',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});
