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
        }
    });
    return transporter.sendMail(mailData);
}
const sendMail = (to, from, subject, text, html) => {
    console.log(`----------------------------`)
    console.log(config)
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



exports.smtp = (to, from, subject, text, html) => sendMail(to, from, subject, text, html, {}, 'smtp');