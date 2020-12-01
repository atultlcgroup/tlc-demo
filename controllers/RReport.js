 let RRModel = require('../models/RReport')

let RReport = async(req,res)=>{
    try{
        let RRData =await RRModel.RReport(req,res)
        res.status(200).send({code :200 , message:'Success',data: RRData})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    RReport
}