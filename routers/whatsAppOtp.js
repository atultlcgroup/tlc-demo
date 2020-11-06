
const express = require("express");
const Routers = express.Router();
const excelControllers = require("../controllers/sendWhatsAppOtp")
 Routers.post("/sentOtpOnWhatsapp",excelControllers.sendMsg);
module.exports= Routers;
