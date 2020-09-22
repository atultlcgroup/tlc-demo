const express = require("express");
const dotenv = require('dotenv');

dotenv.config();
//const scheduler = require('./helper/scheduler');
const port = process.env.PORT;
const posRouters= require("./routers/posCheque");
const reservationRouters= require("./routers/reservation");
const excelRouters = require("./routers/pos");
const body_parser = require("body-parser");


const referralRouters = require("./routers/referral");
const whatsAppRouters=require("./routers/whatsAppOtp")

const paymentTrigger=require("./routers/paymentTrigger");

const cors = require("cors");
const app = express();
app.use(cors());
app.use(body_parser.urlencoded({limit: "50mb", extended: true}))
app.use(body_parser.json({limit: '50mb'}));
app.use("/api",posRouters)
app.use("/api/pos",excelRouters)
app.use("/api/feedback",reservationRouters)
app.use("/api/referral",referralRouters);
app.use("/api/payment",paymentTrigger);
 app.use("/api/whatsapp",whatsAppRouters);
app.use("/",(req,res)=>{
    res.status(200).send("SUCCESS")
})

app.listen( process.env.PORT || port,()=>{
    console.log(`server started at port : ${port}`)
})