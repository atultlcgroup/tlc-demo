const express = require("express");
const port = require("./config").ENV_OBJ.PORT;
const posRouters= require("./routers/posCheque")
const body_paarser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(body_paarser());
app.use("/api",posRouters)
app.use("/",(req,res)=>{
    res.status(200).send("SUCCESS")
})

app.listen( process.env.PORT || port,()=>{
    console.log(`server started at posrt : ${port}`)
})