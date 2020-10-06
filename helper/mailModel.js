let  dotenv = require('dotenv');
dotenv.config();
const sendmail = require('./sendMail')
const pool = require("../databases/db").pool;

// const config = require('../config').ENV_OBJ

const from=process.env.FROM_MAIL || "";
const to=process.env.TO_MAIL || ""
const subject =process.env.MAIL_SUBJECT || "";
let fromEmailForPyament =process.env.EMAIL_FOR_PAYMENT_REPORT || "";
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

let sendEODPaymentReport=(file,pdf,emails,transactionIdsArr)=>{
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
            console.log(`fromEmailForPyament : ${fromEmailForPyament} to ${emails} subject ${subjectForEODPayentReport} File:${file} Pdf:${pdf}`)
            sendmail.smtpAttachment(emails, `Club Marriott <${fromEmailForPyament}>` , subjectForEODPayentReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${pdf}`).then((data)=>{
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

let sendEOMPaymentReport=(file,pdf,emails,transactionIdsArr)=>{
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
            console.log(`fromEmailForPyament : ${fromEmailForPyament} to ${emails} subject ${subjectForEODPayentReport} File:${file} pdf:${pdf}`)
            sendmail.smtpAttachment(emails, `Club Marriott <${fromEmailForPyament}>` , subjectForEODPayentReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${pdf}`).then((data)=>{
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
            let replacements={name: (req.member_name ? req.member_name : ''),"membership_number":(req.membership_number__c ?req.membership_number__c:""),"membership_type":(req.membership_type_name ? req.membership_type_name:""),"email":(req.email__c ?req.email__c : ""),"amount":(req.membership_fee?req.membership_fee:0),"transaction_code":(req.transcationcode__c ? req.transcationcode__c :""),"date_time":dateTime1,"payment_mode":(req.payment_mode__c ? req.payment_mode__c: ""),"source":(req.source? req.source:"")};
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

            module.exports={
                sendMail,
                sendEODPaymentReport,
                sendEOMPaymentReport,
                sendMailForEachPayment
            }

        