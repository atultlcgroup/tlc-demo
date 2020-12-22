let MailListener = require("mail-listener4");
let UTRModel = require('./models/UTRReport')
const fs = require('fs')
let  dotenv = require('dotenv');
dotenv.config();
let config = process.env

//
console.log(config.EMAIL ,config.PASSWORD , config.HOST , config.PORT)
let mailListener = new MailListener({
    username: config.EMAIL,
    password: config.PASSWORD,
    host: config.HOST,
    port: config.IMAP_PORT, // imap port
    tls: true,
    connTimeout: 10000, // Default by node-imap
    authTimeout: 5000, // Default by node-imap,
  //   debug: console.log, // Or your custom function with only one incoming argument. Default: null
    tlsOptions: { rejectUnauthorized: false },
    mailbox: "INBOX", // mailbox to monitor
    searchFilter: ["UNSEEN"], // the search filter being used after an IDLE notification has been retrieved
    markSeen: true, // all fetched email willbe marked as seen and not fetched next time
    fetchUnreadOnStart: true, // use it only if you want to get all unread email on lib start. Default is `false`,
    mailParserOptions: {streamAttachments: true}, // options to be passed to mailParser lib.
    attachments: true, // download attachments as they are encountered to the project directory
    attachmentOptions: { directory: "attachments/" } // specify a download directory for attachments
  });

let IMAPMAINFUNCTION=()=>{
//
//api call check 
    mailListener.start(); // start listening
        mailListener.on("server:connected", function(){
        console.log(`imapConnected`)
        });
        mailListener.on("mail", async function(mail, seqno, attributes){
            console.log('mail in chat called', "yes called")
            console.log(`====================================================================================================================`)
            // console.log(`${JSON.stringify(mail)}`)
            console.log(`====================================================================================================================`)
            let  message = mail.text;
            let from = mail.from[0].address
            let to = mail.to[0].address  
            let ccArr = [];
            if(mail.cc && mail.cc !== undefined){
                    for(cc of mail.cc){
                        ccArr.push(cc.address)
                    }
            }
            let toArrr = []
            if(mail.to && mail.to !== undefined){
                for(to of mail.to){
                    toArrr.push(to.address)
                }
            }
            let subject = mail.subject ;
            let message_id = mail.messageId ;
            let priority = mail.priority ;
            let attachmentsArr= []
            
            if(mail.attachments && mail.attachments !== undefined){
                for(attachments of mail.attachments){
                    attachmentsArr.push(attachments)
                }
            }
             
            // get the api token 
                console.log('mail in chat called', "Success")

        })


    mailListener.on("attachment",async function(attachment){
        console.log("Attachement")        
        let file = fs.createWriteStream("./reports/UTReport/"+createtFileName(attachment.fileName,'1234'));
        file.on('pipe',(file)=>{
            console.log('Test download ') 
            }); 
    attachment.stream.pipe(file)
            console.log(`GENERATED FILENAME =${createtFileName(attachment.fileName,'1234')}`)
            await UTRModel.UTRReport('1234',`${createtFileName(attachment.fileName,'1234')}`,``)
    });
    
    // mailListener.on("server:disconnected", function(){
    // console.log("imapDisconnected");
    // // IMAPMAINFUNCTION();
    // console.log(`imapDisconnected`)
    // return  1;
    // });
    // return 0;
    // stop listening
}

let createtFileName = (fileName,userid)=>{
    let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
    let fineNameWithoutFileExt = (fileName).replace(`.${extension}`,``)
    fileName = `${fineNameWithoutFileExt}_${userid}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.${extension}`  
    return fileName;

}


IMAPMAINFUNCTION()
// module.exports = {IMAPMAINFUNCTION};
// mailListener.on("error", function(err){
//   console.log(err);
// });








// IMAPMAINFUNCTION();