const express = require("express");
const Routers = express.Router();
const FRControllers = require("../controllers/FReport")
Routers.post("/report",FRControllers.FReport);
module.exports= Routers;