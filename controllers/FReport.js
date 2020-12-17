let FRModel = require('../models/FReport')
let  dotenv = require('dotenv');

dotenv.config();

let FReport = async(req,res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let DRRData =await FRModel.FReport(req,res)

        res.status(200).send({code :200 , message:'Success',data: DRRData})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    FReport
}