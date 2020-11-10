let FRModel = require('../models/FReport')

let FReport = async(req,res)=>{
    try{
        let DRRData =await FRModel.FReport(req,res)

        res.status(200).send({code :200 , message:'Success',data: DRRData})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    FReport
}