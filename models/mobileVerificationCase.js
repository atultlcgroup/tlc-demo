const pool = require("../databases/db").pool;


let logInApiURLOfSfdc = process.env.SFDC_LOGIN_API_URL || '';
let sfdcGrandType = process.env.SFDC_LOGIN_GRAND_TYPE || '';
let sfdcLoginClientSecret = process.env.SFDC_LOGIN_CLIENT_SECRET || '';
let sfdcLoginClientId = process.env.SFDC_LOGIN_CLIENT_ID || '';
let sfdcLoginUserName = process.env.SFDC_LOGIN_USER_NAME || '';
let sfdcLoginPassword = process.env.SFDC_LOGIN_PASSWORD || '';
let sfdcFileApisURL = process.env.SFDC_FILE_APIS_URL || '';

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

let getRecordFromOtpLog = async()=>{
    try {
        // let qry = `select * from tlcsalesforce.otp_log where  "OTP Request Date/Time" > NOW() - INTERVAL  '10 hour' and "OTP Request Date/Time" <= NOW() - INTERVAL  '10 minute'`;
        let qry = `select distinct "Mobile" ,(select "OTP Request Date/Time" from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1) created_at,(select count(*) from tlcsalesforce.otp_log  where "Mobile" = ol."Mobile" limit 1) number_of_attempt from tlcsalesforce.otp_log  ol where  "OTP Request Date/Time" > '2021-01-05' and "OTP For" = 'verifyMobile'`;

        let record = await pool.query(qry)
        return record.rows ? record.rows : [];
    } catch (error) {
        return [];
    }
}




let getAccountData = async(token)=>{
    console.log(`hi from here`)
    let data = {
        'grant_type':  `${sfdcGrandType}`,
       'client_id': `${sfdcLoginClientId}`,
       'client_secret': `${sfdcLoginClientSecret}`,
       'Authorization': `Bearer ${token}`
       };
       let  config = {
        method: 'get',
        url: `${sfdcFileApisURL}/services/data/v47.0/query?q=select id, createdDate,PersonEmail,PersonMobilePhone  from Account where CreatedDate > 2021-01-05T18:24:14.031Z`,
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

let getUserDataFromSFDC=async()=>{
  try {
    let data = await loginApiCall()
    token = data.msg.access_token  || ``;
    console.log(`-------token----------`)
    console.log(token)
    let accountData = await getAccountData(token)
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
            if(find == 0)
            notRegisteredUsers.push(a)
        }
        return notRegisteredUsers;
    
    } catch (error) {
        console.log(error) 
    }
}
let createCaseInSfdc = async()=>{
    try {
        
    } catch (error) {
        
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

let mobileVerificationCase=async()=>{
    try {
        let otpLogData = await getRecordFromOtpLog();
        let userDataFromSFDC = await getUserDataFromSFDC();
        // console.log(userDataFromSFDC)
        let notRegisteredUsers = await getNotRegisterUsers(otpLogData , userDataFromSFDC)
        // console.log(notRegisteredUsers)
        let data =await arrayToCSV(notRegisteredUsers)
        // console.log(dateFormat)
        // let createCaseInSFDC = await createCaseInSfdc(notRegisteredUsers)
        // console.log(otpLogData)
        return `Success`
    } catch (error) {
        return `${error}`
    }
}

mobileVerificationCase();
