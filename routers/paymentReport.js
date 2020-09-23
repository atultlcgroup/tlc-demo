let express = require("express")
let Router = express.Router();
let paymentReport = require('../controllers/paymentReport')
Router.post("/report",paymentReport.paymentReport)
Router.get("/getPaymentDeta",paymentReport.getPaymentData)
module.exports = Router;