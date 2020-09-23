let express = require("express")
let Router = express.Router();
let paymentReport = require('../controllers/paymentReport');
const cron = require("node-cron");


Router.post("/report",paymentReport.paymentReport)
cron.schedule("* * * * *", function() {
    console.log("running a task every minute route");
    Router.get("/getPaymentDeta",paymentReport.getPaymentData) 
  });



module.exports = Router;