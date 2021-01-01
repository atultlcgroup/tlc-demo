const express = require("express");
const Routers = express.Router();
const UPLControllers = require("../controllers/updateProfileLinkURL")

Routers.post("/url",UPLControllers.getUPLUrl)
module.exports= Routers;