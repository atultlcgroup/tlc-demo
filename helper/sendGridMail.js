const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
let addSubstitutions = function (mail, variables) {
    mail["substitutions"] = variables;
}




const sendgridConfiguration = (mailData, params, templateID) => {
    let apiKey = process.env.SENDGRID_API_KEY || "";
    console.log(apiKey)
    sgMail.setApiKey(apiKey);
    sgMail.setSubstitutionWrappers('<%', '%>');
    mailData.templateId = templateID;
    addSubstitutions( mailData , params );
    if(!apiKey) console.log(`SENDGRID_API_KEY not specified.`);
    return sgMail.send(mailData)      
}

const sendMail = (to, from, subject, text, html, params, templateID, type ) => {
            if(!process.env.EMAIL_FOR_PAYMENT_REPORT) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
            const newMail = {
                to,
                from: from ,
                subject,
                text,
                html,
            };
            return new Promise((resolve, reject) => {
                    mail = sendgridConfiguration(newMail, params, templateID )
                mail.then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject(err);
                });    
            })
}



const sendgridConfigurationFiles = (mailData, params, templateID ,files) => {
    let apiKey = process.env.SENDGRID_API_KEY || "";
    console.log(apiKey)
    sgMail.setApiKey(apiKey);
    sgMail.setSubstitutionWrappers('<%', '%>');
    mailData.templateId = templateID;
    mailData.attachments = files
    addSubstitutions( mailData , params );
    if(!apiKey) console.log(`SENDGRID_API_KEY not specified.`);
    return sgMail.send(mailData)      
}





const sendMailAttachement = (to, from, subject, text, html, params, templateID, type,files ) => {
    if(!process.env.EMAIL_FOR_PAYMENT_REPORT) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    const newMail = {
        to,
        from: from ,
        subject,
        text,
        html,
        files,
    };
    return new Promise((resolve, reject) => {
            mail = sendgridConfigurationFiles(newMail, params, templateID ,files)
        mail.then((res) => {
            resolve(res);
        }).catch((err) => {
            reject(err);
        });    
    })
}





exports.sendgrid = (to, from, subject, text, html, params, templateID) => sendMail(to, from, subject, text, html, params, templateID, 'sendgrid' );







exports.sendgridAttachement = (to, from, subject, text, html, params, templateID ,files) => sendMailAttachement(to, from, subject, text, html, params, templateID, 'sendgrid' , files);