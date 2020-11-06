const express = require("express");
const Routers = express.Router();
const UTRControllers = require("../controllers/UTRReport")
Routers.post("/report", UTRControllers.UTRReport);
module.exports= Routers;