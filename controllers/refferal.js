
const refferalModel= require("../models/refferal");
const { request } = require("express");





let getRefferalData2=(req,res)=>{
    
   
    console.log('headers',req.headers)
  
    if(!req.body.membershipNumber){
        res.status(401).send({code: 401, message: 'missing membershipNumber'})
        return
    }
    else if(!req.body.referralCode) {
        res.status(401).send({code: 401, message: 'missing referralCode'})
        return
    }
    else if(!req.body.transactionType){
        res.status(401).send({code: 401, message: 'missing transactionType'})
        return
    }else if(!req.headers.memberid){
        res.status(401).send({code: 401, message: 'missing memberId'})
        return
    }else if(!req.headers.programid){
        res.status(401).send({code: 401, message: 'missing programId'})
        return
    }
    
    console.log("by promise getting the data");
    console.log(req.headers)
    refferalModel.getRefferalData2(req.body,req.headers).then(data=>{
        console.log("under the promise",data);  
        console.log(data[0].referral_code__c)
        console.log('requested referralcode',req.body.referralCode);

            
            res.status(200).json({code: 200, message: `Success`,data:data});
    
         
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
    
}



module.exports={
   
    getRefferalData2
}