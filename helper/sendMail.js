const nodemailer = require('nodemailer');

const fs = require('fs')
const config = process.env;

let ReportType = [
{type: 'POS',logoName:'logo-cm.png',logoURL:'./helper/cm.png'},
{type: 'GM-POS',logoName:'os.png',logoURL:'./helper/os.png'},
{type: 'TAJ',logoName:'taj.png',logoURL:'./helper/taj.png'}];

const SMTPConfiguration = (mailData) => {
    const transporter = nodemailer.createTransport({
        host:  config.MAILER_HOST,
        port: config.MAILER_PORT,
        // secure: config.MAILER_SECURE,
        requireTLC:true, // true for 465, false for other ports
        auth: {
            user: config.MAILER_USER,
            pass: config.MAILER_PASSWORD
        }
        ,tls:{
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



const sendMailAttachmentDSR = (to, from, subject, text, html,file,excelFile,fileName) => {
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
            filename: `${fileName}.xlsx`,
            path: `${excelFile}`
        }
        ,{
            filename: `logo-cm.png`,
            path: `./helper/logo-cm.png`,
            cid:'logocm'
        }]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
             unlinkFiles(file)
             unlinkFiles(excelFile)
            resolve(res);
        }).catch((err) => {
            unlinkFiles(file)
            unlinkFiles(excelFile)
            reject(err);
        });    
    })
      
}


const sendMailAttachmentFR = (to, from, subject, text, html,file,fileName) => {
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

const sendMailAttachmentRR = (to, from, subject, text, html,file,fileName) => {
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

const sendMailAttachmentDRR = (to, from, subject, text, html,file,fileName) => {
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
const sendMailAttachmentUTR = (to, from, subject, text, html,file,fileName) => {
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

//POS mailer
const sendMailAttachmentPOSError = (to, from, subject, text, html,file,fileName,logoName) => {
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
            filename: `${fileName}.csv`,
            path: `${file}`
        // },
        // {
        //     filename: `${fileName}a.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}b.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}c.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}d.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}e.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}f.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}g.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}h.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}i.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}j.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}k.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}l.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}m.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}n.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}o.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}p.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}q.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}r.csv`,
        //     path: `${file}`
        // },{
        //     filename: `${fileName}s.csv`,
        //     path: `${file}`
        },{
            filename: `${logoName}`,
            path: `./helper/${logoName}`,
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

//End pos mailer



exports.smtp = (to, from, subject, text, html) => sendMail(to, from, subject, text, html, {}, 'smtp');
exports.smtpAttachment = (to, from, subject, text, html,file,pdf,fileName) => sendMailAttachment(to, from, subject, text, html, file,pdf,fileName);


exports.smtpAttachmentDSR = (to, from, subject, text, html,file,excelFile,fileName) => sendMailAttachmentDSR(to, from, subject, text, html, file,excelFile,fileName);
exports.smtpAttachmentUTR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentUTR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentPOSError = (to, from, subject, text, html,file,fileName,logoNmae) => sendMailAttachmentPOSError(to, from, subject, text, html, file,fileName,logoNmae);
exports.smtpAttachmentFR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentFR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentRR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentRR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentDRR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentDRR(to, from, subject, text, html, file,fileName);
