const { writeFileSync } = require("fs");
const pool = require("../databases/db").pool
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const { resolve } = require("path");





let getRefferalData2 = (data, header) => {
    console.log('refferalData', data, header);
    return new Promise(async (resolve, reject) => {
        try {
            console.log('pool', pool)
            console.log(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}'`)

            let result = await pool.query(`select referral_code__c,member_id__c,membership_number__C from tlcsalesforce.account p1 inner join tlcsalesforce.membership__c p2 on p1.member_id__c = p2.member__r__member_id__C where p1.referral_code__c='${data.referralCode}'`)
            let validateResult = result ? result.rows : [];
            console.log("under the resolve promise", validateResult, data, header);



            //fetcing refferral program
            //    console.log('transaction Type',data.transactionType)
            //    console.log(`select name,transaction_type__c,end_date__c,start_date__c,program__c,program__r__unique_identifier__c from tlcsalesforce.referral_program__c,sfid where transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}'`);
            //    let referralProgramData=await pool.query(`select name,transaction_type__c,end_date__c,start_date__c,program__c,program__r__unique_identifier__c,sfid from tlcsalesforce.referral_program__c where transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}'`);
            //    let finalRefferralProgramResult=referralProgramData ? referralProgramData.rows : []
            //    console.log('finalRefferralProgramResult',finalRefferralProgramResult) ;

            // select * from tlcsalesforce.referral_prograamm__c pl inner join tlcsalesforce.referral_benefit__c p2 on p1.sfid==p2.referral program where transaction type =data.transactionType
            //fetching referral benefits
            //   console.log('sfid',finalRefferralProgramResult[0].sfid)
            //   console.log(`select isdeleted,benefit__c,referral_program__c,member_type__c,sfid from tlcsalesforce.referral_benefits__C where referral_program__c='${finalRefferralProgramResult[0].sfid}`);
            //   let referralBenefitData=await pool.query(`select isdeleted,benefit__c,referral_program__c,member_type__c,sfid from tlcsalesforce.referral_benefits__C where referral_program__c='${finalRefferralProgramResult[0].sfid}'`);
            //   let finalreferralBenefitData=referralBenefitData ? referralBenefitData.rows : [];
            //   console.log('finalreferralBenefitData',finalreferralBenefitData);


            ///



            //fetcing refferral program & referral benefits
            let finalResultOfJoinBenefitAndProgarm = await fetchReferralProgramAndRefferalBenefits(data, header);






            //added into conversion
            console.log('conversion')
            console.log(validateResult[0].member_id__c, finalResultOfJoinBenefitAndProgarm[0].member_type__c, finalResultOfJoinBenefitAndProgarm[0].sfid2, data.agent)
            console.log(`INSERT INTO tlcsalesforce.referral_conversion__c(
            counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c,isdeleted)
            VALUES ('${validateResult[0].member_id__c}','${finalResultOfJoinBenefitAndProgarm[0].sfid2}', '${finalResultOfJoinBenefitAndProgarm[0].member_type__c}', now(),'${header.memberid}', '${finalResultOfJoinBenefitAndProgarm[0].transaction_type__c}', '${finalResultOfJoinBenefitAndProgarm[0].sfid2}', now(), '${data.agent}','${finalResultOfJoinBenefitAndProgarm[0].isdeleted}')`)

            let pushIntoRefferlConersion = await pool.query(`INSERT INTO tlcsalesforce.referral_conversion__c(
            counter_party__c, rule_used__c, member_type__c, referred_date__c, member__c, name, benefit__c,  createddate, agent__c,isdeleted)
            VALUES ('${validateResult[0].member_id__c}','${finalResultOfJoinBenefitAndProgarm[0].sfid2}', '${finalResultOfJoinBenefitAndProgarm[0].member_type__c}', now(),'${header.memberid}', '${finalResultOfJoinBenefitAndProgarm[0].transaction_type__c}', '${finalResultOfJoinBenefitAndProgarm[0].sfid2}', now(), '${data.agent}','${finalResultOfJoinBenefitAndProgarm[0].isdeleted}')`);


            resolve(validateResult)

        } catch (err) {
            console.log("under the promise reject");
            console.log(`${err}`);
            reject("promise reject");

        }
    })
}



let fetchReferralProgramAndRefferalBenefits = async (data, header) => {
    try {
        console.log("join");
        console.log(`select p1.name,transaction_type__c,end_date__c,start_date__c,program__r__unique_identifier__c,p1.sfid,p2.isdeleted,benefit__c,member_type__c,p2.sfid from tlcsalesforce.referral_program__c p1 inner join tlcsalesforce.referral_benefits__C p2 on p1.sfid=p2.referral_program__c where p1.transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}'`)
        let resultOfJoinBenefitAndProgarm = await pool.query(`select p1.name,transaction_type__c,end_date__c,start_date__c,program__r__unique_identifier__c,p1.sfid sfid1,p2.isdeleted,benefit__c,member_type__c,p2.sfid sfid2 from tlcsalesforce.referral_program__c p1 inner join tlcsalesforce.referral_benefits__C p2 on p1.sfid=p2.referral_program__c where p1.transaction_type__c='${data.transactionType}' and program__r__unique_identifier__c='${header.programid}'`);
        let finalResultOfJoinBenefitAndProgarm = resultOfJoinBenefitAndProgarm ? resultOfJoinBenefitAndProgarm.rows : [];
        console.log(finalResultOfJoinBenefitAndProgarm);
        return finalResultOfJoinBenefitAndProgarm
    } catch (e) {
        return e
    }


}


module.exports = {
    getRefferalData2

}