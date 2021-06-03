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
// const fromEmailForFR = process.env.FROM_EMAIL_FOR_FR || "";
// const fromEmailForRR = process.env.FROM_EMAIL_FOR_RR || "";




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

let sendMailForEachPayment = async(req,toEmails, emailSubject, transaction_id, dynamicValues)=>{
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
            let displayName = dynamicValues[0].display_name_epr__c || ''
            let fromEmailForPyament = dynamicValues[0].from_email_id_epr__c || ''
            let replacements={"footer" : dynamicValues[0].footer_epr__c , "brandLogo" : dynamicValues[0].brand_logo__c ,name: (req.member_name ? req.member_name : ''),"membership_number":(req.membership_number__c ?req.membership_number__c:""),"membership_type":(req.membership_type_name ? req.membership_type_name:""),"email":(req.email__c ?req.email__c : ""),"amount":(req.membership_amount?req.membership_amount:0),"fee":(req.membership_fee?req.membership_fee:0),"transaction_code":(req.transcationcode__c ? req.transcationcode__c :""),"date_time":dateTime1,"payment_mode":(req.payment_mode__c ? req.payment_mode__c: ""),"source":(req.source? req.source:"")};
            let htmlToSend = template(replacements);
            console.log(`toEmails : ${toEmails}`)
            sendmail.smtp(toEmails, `${displayName} <${fromEmailForPyament}>` , emailSubject,`${htmlToSend}` , `${htmlToSend}`).then(async(data)=>{
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


let sendDSRReport=(file,excelFile,sfdcFile,fileName,emails , dynamicValues , program_name)=>{
    try{
        readHTMLFile(__dirname + `/DSR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDSRReport= new Date();
            dateforEOMReport = `${dateForDSRReport.toLocaleString('default', { month: 'short' })} ${dateForDSRReport.getFullYear()}`
            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_dsr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
           let displayName = dynamicValues[0].display_name_dsr__c || '';
           const fromEmailForDSR = dynamicValues[0].from_email_id_dsr__c || '';
           const subjectForDSRReport = dynamicValues[0].dsr_subject_name || '';

            console.log(`fromEmailForDSR : ${fromEmailForDSR} to ${emails} subject ${subjectForDSRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentDSR(emails, `${displayName} <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${excelFile}`,sfdcFile,`${fileName}`).then((data)=>{
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


//Send FR report started
let sendFReport=(file,fileName,emails,dynamicValues,program_name)=>{
    try{
        readHTMLFile(__dirname + `/FR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForFReport= new Date();
            console.log("sendFR report",dynamicValues)
            //let subjectForFReport = `Club Marriott | Feedback Report`
            let subjectForFReport = dynamicValues[0].subject_fr__c || '';
            let fromEmailForFR =  dynamicValues[0].from_email_id_fr__c || '';
            let displayName  = dynamicValues[0].display_name_fr__c || '';
            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_fr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForFR : ${fromEmailForFR} to ${emails} subject ${subjectForFReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentFR(emails, `${displayName} <${fromEmailForFR}>` , subjectForFReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
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

//Send FR report started ended



let sendDRReport=(file,fileName,emails, dynamicValues, program_name)=>{
    try{
        readHTMLFile(__dirname + `/DRR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDRReport= new Date();
            const subjectForDRReport = dynamicValues[0].drr_subject_name || '';
            let template = handlebars.compile(html);
            
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_drr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
           const fromEmailForDRR = dynamicValues[0].from_email_id_drr__c || '';
           let displayName = dynamicValues[0].display_name_drr__c || '';
            console.log(`fromEmailForRR : ${fromEmailForDRR} to ${emails} subject ${subjectForDRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentDRR(emails, `${displayName} <${fromEmailForDRR}>` , subjectForDRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
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

//send RR report started
let sendRReport=(file,fileName,emails,dynamicValues,program_name)=>{
    try{
        readHTMLFile(__dirname + `/RR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForRReport= new Date();
            console.log("dynamicValuesMail",dynamicValues);
            let subjectForRReport = dynamicValues[0].subject_rr__c || '';
            let fromEmailForRR =  dynamicValues[0].from_email_id_rr__c || '';
            let displayName  = dynamicValues[0].display_name_rr__c || '';
            //let subjectForRReport = `Club Marriott | Todays Reservation Report` 
            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_rr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForRR : ${fromEmailForRR} to ${emails} subject ${subjectForRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentRR(emails, `${displayName} <${fromEmailForRR}>` , subjectForRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
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

//send RR report ended

let sendUTRReport=(file,fileName,emails, dynamicValues, program_name)=>{
    try{
        readHTMLFile(__dirname + `/UTR_Report.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDSRReport= new Date();
            dateforEOMReport = `${dateForDSRReport.toLocaleString('default', { month: 'short' })} ${dateForDSRReport.getFullYear()}`
            let subjectForUTRReport = dynamicValues[0].utr_subject_name || '';
            const fromEmailForUTR = dynamicValues[0].from_email_id_utr__c || '';
            let displayName = dynamicValues[0].display_name_utr__c
            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_utr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForUTR : ${fromEmailForUTR} to ${emails} subject ${subjectForUTRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentUTR(emails, `${displayName} <${fromEmailForUTR}>` , subjectForUTRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
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
let sendPOSErrorReport=(file,fileName,emails,logoName,dynamicValues,program_name)=>{

    try{
        readHTMLFile(__dirname + `/posError.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForPOSErrorReport= new Date();
            dateforEOMReport = `${dateForPOSErrorReport.toLocaleString('default', { month: 'short' })} ${dateForPOSErrorReport.getFullYear()}`
            //let subjectForPOSErrorReport = `POS Error Report`
            let fromEmailForPOSError=dynamicValues[0].from_email_id_pos__c || `` ;
            let subjectForPOSErrorReport=dynamicValues[0].subject_pos__c || ``;
            let displayName=dynamicValues[0].display_name_pos__c || `` ;

            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_pos__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForPOSError : ${fromEmailForPOSError} to ${emails} subject ${subjectForPOSErrorReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentPOSError(emails, `${displayName} <${fromEmailForPOSError}>` , subjectForPOSErrorReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`,logoName).then((data)=>{
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

// update log for new enrollment 
let updateLogForNewEnroll = async(insertedId, isEmailSent ,status, errorDescription )=>
{
    try{
    await pool.query(`update  tlcsalesforce.reports_log set "isEmailSent"=${isEmailSent} , status= '${status}', "errorDescription"='${errorDescription}'  where id = ${insertedId}`)
    }catch(e){
        console.log(e)
    }
}


//ClubMarriott New Enroll




let sendCMNewEnroll=(file,fileName,emails,program_name , logId)=>{

    try{
        readHTMLFile(__dirname + `/CMNew_Enroll.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForCMnewEnrollReport= new Date();
            dateforCMnewEnrollReport = `${dateForCMnewEnrollReport.toLocaleString('default', { month: 'short' })} ${dateForCMnewEnrollReport.getFullYear()}`
            //let subjectForPOSErrorReport = `POS Error Report`
            let fromEmailForCMNewEnroll=`mis@clubmarriott.in` ;
            let subjectForCMNewEnroll=`Club Marriott | New Enrollments `;
            let displayName=`Club Marriott` ;

            let template = handlebars.compile(html);
            replacements={"programName": program_name};
           let htmlToSend = template(replacements);
            console.log(`fromEmailForNewEnroll : ${fromEmailForCMNewEnroll} to ${emails} subject ${subjectForCMNewEnroll} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentNewEnroll(emails, `${displayName} <${fromEmailForCMNewEnroll}>` , subjectForCMNewEnroll,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{
                    updateLogForNewEnroll(logId, 'true' ,'Success', `` )
                // updatePayentLog(transactionIdsArr,'SUCCESS')
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        updateLogForNewEnroll(logId, 'false' ,'Error', `${err}` )
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





//Monthly Sales Report
let sendDSRReportMonthly=(file,excelFile,sfdcFile,fileName,emails , dynamicValues , program_name)=>{
    try{
        readHTMLFile(__dirname + `/DSR_Report_Monthly.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let dateForDSRReport= new Date();
            dateforEOMReport = `${dateForDSRReport.toLocaleString('default', { month: 'short' })} ${dateForDSRReport.getFullYear()}`
            let template = handlebars.compile(html);
            replacements={"programName": program_name , "footer" :  dynamicValues[0].footer_dsr__c , "brandLogo": dynamicValues[0].brand_logo__c};
           let htmlToSend = template(replacements);
           let displayName = dynamicValues[0].display_name_dsr__c || '';
           const fromEmailForDSR = dynamicValues[0].from_email_id_dsr__c || '';
           const subjectForDSRReport = dynamicValues[0].dsr_subject_name || '';

            console.log(`fromEmailForDSR : ${fromEmailForDSR} to ${emails} subject ${subjectForDSRReport} File:${file} fileName:${fileName}`)
             sendmail.smtpAttachmentDSR(emails, `${displayName} <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${excelFile}`,sfdcFile,`${fileName}`).then((data)=>{
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



//Send mail to account team for tally GST Number And State Mismatch

let sendMailForGSTAndStateMisMatch = async(req,toEmails , logId)=>{
    try{
        readHTMLFile(__dirname + `/Mismatch_In_GST_N_State_Tally.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let template = handlebars.compile(html);
            // replacements={"name":`${req.name}`,"membership_number":`${req.membership_number}`,"membership_type":`${req.membership_type}`,"email":`${req.email}`,"amount":`${req.amount}`,"transaction_code":`${req.transaction_code}`,"date_time":`${req.date_time}`,"payment_mode":`${req.payment_mode}`,"source":`Web`};
            let dateFormat1 = ( req.createddate? req.createddate:  "")
            let dateTime1 = ``
            if(formatDate){
                // dateTime1 = formatDate(dateFormat1)
            }
            let displayName = `Club Marriott` ;
            let fromEmailForPyament =  `<mis@clubmarriott.in>`;
            let memberaddress = req.billingstreet ? req.billingstreet : ``;
            memberaddress += ', ';
            memberaddress += req.address_line_2__c ? req.address_line_2__c : ``
           let membershipTypeName =  req.membership_type_name__c ? req.membership_type_name__c : ``;
           if(!membershipTypeName)
           membershipTypeName =  req.membership_type_name ? req.membership_type_name: ``;
            let replacements={transaction_code : req.transcationcode__c ? req.transcationcode__c : ``,certificate : req.certificate_name ? req.certificate_name : ``,date_time : req.createddate ? req.createddate : ``,"membership_type" : membershipTypeName ,"amount" : req.grand_total__c ? req.grand_total__c : 0,gstnumber : req.member_gst_details__c ? req.member_gst_details__c : ``,pincode: req.billingpostalcode ? req.billingpostalcode : ``,state: req.billingstate ? req.billingstate : ``,country : req.billingcountry ? req.billingcountry : ``,address :memberaddress,name: req.name ? req.name : '',"membership_number":(req.membership_number__c ?req.membership_number__c:""),"email":(req.email__c ?req.email__c : "")};
            let htmlToSend = template(replacements);
            let emailSubject = `Club Marriott | Mismatch in State and GST State Code`;
            console.log(`toEmails : ${toEmails}`)
            sendmail.sendMailForTally(toEmails, `${displayName} ${fromEmailForPyament}` , emailSubject,`${htmlToSend}` , `${htmlToSend}`).then(async(data)=>{
                pool.query(`UPDATE tlcsalesforce.reports_log
                SET  "isEmailSent"=true ,status = 'SUCCESS' 
                WHERE id='${logId}'`)  
                                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch(async(err)=>{
        pool.query(`UPDATE tlcsalesforce.reports_log
        SET  "errorDescription"='${err}' ,status = 'ERROR' 
        WHERE id='${logId}'`)  
        console.log(err)
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
    }catch(e)
   {
       return   `${e}`
   } 
}




//send mail for ExportString

let sendExportSrtingReport=(files, emails , dynamicValues , program_name , logId)=>{
    try{
        // console.log(`dynamic values --------------------------------`);
        console.log(dynamicValues);
        readHTMLFile(__dirname + `/Export_String.html`, function(err, html) {
            console.log('hi')
            if(err)
            console.log(err)
            let template = handlebars.compile(html);
            replacements={"brandLogo":dynamicValues[0].brand_logo__c,"programName":program_name ,"footer":dynamicValues[0].footer_es__c};
           let htmlToSend = template(replacements);
           let displayName = dynamicValues[0].display_name_es__c || '';
           const fromEmailForDSR = dynamicValues[0].from_email_id_es__c || '';
           const subjectForDSRReport = dynamicValues[0].es_subject_name || '';
           
            console.log(`fromEmailForEXPORTSTING : ${fromEmailForDSR} to ${emails} subject ${subjectForDSRReport}`);
            // console.log(files)
             sendmail.smtpAttachmentExportString(emails, `${displayName} <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,files).then((data)=>{
                // sendmail.smtpAttachmentDSR(['atul.srivastava@tlcgroup.com','shubham.thute@tlcgroup.com','shailendra@tlcgroup.com'], `Club Marriott <${fromEmailForDSR}>` , subjectForDSRReport,`${htmlToSend}` , `${htmlToSend}`,`${file}`,`${fileName}`).then((data)=>{

                // updatePayentLog(transactionIdsArr,'SUCCESS')
                pool.query(`UPDATE tlcsalesforce.reports_log
                SET  "isEmailSent"=true ,status = 'SUCCESS' 
                WHERE id='${logId}'`)  
                console.log(`Email Sent Successfully`)
        // res.status(200).send(`email sent from: ${from} to: ${to}`)
    }).catch((err)=>{
        // res.status(500).send(`${JSON.stringify(err)}`)
        // updatePayentLog(transactionIdsArr,'FAILED')
        console.log(err)
        pool.query(`UPDATE tlcsalesforce.reports_log
        SET status = 'FAILED' 
        WHERE id='${logId}'`)  
        console.log(`Email snet has err :${JSON.stringify(err)}`)
    })
    })
  

    }catch(e){
        console.log(`Email snet has err :${JSON.stringify(e)}`)
    }
}      




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
                sendDRReport,
                sendCMNewEnroll,
                sendDSRReportMonthly,
                sendMailForGSTAndStateMisMatch,
                sendExportSrtingReport
            }

        