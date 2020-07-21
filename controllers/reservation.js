const reservationModel = require("../models/reservation")

let getFeedbackUrl = async(req, res)=>{
    try{
    console.log(`uploadExcel api called in controller`)
    if(!req.body.reservationId){
        res.status(401).send({code: 401, message: 'Please provide reservationId'})
        return
    }
    reservationModel.getFeedbackUrl(req.body.reservationId).then(data=>{
        res.status(200).send({code:200 , message : `Success`,appUrl:  `${data}`})

    }).catch(err=>{
        res.status(500).send({code:500 , message : `${err}`})
    })

   }catch( e ){
       res.status(500).send({code:500 , message : `${e}`})
   }
}

module.exports={
    getFeedbackUrl
}
