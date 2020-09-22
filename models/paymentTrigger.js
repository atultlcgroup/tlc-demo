const pool = require("../databases/db").pool
const checkMail=require("./checkMail");
let getPaymentDetailsData = async (fileName) => {
    try {
            console.log("get peyment datails data !");
           
            let findProperty =await pool.query(`select firstname,lastname,referral_code__c,member_id__c,gift_referral_benefit__c from tlcsalesforce.account where member_id__c='101623'`);
             console.log("findProperty",findProperty.rows)
            
            return findProperty.rows
         } catch (e) {
        return e;
    }

}


module.exports={
    getPaymentDetailsData

}