let DRRModel = require('../models/DRReport')

let DRReport = async(req,res)=>{
    try{
        let DRReport =await DRRModel.DRReport(req,res)
        res.status(200).send({code :200 , message:'Success',data: DRReport})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    DRReport
}