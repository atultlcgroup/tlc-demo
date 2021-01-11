let  dotenv = require('dotenv');
dotenv.config();
const sendmail = require('./sendMail')
const pool = require("../databases/db").pool;
const fromEmailForPOSError=process.env.FROM_EMAIL_FOR_POS_ERROR || ''; 



// const config = require('../config').ENV_OBJ

const from=process.env.FROM_MAIL || "";
const to=process.env.TO_MAIL || ""
const subject =process.env.MAIL_SUBJECT || "";
let fromEmailForPyament =process.env.EMAIL_FOR_PAYMENT_REPORT || "";
const fromEmailForDSR = process.env.FROM_EMAIL_FOR_DSR || "";
const fromEmailForUTR = process.env.FROM_EMAIL_FOR_UTR || "";
const fromEmailForFR = process.env.FROM_EMAIL_FOR_FR || "";
const fromEmailForRR = process.env.FROM_EMAIL_FOR_RR || "";
const fromEmailForDRR = process.env.FROM_EMAIL_FOR_DRR || "";




let today = new Date();
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
const fs = require('fs');
const handlebars = require('handlebars');
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




  


const readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
    
};
let sendMail=(req,error , unique_id)=>{

                readHTMLFile(__dirname + `/errorTemplate.html`, function(err, html) {
                console.log('hi')
                if(err)
                console.log(err)
                let template = handlebars.compile(html);
                replacements={"error":error,body: JSON.stringify(req.body),header:JSON.stringify(req.headers),query:JSON.stringify(req.query),url:req.protocol + '://' + req.get('host') + req.originalUrl,"unique_id":unique_id};
               let htmlToSend = template(replacements);
           
               console.log(`from : ${from} to ${to} subject ${subject} error = ${error}`)
                sendmail.smtp(to, from , subject,htmlToSend , `${htmlToSend}`).then((data)=>{
                    console.log(`Email Sent Successfully`)
                    // res.status(200).send(`email sent from: ${from} to: ${to}`)
                }).catch((err)=>{
                    // res.status(500).send(`${JSON.stringify(err)}`)
                    console.log(err)
                    console.log(`Email snet has err :${JSON.stringify(err)}`)
                })
            })
            }



            let updatePayentLog=(transactionIdArr,status)=>{
                try{
                    for(a of transactionIdArr){
                        pool.query(`UPDATE tlcsalesforce.payment_report_log
                        SET  email_status='${status}' 
                        WHERE transaction_id='${a}'`)  ;
                    }
                 console.log(`success`)
                }catch(e){
                    console.log(`Got error in insertPayentLog function. Error:${e}`)
                }
            }

