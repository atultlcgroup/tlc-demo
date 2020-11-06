let DSRModel = require('../models/DSRReport')

let DSRReport = async(req,res)=>{
    try{
        let DSRData =DSRModel.DSRReport(req,res)
        res.status(200).send({code :200 , message:'Success'})

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    DSRReport
}