let DRRModel = require('../models/DRReport')

let DRReport = async(req,res)=>{
    try{
        let DRReport =DRRModel.DRReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    DRReport
}