const express = require("express");
const Routers = express.Router();
const summaryControllers = require("../controllers/FandBSummary")

Routers.post("/FandBSummaryReport",summaryControllers.FandBSummaryReport);



module.exports= Routers;