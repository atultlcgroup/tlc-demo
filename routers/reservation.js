const express = require("express");
const Routers = express.Router();
const reservationControllers = require("../controllers/reservation")

Routers.post("/url",reservationControllers.getFeedbackUrl)
module.exports= Routers;