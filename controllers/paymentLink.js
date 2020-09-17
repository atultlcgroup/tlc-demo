const url = require('url');
let getPaymentLink = async(req, res)=>{
    try{
    console.log(`uploadExcel api called in controller`)
    if(!req.query.uid){
        res.status(401).send({code: 401, message: 'Please provide UId'})
        return
    }
  
    const queryObject = url.parse(req.url,true).search
   let uid = queryObject.split('uid=')[1] || "";
        let paymentUrl = process.env.PAYMENT_LINK || ""
        res.status(200).send({code:200 , message : `Success`,paymentURL:  `${paymentUrl}${uid}`})
        
 
   }catch( e ){
       res.status(500).send({code:500 , message : `${e}`})
   }
}

module.exports={
    getPaymentLink
}
