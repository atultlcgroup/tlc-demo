const pool = require("../databases/db").pool;
const dotenv = require('dotenv');


dotenv.config();

let logInApiURLOfSfdc = process.env.SFDC_LOGIN_API_URL || '';
let sfdcGrandType = process.env.SFDC_LOGIN_GRAND_TYPE || '';
let sfdcLoginClientSecret = process.env.SFDC_LOGIN_CLIENT_SECRET || '';
let sfdcLoginClientId = process.env.SFDC_LOGIN_CLIENT_ID || '';
let sfdcLoginUserName = process.env.SFDC_LOGIN_USER_NAME || '';
let sfdcLoginPassword = process.env.SFDC_LOGIN_PASSWORD || '';
let sfdcFileApisURL = process.env.SFDC_FILE_APIS_URL || '';
let token = ``
let clubMarriottProgramUniqueIdentifier =  process.env.CLUB_MARRIOTT_PROGRAM_UNIQUE_IDENTIFIER
const qs = require('qs');
const axios = require('axios');

let loginApiCall = async ()=>{
    console.log(`hi from here`)
    let data = qs.stringify({
        'grant_type':  `${sfdcGrandType}`,
       'client_id': `${sfdcLoginClientId}`,
       'client_secret': `${sfdcLoginClientSecret}`,
       'username': `${sfdcLoginUserName}`,
       'password': `${sfdcLoginPassword}` 
       });
       let config = {
         method: 'post',
         url: `${logInApiURLOfSfdc}/services/oauth2/token`,
         data : data
        };
       try{
           let data =await axios(config)
            return {code: data.status ,msg : data.data}

            // return (JSON.stringify(data.data))
    }catch (error) {
            console.log(error)
           throw {code: error.response.status, msg: error.response.data }
       }
}

let getRecordFromOtpLog = async(hr)=>{
    try {
        let qry = `select distinct "Mobile" ,(select "OTP Request Date/Time" from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" order by "OTP Request Date/Time" desc limit 1) created_at,(select count(*) from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1) number_of_attempt from tlcsalesforce.otp_log ol where  "OTP Request Date/Time" > NOW() - INTERVAL  '${hr} hour 15 minute' and "OTP Request Date/Time" <= NOW() - INTERVAL  '15 minute' and "OTP For" = 'verifyMobile'`;
        // let qry = `select distinct "Mobile" ,(select "OTP Request Date/Time" from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1) created_at,DATE((select "OTP Request Date/Time" from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1)) created_at,(select count(*) from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1) number_of_attempt from tlcsalesforce.otp_log  ol where   "OTP For" = 'verifyMobile'`;
        console.log(qry)
        let record = await pool.query(qry)
        return record.rows ? record.rows : [];
    } catch (error) {
        return [];
    }
}




let getAccountData = async(token , hr , mobileStr)=>{
    console.log(`hi from here`)
    let data = {
        'grant_type':  `${sfdcGrandType}`,
       'client_id': `${sfdcLoginClientId}`,
       'client_secret': `${sfdcLoginClientSecret}`,
       'Authorization': `Bearer ${token}`
       };
       let dateTime = (new Date((new Date()).getTime() + 330*60000 - (hr * 60 * 60 * 1000))).toISOString();
    //    console.log(`${sfdcFileApisURL}/services/data/v47.0/query?q=select id, createdDate,PersonEmail,PersonMobilePhone  from Account where PersonMobilePhone IN(${mobileStr})`)
    // console.log(`${sfdcFileApisURL}/services/data/v47.0/query?q=select id, createdDate,PersonEmail,PersonMobilePhone  from Account where createdDate >  2021-03-01T19:26:58.523Z`)   
    // console.log(data)
    let  config = {
        method: 'get',
    //    url: `${sfdcFileApisURL}/services/data/v47.0/query?q=select id, createdDate,PersonEmail,PersonMobilePhone  from Account where PersonMobilePhone IN(${mobileStr})`,
       url: `${sfdcFileApisURL}/services/data/v47.0/query?q=select id, createdDate,PersonEmail,PersonMobilePhone  from Account`,
        headers: data
      };
       try{
           let data =await axios(config)
            return {code: data.status ,msg : data.data}

            // return (JSON.stringify(data.data))
       }catch (error) {
            console.log(error)
           throw {code: error.response.status, msg: error.response.data }
       }
}

