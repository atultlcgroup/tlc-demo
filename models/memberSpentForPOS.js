// let sendMail= require("../helper/mailModel")

const { resolve, reject } = require("bluebird");

// let generatePdf = require("../helper/generateDSRPdf")
const pool = require("../databases/db").pool;

let getMembershipDetails = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log("membership data");
            let getMembershipData=await pool.query(`select membership_status__C,expiry_date__c,member__c,membership_number__c,sfid from tlcsalesforce.membership__c`)
            let result= getMembershipData ? getMembershipData.rows : [];
            
           status=await getPOSchequeDetailsData(result);

            resolve (status);
         
        }catch(e){
            console.log(`${e}`);
            return e
        }
    })
}

let getPOSchequeDetailsData=async(membershipData)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let membershipStatus;
            console.log("member spent data from POS");
            for(obj of membershipData){
                console.log()
                let spendData=await pool.query(`select sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '6 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) as last_six_month,
                sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN gross_bill_total__C ELSE 0 END) as last_year,
                sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '3 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) AS last_three_months,
                sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE-1) THEN gross_bill_total__C ELSE 0 END) AS year_till_date,
                sum(case when EXTRACT(MONTH FROM bill_date__c) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) THEN gross_bill_total__C ELSE 0 END) AS month_till_date
                from tlcsalesforce.pos_cheque_details__c where membership__r_membership_number__c=' ${obj.membership_number__c}'
                `)
              console.log(`Member ${obj.membership_number__c} spend for`);
              
              membershipStatus=await updateMembershipSpent(obj.membership_number__c,spendData.rows[0]);
            }
            resolve(membershipStatus);

        }catch(e){
            console.log(`${e}`);
            reject(e);
        }
    })
}


let updateMembershipSpent=async(membership,spendData)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log("update membership_c columns");
            
            let updateMembershipData=await pool.query(`update tlcsalesforce.membership__c set  spends_mtd__c='${spendData.month_till_date}', spends_this_year__c='${spendData.year_till_date}', spends_last_3_months__c='${spendData.last_three_months}', spends_last_6_months__c='${spendData.last_six_month}', spends_last_year__c=${spendData.last_year} where membership_number__c='${membership}'`);
            
            console.log("membership__c update successfully")
            resolve("membership__c updated successfully");
            

        }catch(e){
            console.log(e);
            reject(e);

        }
    })
}


module.exports={
    getMembershipDetails
}