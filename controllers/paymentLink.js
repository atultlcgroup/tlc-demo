

let getPaymentLink = async(req, res)=>{
    try{
    console.log(`uploadExcel api called in controller`)
    if(!req.body.uuid){
        res.status(401).send({code: 401, message: 'Please provide UUId'})
        return
    }
        let paymentUrl = process.env.PAYMENT_LINK || ""
        res.status(200).send({code:200 , message : `Success`,paymentURL:  `${paymentUrl}?${req.body.uuid}`})
 
   }catch( e ){
       res.status(500).send({code:500 , message : `${e}`})
   }
}

module.exports={
    getPaymentLink
}
