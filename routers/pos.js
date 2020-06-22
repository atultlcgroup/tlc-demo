const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/pos")

Routers.post("/uploadExcel",excelControllers.uploadExcel);

Routers.put("/getPosData",excelControllers.getPosData);


module.exports= Routers;