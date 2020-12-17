 let RRModel = require('../models/RReport')

let RReport = async(req,res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let RRData =await RRModel.RReport(req,res)
        res.status(200).send({code :200 , message:'Success',data: RRData})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    RReport
}