let sendEODPaymentReport=(file,pdf,fileName,emails,transactionIdsArr)=>{
    try{
        readHTMLFile(__dirname + `/Payment_Report_For_EOD.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForEODReport = new Date();
            dateForEODReport = `${String(dateForEODReport.getDate()).padStart(2, '0')} ${dateForEODReport.toLocaleString('default', { month: 'short' })} ${dateForEODReport.getFullYear()}`
            let subjectForEODPayentReport = `Daily Summary I Membership Fee Collection`
            let template = handlebars.compile(html);
            replacements={"text":`Please find attachments for Parment Report of "${dateForEODReport}".`};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForPyament : ${fromEmailForPyament} to ${emails} subject ${subjectForEODPayentReport} File:${file} fileName:${fileName}`)
            // sendmail.smtpAttachment(emails, `Club Marriott <${fromEmailForPyament}>` , subjectForEODPayentReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${pdf}`).then((data)=>{
                sendmail.smtpAttachment(emails, `Club Marriott <${fromEmailForPyament}>` , subjectForEODPayentReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${pdf}`,`${fileName}`).then((data)=>{
                updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)

                // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}

let sendEOMPaymentReport=(file,pdf,fileName,emails,transactionIdsArr)=>{
    try{
   
        readHTMLFile(__dirname + `/Payment_Report_For_EOM.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateforEOMReport= new Date();
            dateforEOMReport = `${dateforEOMReport.toLocaleString('default', { month: 'short' })} ${dateforEOMReport.getFullYear()}`
            let subjectForEODPayentReport = `Monthly Summary I Membership Fee Collection`
            let template = handlebars.compile(html);
            replacements={"text":`Please find attachments for Parment Report of "${dateforEOMReport}".`};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForPyament : ${fromEmailForPyament} to ${emails} subject ${subjectForEODPayentReport} File:${file} fileName:${fileName}`)
            sendmail.smtpAttachment(emails, `Club Marriott <${fromEmailForPyament}>` , subjectForEODPayentReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${pdf}`,`${fileName}`).then((data)=>{
                updatePayentLog(transactionIdsArr,'SUCCESS')

                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}

let sendMailForEachPayment = async(req,toEmails, emailSubject, transaction_id)=>{
    try{
        readHTMLFile(__dirname + `/Payment_Report_For_Each_Payment.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let template = handlebars.compile(html);
            // replacements={"name":`${req.name}`,"membership_number":`${req.membership_number}`,"membership_type":`${req.membership_type}`,"email":`${req.email}`,"amount":`${req.amount}`,"transaction_code":`${req.transaction_code}`,"date_time":`${req.date_time}`,"payment_mode":`${req.payment_mode}`,"source":`Web`};
            let dateFormat1 = (req.createddate?req.createddate:  "")
            let dateTime1 = ``
            if(formatDate){
                dateTime1 = formatDate(dateFormat1)
            }
            let replacements={name: (req.member_name ? req.member_name : ''),"membership_number":(req.membership_number__c ?req.membership_number__c:""),"membership_type":(req.membership_type_name ? req.membership_type_name:""),"email":(req.email__c ?req.email__c : ""),"amount":(req.membership_amount?req.membership_amount:0),"fee":(req.membership_fee?req.membership_fee:0),"transaction_code":(req.transcationcode__c ? req.transcationcode__c :""),"date_time":dateTime1,"payment_mode":(req.payment_mode__c ? req.payment_mode__c: ""),"source":(req.source? req.source:"")};
            let htmlToSend = template(replacements);
            sendmail.smtp(toEmails, `Club Marriott <${fromEmailForPyament}>` , emailSubject,`${htmlToSend}` , `${htmlToSend}`).then(async(data)=>{
                pool.query(`UPDATE tlcsalesforce.payment_report_log
                SET  email_status='SUCCESS' 
                WHERE transaction_id='${transaction_id}'`)  
                                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch(async(err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        pool.query(`UPDATE tlcsalesforce.payment_report_log
                SET  email_status='FAILED' 
                WHERE transaction_id='${transaction_id}'`)  
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
    }catch(e)
   {
       return   `${e}`
   } 
}


let sendDSRReport=(file,excelFile,sfdcFile,fileName,emails)=>{
    try{
        readHTMLFile(__dirname + `/DSR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDSRReport= new Date();
            dateforEOMReport = `${dateForDSRReport.toLocaleString('default', { month: 'short' })} ${dateForDSRReport.getFullYear()}`
            let subjectForDSRReport = `Club Marriott | Daily Sales Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForDSR : ${fromEmailForDSR} to ${emails} subject ${subjectForDSRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentDSR(emails, `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${excelFile}`,`${sfdcFile}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}      



let sendFReport=(file,fileName,emails)=>{
    try{
        readHTMLFile(__dirname + `/FR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForFReport= new Date();
            let subjectForFReport = `Club Marriott | Feedback Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForFR : ${fromEmailForFR} to ${emails} subject ${subjectForFReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentFR(emails, `Club Marriott <${fromEmailForFR}>` , subjectForFReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}  


let sendDRReport=(file,fileName,emails)=>{
    try{
        readHTMLFile(__dirname + `/DRR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDRReport= new Date();
            let subjectForDRReport = `Club Marriott | Daily Redemption Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForRR : ${fromEmailForDRR} to ${emails} subject ${subjectForDRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentDRR(emails, `Club Marriott <${fromEmailForDRR}>` , subjectForDRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}  


let sendRReport=(file,fileName,emails)=>{
    try{
        readHTMLFile(__dirname + `/RR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForRReport= new Date();
            let subjectForRReport = `Club Marriott | Todays Reservation Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForRR : ${fromEmailForRR} to ${emails} subject ${subjectForRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentRR(emails, `Club Marriott <${fromEmailForRR}>` , subjectForRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}  


let sendUTRReport=(file,fileName,emails)=>{
    try{
        readHTMLFile(__dirname + `/UTR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDSRReport= new Date();
            dateforEOMReport = `${dateForDSRReport.toLocaleString('default', { month: 'short' })} ${dateForDSRReport.getFullYear()}`
            let subjectForUTRReport = `Club Marriott | PG Settlement Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForUTR : ${fromEmailForUTR} to ${emails} subject ${subjectForUTRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentUTR(emails, `Club Marriott <${fromEmailForUTR}>` , subjectForUTRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}   



// POS error report 
let sendPOSErrorReport=(file,fileName,emails,logoName)=>{
    try{
        readHTMLFile(__dirname + `/posError.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForPOSErrorReport= new Date();
            dateforEOMReport = `${dateForPOSErrorReport.toLocaleString('default', { month: 'short' })} ${dateForPOSErrorReport.getFullYear()}`
            let subjectForPOSErrorReport = `POS Error Report`
            let template = handlebars.compile(html);
            replacements={};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForPOSError : ${fromEmailForPOSError} to ${emails} subject ${subjectForPOSErrorReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentPOSError(emails, `Club Marriott <${fromEmailForPOSError}>` , subjectForPOSErrorReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`,logoName).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}   

// End POS report error



            module.exports={
                sendMail,
                sendEODPaymentReport,
                sendEOMPaymentReport,
                sendMailForEachPayment,
                sendDSRReport,
                sendUTRReport,
                sendPOSErrorReport,
                sendFReport,
                sendRReport,
                sendDRReport
            }

        