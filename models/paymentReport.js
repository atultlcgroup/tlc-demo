
let generatePdf = require("../helper/generatePdfForPayments")
let generateExcel = require("../helper/generateExcelForPayments")
let today = new Date();
let day = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let month= `${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`
let fs = require('fs')
let sendGridMailer = require('../helper/sendGridMail');
const pool = require("../databases/db").pool;
let findPaymentRule= async(req)=>{
    try{
        let qry = ``;
        if(req.propertySFID && req.customer_setSFID)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_setSFID}' limit 1`;
        if(req.propertySFID)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' limit 1`;
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
        let getPaymentsOf15Minutes =await pool.query(`Select  distinct 
        membershiptype__c.property__c property_sfid,
        membershiptype__c.sfid customer_set_sfid,
        property__c.name hotel_name,
        account.name member_name,
        membership__c.membership_number__c,
        membershiptype__c.name membership_type_name,
         payment_bifurcation__c.share_percent__c* grand_total__c as membership_fee,
         payment__c.transcationCode__c, payment__c.transaction_id__c,
         payment__c.createddate,
         payment__c.payment_mode__c,
         payment__c.payment_gateway__c as source, 
        payment__c.email__c
        from 
        tlcsalesforce.payment__c
        Inner Join tlcsalesforce.account
        On account.sfid = payment__c.account__c
        Inner Join tlcsalesforce.payment_bifurcation__c
        On payment_bifurcation__c.payment__c = payment__c.sfid
        Left Join tlcsalesforce.membership__c On 
        payment__c.membership__c = membership__c.sfid
        Left Join tlcsalesforce.membershiptype__c On
        membership__c.customer_set__c = membershiptype__c.sfid
        Left join tlcsalesforce.tax_master__c
        On membershiptype__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.property__c
        On membershiptype__c.property__c = property__c.sfid
        Left Join tlcsalesforce.tax_breakup__c
        On tax_breakup__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.payment_email_rule__c
        On payment_email_rule__c.customer_set__c = membershiptype__c.sfid      
        where payment__c.createddate >= current_timestamp - interval '15 minutes'
        AND payment_bifurcation__c.account_number__c = 'SECOND'
        AND 
        (payment__c.payment_status__c = 'CONSUMED' OR 
        payment__c.payment_status__c = 'SUCCESS')
        `)
        let resultForPaymentsOf15Minutes = getPaymentsOf15Minutes ? getPaymentsOf15Minutes.rows : []
        console.log(resultForPaymentsOf15Minutes)
        resultForPaymentsOf15Minutes.map(async req=>{
        let emails = await findPaymentRule(req);
        if(emails.length > 0){
        let hotelName = req.hotel_name ? req.hotel_name : '';
        let subject = `Notification - Payment Confirmation - ${hotelName}`;
        let replacements={name: (req.member_name ? req.member_name : ''),"membership_number":(req.membership_number_c ?membership_number_c:""),"membership_type":(req.membership_type_name ? req.membership_type_name:""),"email":(req.email__c ?req.email__c : ""),"amount":(req.membership_fee?req.membership_fee:""),"transaction_code":(req.transcationcode__c ? req.transcationcode__c :""),"date_time":(req.createddate?req.createddate:  ""),"payment_mode":(req.payment_mode__c ? req.payment_mode__c: ""),"source":(req.source? req.source:"")};
        if(!process.env.EMAIL_FOR_PAYMENT_REPORT){
                 console.log(`Please define EMAIL_FOR_PAYMENT_REPORT from heroku`)
        }else{
        // sendGridMailer.sendgridAttachement(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,'fdb678c6-b2c3-4856-91f2-0f8bcce613bd',fileArr).then(data=>{
            sendGridMailer.sendgrid(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,'fdb678c6-b2c3-4856-91f2-0f8bcce613bd').then(data=>{
            console.log(data)
            }).catch(err=>{
            console.log(err)
         })
        }
        }else{
            console.log(`Hotel/TLC emails not found!`)
        }
     })

    }catch( e ){
        return `${e}`
    }
}


let queryForEOD=async()=>{
    try{
        let query=await pool.query(`Select  distinct payment__c.membership__r__membership_number__c,  firstname, lastname, membershiptype__c.name membership_type_name,
        membershiptype__c.sfid membership_type_id, 
        Case when payment_for__c = 'New Membership' OR payment_for__c = 'Add-On'
        Then 'Fresh'
        when  payment_for__c = 'Renewal'
        THEN 'Renewal'
        Else
            'Other'
        END as FreshRenewal, payment__c.createddate,transcationCode__c, payment__c.transaction_id__c,
        GST_details__c, manager_email__c, account.billingcountry,account.billingstate, account.billingcity,account.billingstreet,
        account.billingpostalcode, payment_mode__c, payment_bifurcation__c.share_percent__c* grand_total__c as membership_fee, tax_breakup__c.name breakup
        from 
        tlcsalesforce.payment__c
        Inner Join tlcsalesforce.account
        On account.sfid = payment__c.account__c
        Inner Join tlcsalesforce.payment_bifurcation__c
        On payment_bifurcation__c.payment__c = payment__c.sfid
        Left Join tlcsalesforce.membership__c On 
        payment__c.membership__c = membership__c.sfid
        Left Join tlcsalesforce.membershiptype__c On
        membership__c.customer_set__c = membershiptype__c.sfid
        Left join tlcsalesforce.tax_master__c
        On membershiptype__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.tax_breakup__c
        On tax_breakup__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.payment_email_rule__c
        On payment_email_rule__c.customer_set__c = membershiptype__c.sfid
        
        
        where date(payment__c.createddate) = current_date
        AND payment_bifurcation__c.account_number__c = 'SECOND'
        AND 
        (payment__c.payment_status__c = 'CONSUMED' OR 
        payment__c.payment_status__c = 'SUCCESS')
        
        `);
        let result = query ? query.rows : []
        return result;

    }catch(e){
        return [];
    }
}

