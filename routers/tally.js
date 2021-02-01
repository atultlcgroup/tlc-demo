const express = require("express");
const Routers = express.Router();
const TallyControllers = require("../controllers/tally")
Routers.post("/post",TallyControllers.tally);
module.exports= Routers;