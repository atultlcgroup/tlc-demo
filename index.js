const express = require("express");
// const scheduler = require('./helper/scheduler');
const port = process.env.PORT;
const posRouters= require("./routers/posCheque");
const reservationRouters= require("./routers/reservation");
const excelRouters = require("./routers/pos");
const body_parser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(body_parser.urlencoded({limit: "50mb", extended: true}))
app.use(body_parser.json({limit: '50mb'}));
app.use("/api",posRouters)
app.use("/api/pos",excelRouters)
app.use("/api/feedback",reservationRouters)
app.use("/",(req,res)=>{
    res.status(200).send("SUCCESS")
})

app.listen( process.env.PORT || port,()=>{
    console.log(`server started at posrt : ${port}`)
})