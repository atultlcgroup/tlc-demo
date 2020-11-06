


const refferalModel= require("../models/referral");

let getRefferalData2=(req,res)=>{  
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
    }else if(!req.headers.program_id){
        res.status(401).send({code: 401, message: 'missing programId'})
        return
    }else if(!req.body.membershipTypeId){
        res.status(401).send({code: 401, message: 'missing membershipTypeId'})
        return
    }
    refferalModel.getRefferalData2(req.body,req.headers).then(data=>{
            res.status(200).json({code: 200, message: `Success`});
    }).catch(err=>{
        res.status(500).json({code: 500, message: `${err}`});
    })
    
}



module.exports={
   
    getRefferalData2
}
