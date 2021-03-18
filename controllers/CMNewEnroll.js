let CMModel = require('../models/CMNewEnroll')
let  dotenv = require('dotenv');

dotenv.config();

let CMReport = async(req,res)=>{
    try{
        console.log(`hiiiii`)
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let CMReport = CMModel.CMReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    CMReport
}