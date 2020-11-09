 let RRModel = require('../models/RReport')

let RReport = async(req,res)=>{
    try{
        let RRData =RRModel.RReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    RReport
}