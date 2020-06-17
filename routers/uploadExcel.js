const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/uploadExcel")

Routers.post("/uploadExcel",excelControllers.uploadExcel)
module.exports= Routers;