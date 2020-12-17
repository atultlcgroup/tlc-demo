let DRRModel = require('../models/DRReport')
let  dotenv = require('dotenv');

dotenv.config();

let DRReport = async(req,res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let DRReport =await DRRModel.DRReport(req,res)
        res.status(200).send({code :200 , message:'Success',data: DRReport})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    DRReport
}