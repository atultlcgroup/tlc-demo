const nodemailer = require('nodemailer');
const config = process.env
const SMTPConfiguration = (mailData) => {
    const transporter = nodemailer.createTransport({
        host: config.MAILER_HOST,
        port: config.MAILER_PORT,
        secure: config.MAILER_SECURE, // true for 465, false for other ports
        auth: {
            user: config.MAILER_USER,
            pass: config.MAILER_PASSWORD
        },tls:{
            ciphers:'SSLv3'
        }
    });
    return transporter.sendMail(mailData);
}
const sendMail = (to, from, subject, text, html) => {
    console.log(`----------------------------`)
    console.log(`MAILER_HOST= ${config.MAILER_HOST},MAILER_PORT=${config.MAILER_PORT},MAILER_USER=${config.MAILER_USER},MAILER_PASSWORD = ${config.MAILER_PASSWORD},MAILER_SECURE=${config.MAILER_SECURE}`)
    console.log(`----------------------------`)

    // if(!config.MAILER_FROM_EMAIL) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    const newMail = {
        to,
        from: from ,
        subject,
        text,
        html,
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
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


exports.smtp = (to, from, subject, text, html) => sendMail(to, from, subject, text, html, {}, 'smtp');


exports.sendgridAttachement = (to, from, subject, text, html, params, templateID ,files) => sendMailAttachement(to, from, subject, text, html, params, templateID, 'sendgrid' , files);