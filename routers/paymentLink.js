const express = require("express");
const Routers = express.Router();
const paymentController = require("../controllers/paymentLink")

Routers.get("/url",paymentController.getPaymentLink)
module.exports= Routers;