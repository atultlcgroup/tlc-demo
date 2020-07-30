const { writeFileSync } = require("fs");
const pool = require("../databases/db").pool
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const { resolve } = require("path");




let getRefferalData=async(data)=>{
    console.log("under the refferal 2")
    console.log(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 left join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p2.membership_number__C='${data.membershipNumber}'`) 
    let result= await pool.query(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 left join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p2.membership_number__C='${data.membershipNumber}'`)
                
    return result

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

          
           console.log('transaction Type',data.transactionType)
           console.log(`select name,transaction_type__c,end_date__c,start_date__c,program__c,program__r__unique_identifier__c from tlcsalesforce.referral_program__c where transaction_type__c='${data.transactionType}'`);
           let referralProgramData=await pool.query(`select name,transaction_type__c,end_date__c,start_date__c,program__c,program__r__unique_identifier__c from tlcsalesforce.referral_program__c where transaction_type__c='${data.transactionType}'`);
           let finalRefferralProgramResult=referralProgramData ? referralProgramData.rows : []
           console.log('finalRefferralProgramResult',finalRefferralProgramResult) ;


          console.log('program__c',finalRefferralProgramResult[0].program__c)
          console.log(`select isdeleted,benefit__c,referral_program__c,member_type__c,sfid from tlcsalesforce.referral_benefits__C where referral_program__c='${finalRefferralProgramResult[0].program__c}'`);
          let referralBenefitData=await pool.query(`select isdeleted,benefit__c,referral_program__c,member_type__c,sfid from tlcsalesforce.referral_benefits__C where referral_program__c='${finalRefferralProgramResult[0].program__c}'`);
          let finalreferralBenefitData=referralBenefitData ? referralBenefitData.rows : [];
          console.log('finalreferralBenefitData',finalreferralBenefitData);



          console.log('conversion')
          console.log(validateResult[0].member_id__c,finalreferralBenefitData[0].member_type__c,finalreferralBenefitData[0].sfid,data.agent)
          console.log(`INSERT INTO tlcsalesforce.referral_conversion__c(
            counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c)
            VALUES ('${validateResult[0].member_id__c}','${finalreferralBenefitData[0].sfid}', '${finalreferralBenefitData[0].member_type__c}', now(),${header.memberid}, 'delhi referral', '${finalreferralBenefitData[0].benefit__c}', now(), '${data.agent}')`)
          let pushIntoRefferlConersion=await pool.query(`INSERT INTO tlcsalesforce.referral_conversion__c(
            counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c)
            VALUES ('${validateResult[0].member_id__c}','${finalreferralBenefitData[0].sfid}', '${finalreferralBenefitData[0].member_type__c}', now(),'108623', 'delhi referral', '${finalreferralBenefitData[0].benefit__c}', now(), '${data.agent}')`);


           resolve(validateResult)

        }catch(err){
            console.log("under the promise reject");
            console.log(`${err}`);
            reject("promise reject");

        }
    })
}


module.exports = {
    getRefferalData,
    getRefferalData2

}