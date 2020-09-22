const express = require("express");
const Routers = express.Router();
const paymentTriggerControllers = require("../controllers/paymentTrigger")
 Routers.get("/paymentTriger",paymentTriggerControllers.getPaymentData);
module.exports= Routers;
