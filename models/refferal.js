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


let getRefferalData2=  (data)=>{
    console.log('refferalData',data);
    return new Promise(async(resolve,reject)=>{
        try{
            console.log('pool',pool)
           console.log(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}' and p2.membership_number__C='${data.membershipNumber}'`) 
           
           let result= await pool.query(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 left join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}' and p2.membership_number__C='${data.membershipNumber}'`)
           
           console.log("under the resolve promise",result.rows);
            resolve(result.rows)

        }catch(err){
            console.log("under the promise reject");
            console.log(JSON.stringify(err));
            reject("promise reject");

        }
    })
}


module.exports = {
    getRefferalData,
    getRefferalData2

}