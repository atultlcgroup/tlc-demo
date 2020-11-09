let FRModel = require('../models/FReport')

let FReport = async(req,res)=>{
    try{
        let DRRData =FRModel.FReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    FReport
}