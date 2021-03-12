const express = require("express");
const Routers = express.Router();
const CMNewENControllers = require("../controllers/CMNewEnroll")
Routers.post("/report",CMNewENControllers.CMReport);
module.exports= Routers;