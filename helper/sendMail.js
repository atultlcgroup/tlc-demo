const nodemailer = require('nodemailer');

const fs = require('fs')
const config = process.env;
const SMTPConfiguration = (mailData) => {
    const transporter = nodemailer.createTransport({
        host:  config.MAILER_HOST,
        port: config.MAILER_PORT,
        // secure: config.MAILER_SECURE,
        requireTLC:true, // true for 465, false for other ports
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
    console.log(`----------------------------`)    // if(!config.MAILER_FROM_EMAIL) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    console.log('Yes from here')
    const newMail = {
        to,
        from: from ,
        subject,
        text,
        html,
        attachments:[{
            filename: `logo-cm.png`,
            path: `./helper/logo-cm.png`,
            cid:'logocm'
        }]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
            resolve(res);
            
        }).catch((err) => {
            reject(err);
        });    
    })
      
}


const sendMailAttachment = (to, from, subject, text, html,file,pdf,fileName) => {
    console.log(`----------------------------`)
    console.log(`MAILER_HOST= ${config.MAILER_HOST},MAILER_PORT=${config.MAILER_PORT},MAILER_USER=${config.MAILER_USER},MAILER_PASSWORD = ${config.MAILER_PASSWORD},MAILER_SECURE=${config.MAILER_SECURE}`)
    console.log(`----------------------------`)    // if(!config.MAILER_FROM_EMAIL) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    const newMail = {
        to,
        from: from ,
        subject,
        text,
        html,
        attachments:[{
            filename: `${fileName}.xlsx`,
            path: `${file}`
        },{
            filename: `${fileName}.pdf`,
            path: `${pdf}`
        },
        {
            filename: `logo-cm.png`,
            path: `./helper/logo-cm.png`,
            cid:'logocm'
        }]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
             unlinkFiles(file)
             unlinkFiles(pdf)
            resolve(res);
        }).catch((err) => {
            unlinkFiles(file)
            unlinkFiles(pdf)
            reject(err);
        });    
    })
      
}



let unlinkFiles = (files)=>{
    fs.unlink(`${files}`, (err, da) => {
        if (err)
            return(`${err}`);
    })
}



const sendMailAttachmentDSR = (to, from, subject, text, html,file,fileName) => {
    console.log(`----------------------------`)
    console.log(`MAILER_HOST= ${config.MAILER_HOST},MAILER_PORT=${config.MAILER_PORT},MAILER_USER=${config.MAILER_USER},MAILER_PASSWORD = ${config.MAILER_PASSWORD},MAILER_SECURE=${config.MAILER_SECURE}`)
    console.log(`----------------------------`)    // if(!config.MAILER_FROM_EMAIL) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    const newMail = {
        to,
        from: from ,
        subject,
        text,
        html,
        attachments:[{
            filename: `${fileName}.pdf`,
            path: `${file}`
        },{
            filename: `logo-cm.png`,
            path: `./helper/logo-cm.png`,
            cid:'logocm'
        }]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
             unlinkFiles(file)
            //  unlinkFiles(pdf)
            resolve(res);
        }).catch((err) => {
            unlinkFiles(file)
            // unlinkFiles(pdf)
            reject(err);
        });    
    })
      
}

exports.smtp = (to, from, subject, text, html) => sendMail(to, from, subject, text, html, {}, 'smtp');
exports.smtpAttachment = (to, from, subject, text, html,file,pdf,fileName) => sendMailAttachment(to, from, subject, text, html, file,pdf,fileName);


exports.smtpAttachmentDSR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentDSR(to, from, subject, text, html, file,fileName);