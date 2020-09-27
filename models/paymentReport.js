
let generatePdf = require("../helper/generatePdfForPayments")
let generateExcel = require("../helper/generateExcelForPayments")
let sendMail= require("../helper/mailModel")
let today = new Date();
let day = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let month= `${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`
let fs = require('fs')
// let sendGridMailer = require('../helper/sendGridMail');

const pool = require("../databases/db").pool;
let formatDate=(date)=>{
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (`${String(date.getDate()).padStart(2, '0')} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()} ${strTime}`);
  }
  
let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}' limit 1`;
        if(req.property_sfid)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' limit 1`;
        if(req.customer_set_sfid)
        qry = `select * from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}' limit 1`;
       

        console.log(`-----------`)
        console.log(qry)
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
        console.log(e)
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
        limit 2    
        --where payment__c.createddate >= current_timestamp - interval '15 minutes'
        --AND payment_bifurcation__c.account_number__c = 'SECOND'
       -- AND 
       -- (payment__c.payment_status__c = 'CONSUMED' OR 
       -- payment__c.payment_status__c = 'SUCCESS')
        `)
        let resultForPaymentsOf15Minutes = getPaymentsOf15Minutes ? getPaymentsOf15Minutes.rows : []
        console.log(resultForPaymentsOf15Minutes)
        
        resultForPaymentsOf15Minutes.map(async req=>{
            req.property_sfid ='a0D0k000009eJcIEAU'
        let emails = await findPaymentRule(req);
        if(emails.length > 0){
        let hotelName = req.hotel_name ? req.hotel_name : '';
        let subject = `Notification - Payment Confirmation - ${hotelName}`;
        // let dateFormat1 = (req.createddate?req.createddate:  "")
        // let dateTime1 = ``
        // if(formatDate){
        //     dateTime1 = formatDate(dateFormat1)
        // }
        // let replacements={name: (req.member_name ? req.member_name : ''),"membership_number":(req.membership_number_c ?membership_number_c:""),"membership_type":(req.membership_type_name ? req.membership_type_name:""),"email":(req.email__c ?req.email__c : ""),"amount":(req.membership_fee?req.membership_fee:""),"transaction_code":(req.transcationcode__c ? req.transcationcode__c :""),"date_time":dateTime1,"payment_mode":(req.payment_mode__c ? req.payment_mode__c: ""),"source":(req.source? req.source:"")};
        if(!process.env.EMAIL_FOR_PAYMENT_REPORT){
                 console.log(`Please define EMAIL_FOR_PAYMENT_REPORT from heroku`)
        }else{

            sendMail.sendMailForEachPayment(req,emails , subject)
        // sendGridMailer.sendgridAttachement(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,'fdb678c6-b2c3-4856-91f2-0f8bcce613bd',fileArr).then(data=>{
       //use to send mail for each payment by sendgrid
        //     sendGridMailer.sendgrid(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,'fdb678c6-b2c3-4856-91f2-0f8bcce613bd').then(data=>{
        //     console.log(data)
        //     }).catch(err=>{
        //     console.log(err)
        //  })
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
        GST_details__c, manager_email__c ,payment__c.email__c, account.billingcountry,account.billingstate, account.billingcity,account.billingstreet,
        account.billingpostalcode, payment_mode__c, payment_bifurcation__c.share_percent__c* grand_total__c as membership_fee, tax_breakup__c.name breakup,tax_breakup__c.break_up__c break_perc
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
        
        limit 2
        --where date(payment__c.createddate) = current_date
        --AND payment_bifurcation__c.account_number__c = 'SECOND'
        --AND 
        --(payment__c.payment_status__c = 'CONSUMED' OR 
        --payment__c.payment_status__c = 'SUCCESS')
        
        `);
        let result = query ? query.rows : []
        let customerSetData = await filterDataBasedOnCustometSet(result)
        return customerSetData;

    }catch(e){
        return [];
    }
}

let updateTax=async(arr,obj)=>{
    for(d of arr){
        if(d.transaction_id__c == obj.transaction_id__c){
           d[obj.breakup] = obj.break_perc
           return {code :1, arr:arr};
        }
    }
    return {code :0, arr:arr};;
}

