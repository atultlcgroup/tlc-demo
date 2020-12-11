
const express = require("express");
const Routers = express.Router();
const memberSpentForPOS = require("../controllers/memberSpentForPOS")

Routers.post("/memberSpentForPOS",memberSpentForPOS.getPosMembersData);

module.exports= Routers;