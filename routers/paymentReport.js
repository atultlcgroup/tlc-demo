let express = require("express")
let Router = express.Router();
let paymentReport = require('../controllers/paymentReport');
const cron = require("node-cron");


Router.post("/report",paymentReport.paymentReport)
Router.get("/getPaymentDeta",paymentReport.getPaymentData);
Router.post("/insertUpdateLog",paymentReport.insertUpdateLog);
module.exports = Router;