let DSRModel = require('../models/DSRReport')
let  dotenv = require('dotenv');

dotenv.config();

let DSRReport = async(req,res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let DSRData =DSRModel.DSRReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    DSRReport
}