let queryForEOM = async()=>{
     try{
         let qry=await  pool.query(`Select  distinct payment__c.membership__r__membership_number__c,  firstname, lastname, membershiptype__c.name membership_type_name,
         membershiptype__c.sfid membership_type_id, 
         Case when payment_for__c = 'New Membership' OR payment_for__c = 'Add-On'
         Then 'Fresh'
         when  payment_for__c = 'Renewal'
         THEN 'Renewal'
         Else
             'Other'
         END as FreshRenewal, createddate,transcationCode__c, payment__c.transaction_id__c,
         GST_details__c, manager_email__c, account.billingcountry,account.billingstate, account.billingcity,account.billingstreet,
         account.billingpostalcode, payment_mode__c, payment_bifurcation__c.share_percent__c* grand_total__c as membership_fee, tax_breakup__c.name breakup
         from 
         tlcsalesforce.payment__c
         Inner Join tlcsalesforce.account
         On account.sfid = payment__c.account__c
         Inner Join tlcsalesforce.payment_bifurcation__c
         On payment_bifurcation__c.payment__c = payment__c.sfid
         Left Join tlcsalesforce.membership__c On 
         payment__c.membership__c = membership__c.sfid
         Left Join tlcsalesforce.membershiptype__c On
         membership__c.customer_set__c = membershiptype__c.sfid
         Left join tlcsalesforce.tax_master__c
         On membershiptype__c.tax_master__c = tax_master__c.sfid
         Left Join tlcsalesforce.tax_breakup__c
         On tax_breakup__c.tax_master__c = tax_master__c.sfid
         Left Join tlcsalesforce.payment_email_rule__c
         On payment_email_rule__c.customer_set__c = membershiptype__c.sfid
         
         
         where payment__c.createddate = current_date - interval '1 month'
         AND payment_bifurcation__c.account_number__c = 'SECOND'
         AND 
         (payment__c.payment_status__c = 'CONSUMED' OR 
         payment__c.payment_status__c = 'SUCCESS')
         
         `)
         let result = query ? query.rows : []
         return result;
     }catch(e){
         return [];
     }
}


let reportForEODandEOM = async (req) => {
    return new Promise(async (resolve,reject)=>{
    try {
            
            console.log("get peyment datails data !");         
            let subject =req.type =='EOD' ? `Payment report for ${day}`:`Pyament report for ${month}`
            console.log(subject)
            let emails = await findPaymentRule(req);
            let templateId = req.type == 'EOD' ? 'ac3c9b94-d2a9-4872-ba55-92b784aa5a2b' : 'f2c3746e-607c-4c7c-8f5c-7c75860e30e0'
            let text = req.type == 'EOD' ? `Please find attachments for payment report of ${day}.` : `Please find attachments for payment report of ${month}.`
            let replacements={text : `${text}`};
            console.log(templateId)
            if(emails.length == 0 ){
                reject(`Hotel/TLC emails not found!`)
                return
            }
            let pdfFile = await generatePdf.generatePDF()
            let excelFile = await generateExcel.generateExcel();
            console.log(excelFile)
            let fileArr = getFileArr(excelFile,pdfFile);
            await sendGridMailer.sendgridAttachement(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,templateId,fileArr).then(data=>{
                console.log(data)
                resolve(`Success`)
                return
            }).catch(err=>{
                console.log(`${err}`)
                reject(`${err}`)
                return
            })  
            resolve(`${fileArr}`);
            return
         } catch (e) {
             console.log(e)
        reject(e);
        return
    }
  })
}



let getFileArr = (excelFile,pdfFile)=>{
    let fileArr= [
        {
            filename: `Payment Report.xlsx`,
            //  content: fs.readFileSync(`./paymentReport/Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`).toString("base64")
            content: fs.readFileSync(`${excelFile}`).toString("base64")    
    
            },
            {
                filename: `Payment Report.pdf`,
                // content: fs.readFileSync(`${pdf}`).toString("base64")    
                content: fs.readFileSync(`${pdfFile}`).toString("base64")    
                }
            ]
            return fileArr;
    }
    
module.exports={
    paymentReport,
    reportForEODandEOM
}