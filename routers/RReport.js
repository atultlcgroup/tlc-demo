const express = require("express");
const Routers = express.Router();
const RRControllers = require("../controllers/RReport")
Routers.post("/report",RRControllers.RReport);
module.exports= Routers;