let getUserDataFromSFDC=async(hr,mobileStr)=>{
  try {
    let data = await loginApiCall()
    token = data.msg.access_token  || ``;
    console.log(`-------token----------`)
    console.log(token)
    let accountData = await getAccountData(token , hr , mobileStr)
    if(accountData.msg.records.length)
    return accountData.msg.records
    else
    return [];

  } catch (error) {
    console.log(error)
  }
}
let getNotRegisterUsers= async(otpLogData, accountData)=>{
    try {
        let notRegisteredUsers = [];
        for(let a of otpLogData){
            let find = 0;
            for(let b of accountData){
                if(a['Mobile'] == b.PersonMobilePhone)
                find = 1
            }
            if(find == 0 && a['Mobile'] )
            notRegisteredUsers.push(a)
        }
        return notRegisteredUsers;
    
    } catch (error) {
        console.log(error) 
    }
}
let createCaseInSfdc = async(notRegisteredUsers)=>{
    try {
        // notRegisteredUsers = [notRegisteredUsers[0]]
        if(!token){
            let data = await loginApiCall()
            token = data.msg.access_token  || ``;
        }
        notRegisteredUsers.map(async d=>{
            let data = JSON.stringify({"Subject":`Drop off after Mobile verification - ${d["Mobile"]}`,"Description":"","Mobile__c":`${d["Mobile"]}`,"Email__c":`` , "program_identifier__c":`${clubMarriottProgramUniqueIdentifier}` , "OTP_Request_Date_and_Time__c": `${d.created_at.toISOString()}`});
            let config = {
                method: 'post',
                url: `${sfdcFileApisURL}/services/data/v47.0/sobjects/Case/`,
                headers: { 
                    'grant_type':  `${sfdcGrandType}`,
                    'client_id': `${sfdcLoginClientId}`,
                    'client_secret': `${sfdcLoginClientSecret}`,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data : data
              };
               try{
                   let data =await axios(config)
                     console.log({code: data.status ,msg : data.data})
                    // return (JSON.stringify(data.data))
               }catch (error) {
                    console.log(error)
                   console.log({code: error.response.status, msg: error.response.data })
               }
        })
        return `success`;
    } catch (error) {
        return ``
    }
}


function arrayToCSV (data) {
    csv = data.map(row => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    let dataforCSV= csv.join('\n');
    console.log(`hiiiiiiiiiiiiiiiiiii`)
    let file = `Drop off after Mobile verification${require('dateformat')(new Date(), "yyyymmddhMMss")}.csv`;
    var fs = require('fs');

    fs.writeFile(file,dataforCSV , function (err) {
      if (err) throw err;
      console.log('Saved!');
    });
    
      return file
}

let getMobileStr = (otpLogArr)=>{
    try {
        let mobileStr = otpLogArr.map(d=>`'${d["Mobile"]}'` )
      return `${mobileStr.join(",")}`; 
    } catch (error) {
        return ``
    }
}
let mobileVerificationCase=async()=>{
    try {
        let hr = 1;
        let otpLogData = await getRecordFromOtpLog(hr);
        console.log(otpLogData.length)
        if(otpLogData.length){
            let mobileStr = getMobileStr(otpLogData)

            // console.log(mobileStr)
            let userDataFromSFDC = await getUserDataFromSFDC(hr,mobileStr);
            console.log(userDataFromSFDC.length)
            let notRegisteredUsers = await getNotRegisterUsers(otpLogData , userDataFromSFDC)
            console.log(notRegisteredUsers.length)
            // let data =await arrayToCSV(notRegisteredUsers)
            // console.log(dateFormat)
            let createCaseInSFDC = await createCaseInSfdc(notRegisteredUsers)
        }
 
        return `Success`
    } catch (error) {
        return `${error}`
    }
}

mobileVerificationCase();
module.exports={
    mobileVerificationCase
}
