const express = require("express");
const Routers = express.Router();
const paymentController = require("../controllers/paymentLink")

Routers.post("/url",paymentController.getPaymentLink)
module.exports= Routers;