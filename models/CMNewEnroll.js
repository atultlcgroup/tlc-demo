const { pool } = require("../databases/db");
let sendMail= require("../helper/mailModel")
let generateCMNewEnrollPDF = require("../helper/generateCMNewEnrollPDF")
let  dotenv = require('dotenv');
dotenv.config();

const CMNewEnrollEmails =  process.env.CM_NEW_ENROLL_EMAILS || ``; 
const CMNewEnrollProgramId = process.env.CM_NEW_ENROLL_PROGRAM_ID || ``;


let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_cmnew__c,hotel_email_id_cmnew__c,tlc_email_id_cmnew__c,tlc_send_email_cmnew__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
         qry = `select hotel_email_send_cmnew__c,hotel_email_id_cmnew__c,tlc_email_id_cmnew__c,tlc_send_email_cmnew__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
         else if(req.customer_set_sfid)
        qry = `select hotel_email_send_cmnew__c,hotel_email_id_cmnew__c,tlc_email_id_cmnew__c,tlc_send_email_cmnew__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_cmnew__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_cmnew__c.split(','));
            if(d.tlc_send_email_cmnew__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_cmnew__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let getEPRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid, payment_email_rule__c.program__c  from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_cmnew__c = true or tlc_send_email_cmnew__c = true) and  (property__c is not NULL or property__c !='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let propertyArr = [];
      let programArr = [];
      for(r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          propertyArr.push(r.property_sfid)
          programArr.push(r.program__c)
      }
      let resultObj = {emailArr: finalArr,propertyArr : propertyArr , programArr : programArr}
      return resultObj;
    }catch(e){
      return [];
    }
}


let getCMNewEnroll= async(program__c )=>{
    try{
        let qry =`select program__c.sfid program_id,account.name,membership__c.membership_number__c,membership__c.Membership_Enrollment_Date__c,membership__c.Membership_Renewal_Date__c,membership__c.membership_activation_date__c,
        membershiptype__c.sfid as customer_set_sfid,
        membershiptype__c.name customer_set_name,
        membershiptype__c.customer_set_program_level__c customer_set_level_name,
        program__c.name as program_name,program__c.unique_identifier__c as program_unique_identifier,
        payment__c.promocode__c
        from tlcsalesforce.payment__c
        inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.city__c on city__c.sfid=property__c.city__c
        Inner Join tlcsalesforce.program__c
        On membershiptype__c.program__c = program__c.sfid
       where
       ((Membership__c.Membership_Enrollment_Date__c <= current_date - interval '1 day'  and Membership__c.Membership_Enrollment_Date__c >= current_date - interval '7 day' )
        
          or (Membership__c.Membership_Renewal_Date__c <= current_date - interval '1 day' and  Membership__c.Membership_Renewal_Date__c >= current_date - interval '7 day'))
           and
           Membership__c is not Null and Membership_Offer__c is null
           and program__c.sfid  = '${program__c}' limit 10
         `;
         let data = await pool.query(qry)
         return data.rows.length ? data.rows : []
    }catch(e){
        return []
    }
}

let CMReport = async()=>{
    try{
        let emails = CMNewEnrollEmails;
        let program__c= CMNewEnrollProgramId;
          let data =await getCMNewEnroll(program__c)
            if(data.length){
                console.log(`------------------`)
                //generatePdf for new enrollment 
                let pdf =await generateCMNewEnrollPDF.generateCMNewEnrollPDF(data ,  data[0].program_name , data[0].program_id)
                // sendMail.sendCMNewEnroll(`` , `` , emails , data[0].program_name)
            }
        return data;
    }catch(e){
        return e;
    }
}

module.exports = {
    CMReport
}