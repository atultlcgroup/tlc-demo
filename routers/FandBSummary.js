const express = require("express");
const Routers = express.Router();
const summaryControllers = require("../controllers/FandBSummary")
Routers.post("/report",summaryControllers.FandBSummaryReport);
module.exports= Routers;