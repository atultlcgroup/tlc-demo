

const express = require("express");
let  dotenv = require('dotenv');

dotenv.config();
const scheduler = require('./helper/scheduler');
const port = process.env.PORT;
const posRouters= require("./routers/posCheque");

let paymentReport = require("./routers/paymentReport")
const DSRReport = require("./routers/DSRReport")
const UTRReport = require("./routers/UTRReport")
const DRReport = require("./routers/DRReport")
const FReport = require("./routers/FReport")
const RReport = require("./routers/RReport")

const helmet = require('helmet')


const reservationRouters= require("./routers/reservation");
const paymentRouters= require("./routers/paymentLink");
const memberSpentPOS=require("./routers/memberSpentForPOS")

const excelRouters = require("./routers/pos");
const body_parser = require("body-parser");
const FandBSummary = require("./routers/FandBSummary")
const referralRouters = require("./routers/referral");
const whatsAppRouters=require("./routers/whatsAppOtp")

const cors = require("cors");
const app = express();
app.use(cors());
app.use(body_parser.urlencoded({limit: "50mb", extended: false}))
app.use(body_parser.json({limit: '50mb'}));
// app.use(body_parser.json());
app.use(helmet())
app.use("/api",posRouters)
app.use("/api/pos",excelRouters)
app.use("/api/feedback",reservationRouters)
app.use("/api/paymentLink",paymentRouters)
app.use("/api/referral",referralRouters);
 app.use("/api/whatsapp",whatsAppRouters);
app.use("/api/FandBSummary",FandBSummary);
app.use("/api/payment",paymentReport);


app.use("/api/payment",paymentReport)
app.use("/api/DSR",DSRReport);
app.use("/api/MemberSpend",memberSpentPOS)

app.use("/api/UTR",UTRReport)
app.use("/api/DRR",DRReport)
app.use("/api/FR",FReport)
app.use("/api/RR",RReport)
app.use("/api/MemberSpend",memberSpentPOS)



// app.use("/")
// const check = require("./check")
// app.post("/sendMsg",check.sendMsg)
 app.use("/api/whatsapp",whatsAppRouters)
app.use("/",(req,res)=>{
    res.status(200).send("SUCCESS")
})

app.listen( process.env.PORT || port,()=>{
    console.log(`server started at port : ${port}`)
})