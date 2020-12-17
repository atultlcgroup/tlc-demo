let paymentModel = require("../models/paymentReport")
let  dotenv = require('dotenv');

dotenv.config();

let paymentReport = (req , res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        if(!req.body.hotel || !req.body.name || !req.body.membership_number || !req.body.membership_type || !req.body.email|| !req.body.amount || !req.body.transaction_code || !req.body.date_time || !req.body.payment_mode  || !req.body.source){
            res.status(401).json({code : 401 , message : `Invalid Inputs`})
            return ;
        }
        if(!req.body.property_sfid && !req.body.customer_set_sfid){
            res.status(401).json({code : 401 , message : `Please provide either property_sfid or customer_set_sfid`})
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


let reportForEODandEOM=(req,res)=>{ 
    if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
        res.status(401).send({code: 401, message: 'Invalid Token'})
        return
    }
    req.body.type =req.body.type || 'EOD';
    if(!req.body.property_sfid && !req.body.customer_set_sfid){
        res.status(401).json({code : 401 , message : `Please provide either property_sfid or customer_set_sfid`})
        return ;  
    }
    paymentModel.reportForEODandEOM(req.body).then(data=>{
            res.status(200).json({code: 200, message: data});
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
}

let insertUpdateLog=(req,res)=>{  
    let type =req.query.type || 'EOD';

          
    paymentModel.getPaymentDetailsData(type).then(data=>{
            res.status(200).json({code: 200, message: data});
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
}



module.exports={
    paymentReport,
    reportForEODandEOM
}