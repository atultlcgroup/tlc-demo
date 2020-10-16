const express = require("express");
const Routers = express.Router();
const DSRControllers = require("../controllers/DSRReport")
Routers.post("/report",DSRControllers.DSRReport);
module.exports= Routers;