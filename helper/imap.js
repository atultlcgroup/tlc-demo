const Imap = require('imap');
const fs = require('fs')

const simpleParser = require('mailparser').simpleParser;
const schedule = require('node-schedule');
let  dotenv = require('dotenv');
let UTRModel = require('../models/UTRReport')

dotenv.config();
let config = process.env
let replyParser = require("node-email-reply-parser");
let IMAP_FROM_EMAIL_IDS = (process.env.IMAP_FROM_EMAIL_IDS || '').split(',')
let imap = new Imap({
    user: config.EMAIL,
    password: config.PASSWORD,
    host: config.HOST,
    port: config.IMAP_PORT, // imap port
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 30000
});
console.log(`IMAP 1 FILE CALLED`)
let isRunning = false;

// module.exports = new CronJob('1 * * * * *', function() {
    let schedulerForImap =(scheduledTime)=> schedule.scheduleJob(scheduledTime, async()=>{
        console.log(`hi`)
    if(!isRunning){
        console.log('Job  Started, Next Scheduled in 1 Minute');
        try {
            imap.once('ready', function () {
                console.log('IMAP Connection Created');
                imap.openBox('INBOX', false, function (err, box) {
                    console.log('Inbox Opened');
                    if (err) {
                        // throw err
                        console.log('Inbox Error', null , 1);
                    };
                    imap.search(['UNSEEN'], function (err, results) {
                        console.log('Looking for Unseen Mail');
                        if (err) {
                            // throw err
                            console.log('Unseen Message Error', null, 1);
                        };
                        try{
                            var f = imap.fetch(results, { bodies: '', markSeen: true });
                            f.on('message', function (msg, seqno) {
                            isRunning = true;
                            console.log('Mail Fetched');
                            // //////console.log('Message #%d', seqno);
                            try{
                                msg.on('body', function (stream, info) {

                                    console.log('Reading Message Body');
                                    simpleParser(stream,async (err, mail) => {
                                        if (err) {
                                            // throw err
                                            console.log('Unseen Message Error', null, 1);
                                        };
                                        console.log('Mail Body Parsed');
                                        // //////console.log(mail.from);
                                        let toString = '';
                                        let fromString = '';
                                        let ccString = '';
                                        let attachmentsARR = [];
                                        let toArrr = []
                                        let ccArr = [] 
                                        let from = "";                                       
                                            mail.from.value.forEach(fromData => {
                                                if (fromData) {
                                                    from = fromData.address;
                                                    fromString =  fromData.address;
                                                }
                                            });
                                        if (mail.cc && mail.cc.value) {
                                            let bb= 1;
                                            mail.cc.value.forEach(ccData => {
                                                
                                                
                                                if (ccData && bb == 1  ) {
                                                    ccString =   ccData.address;
                                                    ccArr.push(ccData.address)
                                                }
                                                else if (ccData && bb >1  ) {
                                                    ccArr.push(ccData.address)

                                                    ccString = ccString + "," + ccData.address;
                                                }
                                                bb++;
                                            });
                                        }
                                        if (mail.to && mail.to.value) {
                                            let aa =1;
                                            mail.to.value.forEach(toData => {
                                                    if(aa == 1 &&  toData){
                                                        toArrr.push(toData.address)
                                                    toString =   toData.address;
                                                    }
                                                else if(toData && aa > 1 ) {
                                                    toArrr.push(toData.address)
                                                    toString = toString + "," + toData.address;
                                                }
                                                aa++;
                                            });
                                        }

                                            // console.log(`mail signature : ////////////////////////`)
                                            // console.log(mail.signature)
                                            
                                        if(mail.attachments && mail.attachments !== undefined){
                                            for(attachments of mail.attachments){
                                                attachmentsARR.push(attachments)
                                            }
                                        }
                                            
                                            var email = replyParser(mail.text);
    
                                            var myRegex =/[On]\s[A-Z][a-z]{2}[,]\s[A-Z][a-z]{2}\s[0-9]{2}[,]\s*[0-9]{4}\s*[a-z]{2}\s*[0-9]{1}[:][0-9]{2}\s*[A-Z]{2}/;

                                            var emailContent =  mail.text.split(myRegex)[0];
                                            var subjects =mail.subject;
                                            console.log(`====================================================================================================================`)
                                            console.log(`${ JSON.stringify(mail.from.value[0].address)}`)
                                            console.log(IMAP_FROM_EMAIL_IDS)
                                            if(IMAP_FROM_EMAIL_IDS.includes(mail.from.value[0].address) > -1  && (subjects.indexOf('Mis report for L358369_Tlc Relationship Management Pvt Ltd') > -1 || subjects.indexOf('UTR Report - L358369_TLC RELATIONSHIP MANAGEMENT PVT LTD') > -1) ){
                                                for(file of attachmentsARR){
                                                    let fileName = createtFileName(file.filename,'IMAP')
                                                    fs.writeFileSync("./reports/UTReport/"+fileName,new Buffer(file.content))
                                                     UTRModel.UTRReportFromImap('IMAP(auto email)',`${fileName}`,``)
                                                }
                                            }

                                        // var data = {
                                        //     "from": fromString,
                                        //     "to": toString,
                                        //     "cc": ccString,
                                        //     "reply": replyFlag,
                                        //     "message": emailContent || mail.textAsHtml,
                                        //     "subject": subjects ||mail.subject,
                                        //     "attachments": ''
                                        // }

                                        //////console.log('attachments');
                                        

                                                    //     attachments.forEach(async attachment => {
                                                    //     // var files = attachment.content; 
                                                    //     ////console.log('attachment',attachment)   
                                                    //     const fileId = await saveFile(res.data.data.userId, attachment);
                                                    //     //console.log('fileId', fileId)
                                                    //     const newdata = {"userId":res.data.data.userId,"task_id":res.data.data.taskId,"message":"","visibility":"all","files":[`${fileId}`]}
                                                    //     console.log('newdata', newdata);
                                                    //     jobComplete = true;
                                                    // });
                                    });
            
                                    // or, write to file
                                    //stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
                                });
                                msg.once('attributes', function (attrs) {
                                    //////console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                                });
                                msg.once('end', function () {
                                    console.log('Message Closed');
                                    //////console.log(prefix + 'Finished');
                                });
        
                                f.once('error', function (err) {
                                    //////console.log('Fetch error: ' + err);
                                    console.log('Message Connection Error', err, 1);
                                });
                                f.once('end', function () {
                                    //////console.log('Done fetching all messages!');
                                    console.log('Message Connection Ended');
                                    imap.end();
                                });
                            }catch(err){
                                jobComplete = true;
                                console.log('No Body to Fetch');
                            }
                        });
                        f.once('end', function() {
                            console.log('Done fetching all messages!');
                            imap.end();
                            isRunning = false;
                        });
                        f.once('error', function(err) {
                            imap.end();
                            isRunning = false;
                        });
                        }catch(err) {
                            console.log('No Mail to Fetcha');
                            imap.end();
                            isRunning = false;
                        } 
                    });
                });
            });
        
            imap.on('error', function (err) {
                jobComplete = true;
                console.log('IMAP Connection Creation Error', err, 1);
            });
        
            imap.once('end', function () {
                jobComplete = true;
                console.log('IMAP Connection Ended');
            });
            //console.log('imap connection status',imap.state);
            

                imap.connect();
            
                
        }catch(err) {
            console.log("Error While Connecting with IMAP", err, 1);
        }
    }
})


let createtFileName = (fileName,userid)=>{
    let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
    let fineNameWithoutFileExt = (fileName).replace(`.${extension}`,``)
    fileName = `${fineNameWithoutFileExt}_${userid}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.${extension}`  
    return fileName;

}
schedulerForImap(process.env.SCHEDULER_TIME_FOR_POS_IMAP || '* * * * *');

// module.exports={
//     schedulerForImap
// }




