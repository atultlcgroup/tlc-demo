const express = require("express");
const Routers = express.Router();
const DBToDBMigration = require("../controllers/DBToDBMigration")
Routers.post("/DBToDBMigration",DBToDBMigration.DBToDBMigration);
module.exports= Routers;