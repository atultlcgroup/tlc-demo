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
        attachments:[]
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



const sendMailAttachmentDSR = (to, from, subject, text, html,file,excelFile,sfdcFile,fileName) => {
    console.log(`----------------------------`)
    console.log(`MAILER_HOST= ${config.MAILER_HOST},MAILER_PORT=${config.MAILER_PORT},MAILER_USER=${config.MAILER_USER},MAILER_PASSWORD = ${config.MAILER_PASSWORD},MAILER_SECURE=${config.MAILER_SECURE}`)
    console.log(`----------------------------`)    // if(!config.MAILER_FROM_EMAIL) console.log(`MAILER_FROM_EMAIL not specified. Using provided in argument: ${from}`);
    let newMail=``
 
    // console.log(attachments)
    if(sfdcFile){
        let attachments = [{
            filename: `${fileName}.pdf`,
            path: `${file}`
        },{
            filename: `${fileName}.xlsx`,
            path: `${excelFile}`
        }
        ]
        console.log(`-----------`)
        console.log(JSON.stringify(sfdcFile))
        for(d of sfdcFile){
            attachments.push({filename: `${d.sequenceNumber}.${d.extension}` ,
           path: `${d.url}`})
        }
         newMail = {
            to,
            from: from ,
            subject,
            text,
            html,
            attachments:attachments
        };
      
    }else{
         newMail = {
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
            }]
        };
      
    }
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
             unlinkFiles(file)
             unlinkFiles(excelFile)
             if(sfdcFile){
                for(d of sfdcFile){
                    unlinkFiles(d.url)
                }             
            }
            resolve(res);
        }).catch((err) => {
            unlinkFiles(file)
            unlinkFiles(excelFile)
            if(sfdcFile){
                for(d of sfdcFile){
                    unlinkFiles(d.url)
                }
            }
            reject(err);
        });    
    })
      
}

//senf FR report started

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
//send FR report ended


//Send RR report started
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
//Send RR report ended

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



// CM new Enroll 
//POS mailer

const sendMailAttachmentNewEnroll = (to, from, subject, text, html,file,fileName) => {
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
            //  unlinkFiles(pdf)
            resolve(res);
        }).catch((err) => {
            unlinkFiles(file)
            // unlinkFiles(pdf)
            reject(err);
        });    
    })
      
}


//Send email for tally 


const sendMailForTally = (to, from, subject, text, html) => {
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
        attachments:[
            {
                filename: `logo-cm.png`,
                path: `./helper/logo-cm.png`,
                cid:'logocm'
            }]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
            //  console.log(`mail sent successfully!`)
            resolve(res);
            
        }).catch((err) => {
            reject(err);
        });    
    })
      
}


/**
 * Send emails for Export String Report 
 */
 const smtpAttachmentExportString = (to, from, subject, text, html , files) => {
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
        attachments:[
            {
                filename: `${files[0].fileName}.xlsx`,
                path: `${files[0].filePath}`
            },
            {
                filename: `${files[1].fileName}.xlsx`,
                path: `${files[1].filePath}`
            },
            {
                filename: `${files[2].fileName}.xlsx`,
                path: `${files[2].filePath}`
            },
            {
                filename: `${files[3].fileName}.xlsx`,
                path: `${files[3].filePath}`
            }
        ]
    };
    return new Promise((resolve, reject) => {
         SMTPConfiguration(newMail).then((res) => {
            //  console.log(`mail sent successfully!`)
            for(let d of files)
            unlinkFiles(d.filePath);
            resolve(res);
            
        }).catch((err) => {
            for(let d of files)
            unlinkFiles(d.filePath);
            reject(err);
        });    
    })
      
}

exports.smtp = (to, from, subject, text, html) => sendMail(to, from, subject, text, html, {}, 'smtp');
exports.smtpAttachment = (to, from, subject, text, html,file,pdf,fileName) => sendMailAttachment(to, from, subject, text, html, file,pdf,fileName);


exports.smtpAttachmentDSR = (to, from, subject, text, html,file,excelFile,sfdcFile,fileName) => sendMailAttachmentDSR(to, from, subject, text, html, file,excelFile,sfdcFile,fileName);
exports.smtpAttachmentUTR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentUTR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentPOSError = (to, from, subject, text, html,file,fileName,logoNmae) => sendMailAttachmentPOSError(to, from, subject, text, html, file,fileName,logoNmae);
exports.smtpAttachmentFR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentFR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentRR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentRR(to, from, subject, text, html, file,fileName);
exports.smtpAttachmentDRR = (to, from, subject, text, html,file,fileName) => sendMailAttachmentDRR(to, from, subject, text, html, file,fileName);

exports.smtpAttachmentNewEnroll = (to, from, subject, text, html,file,fileName) => sendMailAttachmentNewEnroll(to, from, subject, text, html, file,fileName);

exports.sendMailForTally = (to, from, subject, text, html) => sendMailForTally(to, from, subject, text, html, {}, 'smtp');

exports.smtpAttachmentExportString = (to, from, subject, text, html , files) => smtpAttachmentExportString(to, from, subject, text, html, files , {}, 'smtp');


