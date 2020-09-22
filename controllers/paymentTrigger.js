


const paymentTrigger= require("../models/paymentTrigger");

let getPaymentData=(req,res)=>{  
          
    paymentTrigger.getPaymentDetailsData().then(data=>{
            res.status(200).json({code: 200, message: data});
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
    
}



module.exports={
   
    getPaymentData
}
