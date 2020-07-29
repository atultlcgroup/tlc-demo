
const refferalModel= require("../models/refferal")



let getRefferalData=async(req,res)=>{   
    let  refferalData={
        membershipNumber:req.body.membershipNumber,
        referralCode:req.body.referralCode,
        membershipTypeId:req.body.membershipTypeId,
        transactionType:req.body.transactionType,
        agent:req.body.agent  || ""
        }
    try{
    console.log("under the refferal");    
        data= refferalModel.getRefferalData(refferalData)  
        res.status(200).json({code:200,message:data});     
    }
    catch(e){
        console.log("error",e)
    }

    
}


let getRefferalData2=(req,res)=>{
   let  refferalData={
    membershipNumber:req.body.membershipNumber,
    referralCode:req.body.referralCode,
    membershipTypeId:req.body.membershipTypeId,
    transactionType:req.body.transactionType,
    agent:req.body.agent  || ""
    }
    if(!refferalData.membershipNumber){
        res.status(401).send({code: 401, message: 'missing membershipNumber'})
        return
    }
    else if(!refferalData.referralCode) {
        res.status(401).send({code: 401, message: 'invalid referralCode'})
        return
    }
    else if(!refferalData.membershipTypeId){
        res.status(401).send({code: 401, message: 'invalid membershipTypeId'})
        return
    }
    else if(!refferalData.transactionType){
        res.status(401).send({code: 401, message: 'invalid transactionType'})
        return
    }
    
    console.log("by promise getting the data");
    refferalModel.getRefferalData2(refferalData).then(data=>{
        console.log("under the promise",data);  
        console.log(data[0].referral_code__c)
        console.log('requested referralcode',refferalData.referralCode);

        
            res.status(200).json({code: 200, message: data});
    
        
    }).catch(err=>{
        res.status(500).json({code: 500, message: 'envalid refferal code'});
    })
    
}



module.exports={
    getRefferalData,
    getRefferalData2
}