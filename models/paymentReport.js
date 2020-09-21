
let sendGridMailer = require('../helper/sendGridMail')
const pool = require("../databases/db").pool;
let findPaymentRule= async(req)=>{
    try{
        let qry = ``;
        if(req.propertySFID && req.customer_setSFID)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.propertySFID}' and customer_set__c = '${req.customer_setSFID}' limit 1`;
        if(req.propertySFID)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.propertySFID}' limit 1`;
        if(req.customer_setSFID)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_setSFID}' limit 1`;

        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            resultArray= resultArray.concat(result[0].hotel_emails__c.split(','));
            resultArray=resultArray.concat(result[0].manager_email__c.split(','));
        }
        console.log(resultArray)
        return resultArray
    }catch(e){
        return [];
    }
}

let paymentReport =async (req)=>{
    try{
        let subject = `Notification - Payment Confirmation - ${req.hotel}`;
        let replacements={name:`${req.name}`,"membership_number":`${req.membership_number}`,"membership_type":`${req.membership_type}`,"email":`${req.email}`,"amount":`${req.amount}`,"transaction_code":`${req.transaction_code}`,"date_time":`${req.date_time}`,"payment_mode":`${req.payment_mode}`,"source":`${req.source}`};
        if(!process.env.EMAIL_FOR_PAYMENT_REPORT){
            throw `Please define EMAIL_FOR_PAYMENT_REPORT from hrroku`
        }
        let emails = await findPaymentRule(req);
        if(emails.length > 0){
        sendGridMailer.sendgrid(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,'fdb678c6-b2c3-4856-91f2-0f8bcce613bd').then(data=>{
            console.log(data)
        }).catch(err=>{
            console.log(err)
        })
        }else{
            throw `Hotel/TLC emails not found!`
        }

    }catch( e ){
        return `${e}`
    }
}

module.exports={
    paymentReport
}