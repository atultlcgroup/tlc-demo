const pool = require("../databases/db").pool
let createOffers=(benefit_id,membership_number,member_type)=>{
    return new Promise(async(resolve,reject)=>{
        try{

        }catch(e){
            reject(`${e}`)
        }
    })
}
let offerApplicableFor=async(menubar_type, referral_code, membership_number)=>{
    return new Promise(async (reject,resolve)=>{
        try{
          if(menubar_type.toLocaleLowerCase() == `receiver`)
          reject(membership_number)
          if(menubar_type.toLocaleLowerCase() == `referrer`){
              
          }
          reject(`Invalid member type`)
        }catch(e){
            reject(`${e}`)
        }
    })
}

let getRefferalData2=  (data,header)=>{
    console.log('refferalData',data,header);
    return new Promise(async(resolve,reject)=>{
        try{
            console.log('pool',pool)
           console.log(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}'`) 
           
           let result= await pool.query(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}'`)
           let validateResult=result ? result.rows : [];
           console.log("under the resolve promise",validateResult,data,header);

             if(validateResult.length == 0){
                 reject(`Referral code not valid!`)
             }
        let finalResultOfJoinBenefitAndProgarm=await fetchReferralProgramAndRefferalBenefits(data,header)
        if(finalResultOfJoinBenefitAndProgarm.length == 0){
            reject(`Transaction type or programId not valid`)
            return
        }


        for(d of finalResultOfJoinBenefitAndProgarm){
            createOffers(d.benefit__c, d.member_type__c, )
        }
          //added into conversion
          
        //   console.log(`INSERT INTO tlcsalesforce.referral_conversion__c(
        //     counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c,isdeleted)
        //     VALUES ('${validateResult[0].member_id__c}','${finalResultOfJoinBenefitAndProgarm[0].sfid2}', '${finalResultOfJoinBenefitAndProgarm[0].member_type__c}', now(),'${header.memberid}', '${finalResultOfJoinBenefitAndProgarm[0].transaction_type__c}', '${finalResultOfJoinBenefitAndProgarm[0].sfid2}', now(), '${data.agent}','${finalResultOfJoinBenefitAndProgarm[0].isdeleted}')`)
          
        //     let pushIntoRefferlConersion=await pool.query(`INSERT INTO tlcsalesforce.referral_conversion__c(
        //     counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c,isdeleted)
        //     VALUES ('${validateResult[0].member_id__c}','${finalResultOfJoinBenefitAndProgarm[0].sfid2}', '${finalResultOfJoinBenefitAndProgarm[0].member_type__c}', now(),'${header.memberid}', '${finalResultOfJoinBenefitAndProgarm[0].transaction_type__c}', '${finalResultOfJoinBenefitAndProgarm[0].sfid2}', now(), '${data.agent}','${finalResultOfJoinBenefitAndProgarm[0].isdeleted}')`);


           resolve(validateResult)

        }catch(err){
            console.log("under the promise reject");
            console.log(`${err}`);
            reject("promise reject");

        }
    })
}



let fetchReferralProgramAndRefferalBenefits=async(data,header)=>{
    try{
        console.log("join");
    console.log(`select p1.name,transaction_type__c,end_date__c,start_date__c,program__r__unique_identifier__c,p1.sfid,p2.isdeleted,benefit__c,member_type__c,p2.sfid from tlcsalesforce.referral_program__c p1 inner join tlcsalesforce.referral_benefits__C p2 on p1.sfid=p2.referral_program__c where p1.transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}'`)
    let resultOfJoinBenefitAndProgarm=await pool.query(`select p1.name,transaction_type__c,end_date__c,start_date__c,program__r__unique_identifier__c,p1.sfid sfid1,p2.isdeleted,benefit__c,member_type__c,p2.sfid sfid2 from tlcsalesforce.referral_program__c p1 inner join tlcsalesforce.referral_benefits__C p2 on p1.sfid=p2.referral_program__c where p1.transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}' and p1.start_date__c::date <= NOW()::date and end_date__c >= NOW()::date`);
    let finalResultOfJoinBenefitAndProgarm=resultOfJoinBenefitAndProgarm ? resultOfJoinBenefitAndProgarm.rows : [];
    console.log(finalResultOfJoinBenefitAndProgarm);
    return finalResultOfJoinBenefitAndProgarm
    }catch(e){
        return e
    }
    

}


module.exports = {
    getRefferalData2

}