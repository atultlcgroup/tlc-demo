let sendMail= require("../helper/mailModel")
let generatePdf = require("../helper/generateDSRPdf")
const pool = require("../databases/db").pool;

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        if(req.property_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        if(req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_status__c == true)
            resultArray= resultArray.concat(d.hotel_emails__c.split(','));
            if(d.tlc_email_status__c == true)
            resultArray=resultArray.concat(d.manager_email__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let DSRReport = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let req = {};
            req.property_sfid = 'a0Y1y000000EFBREA4';
            console.log(`hi`)
            let emails =await findPaymentRule(req)
            console.log(emails)
            let pdfFile = await generatePdf.generateDSRPDF('resultArr')
            console.log(pdfFile)
            sendMail.sendDSRReport(`${pdfFile}`,'Daily Report',emails)
            console.log(`From Model`)
        }catch(e){
            console.log(`${e}`)
        }
    })
}


module.exports={
    DSRReport
}