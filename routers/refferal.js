const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/refferal")


Routers.post("/getRefferalData",excelControllers.getRefferalData2);


module.exports= Routers;