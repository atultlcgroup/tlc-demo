const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/pos")

Routers.post("/POS1",excelControllers.uploadExcel);

Routers.post("/POS2",excelControllers.getPosData);


module.exports= Routers;