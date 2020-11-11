const express = require("express");
const Routers = express.Router();
const DRRControllers = require("../controllers/DRReport")
Routers.post("/report",DRRControllers.DRReport);
module.exports= Routers;