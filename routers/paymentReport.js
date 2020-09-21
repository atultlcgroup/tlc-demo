let express = require("express")
let Router = express.Router();
let paymentReport = require('../controllers/paymentReport')
Router.post("/report",paymentReport.paymentReport)
module.exports = Router;