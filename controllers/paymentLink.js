let getPaymentLink = async(req, res)=>{
    try{
    console.log(`uploadExcel api called in controller`)
    if(!req.query.uid){
        res.status(401).send({code: 401, message: 'Please provide UId'})
        return
    }
    let str = req.url
      let uid = str.substr(str.indexOf('uid=') + 4)
      console.log(uid)
        let paymentUrl = process.env.PAYMENT_LINK || ""
        res.status(200).send({code:200 , message : `Success`,paymentURL:  `${paymentUrl}${uid}`})
        
 
   }catch( e ){
       res.status(500).send({code:500 , message : `${e}`})
   }
}

module.exports={
    getPaymentLink
}
