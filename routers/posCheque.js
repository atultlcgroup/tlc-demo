const express = require("express");
const Routers = express.Router();
const posControllers = require("../controllers/posCheque")

Routers.get("/getPosCheque",posControllers.getPosCheque)
module.exports= Routers;