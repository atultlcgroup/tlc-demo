
const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/referral")
Routers.post("/attachReferralOffer",excelControllers.getRefferalData2);
module.exports= Routers;
