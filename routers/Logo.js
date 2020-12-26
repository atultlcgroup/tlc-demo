const express = require("express");
const Routers = express.Router();
const LogoControllers = require("../controllers/Logo")
Routers.post("/uploadLogo",LogoControllers.uploadLogo);
module.exports= Routers;