let filterDataBasedOnCustometSet=async(data)=>{
    let customerSetObj = {};
    for(d of data){
    // data.map(async d=>{
        d.IGST=0;
        d.CGST=0;
        d.SGST=0;
        if(customerSetObj.hasOwnProperty(d.membership_type_id)){
            let tax = await updateTax(customerSetObj[d.membership_type_id],d)
            if(tax.code == 1)
            customerSetObj[d.membership_type_id] = tax.arr;
            else
            customerSetObj[d.membership_type_id].push(d);
        }
        else{
            customerSetObj[d.membership_type_id]=[d];
        }
    // })
    }
    console.log(`===========================`)
    console.log(customerSetObj)

    return customerSetObj;
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
         END as FreshRenewal, payment__c.createddate,transcationCode__c, payment__c.transaction_id__c,
         GST_details__c, manager_email__c,payment__c.email__c, account.billingcountry,account.billingstate, account.billingcity,account.billingstreet,
         account.billingpostalcode, payment_mode__c, payment_bifurcation__c.share_percent__c* grand_total__c as membership_fee, tax_breakup__c.name breakup,tax_breakup__c.break_up__c break_perc
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
         
         limit 2
         --where payment__c.createddate = current_date - interval '1 month'
         --AND payment_bifurcation__c.account_number__c = 'SECOND'
         --AND 
         --(payment__c.payment_status__c = 'CONSUMED' OR 
         --payment__c.payment_status__c = 'SUCCESS')
         `)
         let result = qry ? qry.rows : []
         let customerSetData = await filterDataBasedOnCustometSet(result)
         return customerSetData;
     }catch(e){
         return [];
     }
}



let reportForEODandEOM = async (req) => {
    return new Promise(async (resolve,reject)=>{
    try {

        // let EODData= await queryForEOD();
        // let EOMData= await queryForEOM();

        let finalData = req.type == 'EOD' ? await queryForEOD() : await queryForEOM();
            for(let [key,value] of Object.entries(finalData)){
                console.log(key)
                console.log(value)
                req.customer_set_sfid = key;
                req.customer_set_sfid = 'a0f0k000003FSKyAAO';
                    console.log("get peyment datails data !");         
                    let subject =req.type =='EOD' ? `Payment report for ${day}`:`Pyament report for ${month}`
                    console.log(subject)
                    let emails = await findPaymentRule(req);
                    // let templateId = req.type == 'EOD' ? 'ac3c9b94-d2a9-4872-ba55-92b784aa5a2b' : 'f2c3746e-607c-4c7c-8f5c-7c75860e30e0'
                    let text = req.type == 'EOD' ? `Please find attachments for payment report of ${day}.` : `Please find attachments for payment report of ${month}.`
                    // let replacements={text : `${text}`};
                    // console.log(templateId)
                    if(emails.length == 0 ){
                        console.log(`Hotel/TLC emails not found!`)        
                    }else{
                        let pdfFile = await generatePdf.generatePDF(value)
                        let excelFile = await generateExcel.generateExcel(value);
                        // console.log(excelFile)
                        // let fileArr = getFileArr(excelFile,pdfFile);
                     
                        req.type == 'EOD'?
                          sendMail.sendEODPaymentReport(excelFile,pdfFile , emails):sendMail.sendEOMPaymentReport(excelFile,pdfFile , emails)

                        //To send emails for payment report for eod report
                        // await sendGridMailer.sendgridAttachement(emails,process.env.EMAIL_FOR_PAYMENT_REPORT,`${subject}`,`${subject}`,`${subject}`,replacements,templateId,fileArr).then(data=>{
                        //     console.log(data)
                        //     resolve(`Success`)
                        //     return
                        // }).catch(err=>{
                        //     console.log(`${err}`)
                        //     reject(`${err}`)
                        //     return
                        // })  
                        // console.log(`${fileArr}`);
                    }
                    
            }
            resolve(`Success`)
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