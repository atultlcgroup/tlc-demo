const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/pos")

Routers.post("/POS1",excelControllers.uploadExcel);

Routers.post("/POS2",excelControllers.getPosData);

Routers.post("/POS3",excelControllers.getPosLogData)


Routers.post("/GETURL",excelControllers.GETURL)

Routers.post("/getRefferalData",excelControllers.getRefferalData2);


module.exports= Routers;