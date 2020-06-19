const express = require("express");
const port = require("./config").ENV_OBJ.PORT;
const posRouters= require("./routers/posCheque")
const excelRouters = require("./routers/pos")
const body_parser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(body_parser.urlencoded({extended:false}))
app.use(body_parser.json());
app.use("/api",posRouters)
app.use("/api/pos",excelRouters)
app.use("/",(req,res)=>{
    res.status(200).send("SUCCESS")
})

app.listen( process.env.PORT || port,()=>{
    console.log(`server started at posrt : ${port}`)
})