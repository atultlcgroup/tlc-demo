let paymentModel = require("../models/paymentReport")
const cron = require("node-cron");

let paymentReport = (req , res)=>{
    try{
        if(!req.body.hotel || !req.body.name || !req.body.membership_number || !req.body.membership_type || !req.body.email|| !req.body.amount || !req.body.transaction_code || !req.body.date_time || !req.body.payment_mode  || !req.body.source){
            res.status(401).json({code : 401 , message : `Invalid Inputs`})
            return ;
        }
        if(!req.body.propertySFID && !req.body.customer_setSFID){
            res.status(401).json({code : 401 , message : `Please provide either propertySFID or customer_setSFID`})
            return ;  
        }
        paymentModel.paymentReport(req.body).then(data=>{
            res.status(200).send({code : 200 , message : 'SUCCESS', data : data})
        }).catch((err)=>{
            res.status(500).send({code : 500 , message : err})
        })
    }catch( e ){
        res.status(500).json({code : 500 , message : e})
    }
}

let getPaymentData=(req,res)=>{  
    cron.schedule("* * * * *", function() {
        console.log("running a task every minute controller");
        paymentModel.getPaymentDetailsData().then(data=>{
            res.status(200).json({code: 200, message: data});
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
      });
    
   
    
}




module.exports={
    paymentReport,
    getPaymentData
}