const sendmail = require('../helper/sendMail')


const from=process.env.FROM_MAIL || "";
const to=process.env.TO_MAIL || "";
const subject =process.env.MAIL_SUBJECT || "";
const fs = require('fs');
const handlebars = require('handlebars');
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
                replacements={"error":'error',body: 'JSON.stringify(req.body)',header:'JSON.stringify(req.headers)',query:'JSON.stringify(req.query)',url:'uyi',"unique_id":'unique_id'};
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


            module.exports={
                sendMail
            }