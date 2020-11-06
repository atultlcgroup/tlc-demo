const express = require("express")
const Routers = express.Router();
const paymentReport = require('../controllers/paymentReport')

Routers.post("/report",paymentReport.paymentReport)
Routers.post("/reportForEODandEOM",paymentReport.reportForEODandEOM)
module.exports = Routers;