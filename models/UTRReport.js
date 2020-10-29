
const { writeFileSync } = require("fs");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const csv=require('csvtojson')
const ftp = require('../databases/ftp');
let pool = require("../databases/db").pool
let generateExcel = require("../helper/generateUTRExcel")
let sendMail= require("../helper/mailModel");


let createLogForUTRReport=async(fileName,fileStatus,isEmailSent,errorDescription,uploadedBy)=>{
    try{
        let lastInsertedId =0;
        let isInsert = await pool.query(`select "fileName" from tlcsalesforce.utr_tracking where "fileName" = '${fileName}'`)
        if(isInsert.rows.length){
            console.log(`update tlcsalesforce.utr_tracking set "isEmailSent" = ${isEmailSent} ,"fileStatus"= '${fileStatus}',"ErrorDescription"='${errorDescription}' where "fileName"='${fileName}'`)
             pool.query(`update tlcsalesforce.utr_tracking set "isEmailSent" = ${isEmailSent} ,"fileStatus"= '${fileStatus}',"ErrorDescription"='${errorDescription}' where "fileName"='${fileName}'`);  
            
        }else{
            let result =await pool.query(`INSERT INTO tlcsalesforce.utr_tracking(
                "fileName", "fileStatus", "isEmailSent", "UploadedBy", "CreatedDate","ErrorDescription")
                VALUES ('${fileName}', '${fileStatus}', ${isEmailSent}, '${uploadedBy}', now(),'') RETURNING id`);    
                lastInsertedId = result.rows[0].id;
            }
       return lastInsertedId
        }catch(e){
            console.log(e);
            return e
        }
}



let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        if(req.property_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        if(req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_status__c == true)
            resultArray= resultArray.concat(d.hotel_emails__c.split(','));
            if(d.tlc_email_status__c == true)
            resultArray=resultArray.concat(d.manager_email__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        await createLogForUTRReport(fileName,'ERROR',false,`${e}`)
        console.log(e)
        return [];
    }
}

const readCsv=async(fileName,fileNameInLog)=>{
try{
 let valuesArr=[]
 let formatCheck = 0
 const headerArr = ['SR No.','Bank Id','Bank Name','TPSL Transaction Id','SM Transaction Id','Bank Transaction Id','Total Amount','Charges','Service Tax','Net Amount','Transaction Date','Transaction Time','Payment Date','SRC ITC','Scheme','Schemeamount']
 const exceHeaderArr = ['SR No.','Bank Id','Bank Name','TPSL TransactiON id','Member','Membership','Customer Set','Property_Id','Property','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO']

 const converter= await csv().fromFile(`${fileName}`)
 let button ='off' 
 for(d of converter){
    let ind=0;
    let cnt =0;
    let cntIfButtonOn= 0;
    let valueArr=[]
    let excelHeaderIndex = 0;
    for(let [key,value] of Object.entries(d)){
        excelHeaderIndex++;
       if(button == 'on')
       valueArr.push(value)
       if((value.toLowerCase()).trim()==headerArr[ind++].toLowerCase()){
        //    console.log(d)
        //    console.log(headerArr)
        cnt++;
       }
       if(button == 'on' && (!value || value == null)){
        cntIfButtonOn++;
       }
     }
    if((button == 'on' && headerArr.length == cntIfButtonOn) || (button == 'on' && headerArr.length != ind)){
        button='off'
       console.log(cntIfButtonOn)
     }
        if(button == 'on')
        valuesArr.push(valueArr)
        if(headerArr.length == cnt){
         formatCheck=1;
          button = 'on'
          console.log(`Excel format matched`)
      }
    }
    if(formatCheck == 0){
        await createLogForUTRReport(fileNameInLog,'ERROR',false,`CSV Format Issue!`)
        return `Format Issue`
    }
    return {values: valuesArr, header:headerArr }
    }catch(e){
        await createLogForUTRReport(fileNameInLog,'ERROR',false,`${e}`)
    return {values: [], header:[] }
    }
 }


     
let unlinkFiles = (file)=>{
    fs.unlink(`${file}`, (err, da) => {
        if (err)
            return(`${err}`);
    })
}
 
let moveFileToArchiveFolder = async(fileName)=>{
    ftpConnection = await ftp.connect();
    await ftpConnection.rename(`UTRReport/${fileName}`, `UTRReport/UTR_ARCHIVE/${fileName}`)
    ftpConnection.close();

}

let insertDataToLogTable = async(csvData, lastInsertedId)=>{
    try{
       let insertLog = `insert into tlcsalesforce."UTR_Log"("UTR Tracking Id","Status","isEmailSent","ErrorDescription","property_name","property_id","Member","Membership Number","Membership Type"`
       for(let d of csvData.header){
        insertLog+=`,"${d}"`
       }
       insertLog+=`) values(${lastInsertedId},'NEW',false,''`
       for(let d of csvData.values){
        let insertLog1 =``
        let data = await getPCMM(d[csvData.header.indexOf('Scheme')],d[csvData.header.indexOf('SM Transaction Id')],d[csvData.header.indexOf('TPSL Transaction Id')])
        if(data.length)
         {
            insertLog1+=`,'${data[0].property_name}'`
            insertLog1+=`,'${data[0].property_id}'`
            insertLog1+=`,${data[0].first_name__c ? data[0].first_name__c : ''} ${data[0].last_name__c ? data[0].last_name__c : ''}` 
            insertLog1+=`,${data[0].customerset}`
            insertLog1+=`,${data[0].membership_name}`
        }else{
            insertLog1+=`,''`
            insertLog1+=`,''`
            insertLog1+=`,''`
            insertLog1+=`,''`
            insertLog1+=`,''`  
        }
            for(d1 of d){
                insertLog1+=`,'${d1}'` 
            }
            insertLog1+=`)`
        await pool.query(`${insertLog} ${insertLog1}`)
       }

    }catch(e){
        console.log(e)
    }

}

let UTRReport = async(userid,fileName,file)=>{
    return new Promise(async(resolve, reject)=>{
        try{            
            let lastInsertedId = await createLogForUTRReport(fileName,'STARTED',false,'',userid)
            let data = await uploadExcel(file,fileName)
            let excelToFTPServer = await uploadExcelToFTP(fileName, userid)
            await createLogForUTRReport(fileName,'UPLOADED',false,'')
            let csvData = await readCsv(`UTRReport/${fileName}`,fileName)
            await insertDataToLogTable(csvData,lastInsertedId)
            
            await moveFileToArchiveFolder(fileName)
            if(csvData == 'Format Issue')
            throw `CSV Format Issue!`
            unlinkFiles(`UTRReport/${fileName}`)
           
            let dataSchemeCodeWise = await arrangeDataSchemeCodeWise(csvData.values,csvData.header,fileName)
            
            let errorArr = [];
            for(let [key,value] of Object.entries(dataSchemeCodeWise)){
                // console.log(`---------propertyId =${value[0].property_id}----------`)
                // let obj = {property_sfid: value[0].property_id}
                // let emails = await findPaymentRule(obj,fileName)
                // if(emails.length){
                //     // let excelFile = await generateExcel.generateExcel(value,'UTR Report');
                //     // await sendMail.sendUTRReport(`${excelFile}`,'UTR Report',emails)
                //     // console.log(excelFile)
                // }else{
                //     errorArr.push({scheme_code:key,message:'Email Not Found !'})
                //     console.log(`Email Not Found !`)
                // }
            }
            if(errorArr.length)
            await createLogForUTRReport(fileName,'UPLOADED',false,`${JSON.stringify(errorArr)}`)
            else
            await createLogForUTRReport(fileName,'UPLOADED',true,'')
            resolve({userid:userid,fileName:`result`})
        }catch(e){
            await createLogForUTRReport(fileName,'ERROR',false,`${e}`)
            console.log(`${e}`)
            reject(`${e}`)
        }
    
    })
}
 

let createJsonObj = async(value,header)=>{
    let dataObj = {}
    index = 1;
    // console.log(header)
    // console.log(value[header.indexOf('Scheme')],value[header.indexOf('SM Transaction Id')],value[header.indexOf('TPSL Transaction id')])
 let data = await getPCMM(value[header.indexOf('Scheme')],value[header.indexOf('SM Transaction Id')],value[header.indexOf('TPSL Transaction Id')])
    if(data.length)
     {
        dataObj['property_name'] = data[0].property_name
        dataObj['property_id'] = data[0].property_id
        dataObj['Member'] = `${data[0].first_name__c ? data[0].first_name__c : ''} ${data[0].last_name__c ? data[0].last_name__c : ''}` 
        dataObj['Membership Type']=data[0].customerset
        dataObj['Membership Number'] = data[0].membership_name
    }else{
        dataObj['property_name'] = ''
        dataObj['property_id'] = ''
        dataObj['Member'] = ''
        dataObj['Membership Number'] = ''
        dataObj['Membership Type']= ''   
    }
    for(let i =0 ;i<header.length;i++){
      dataObj[header[i]] = value[i]
    }
 
      return dataObj;
}

let getPCMM=async(schmeCode,SMTransactionId,TPLSTransactionId)=>{
    try{
        console.log(schmeCode,SMTransactionId,TPLSTransactionId)
        // let qry = await pool.query(`select p.first_name__c,p.last_name__c,property__c.name property_name , property__c.sfid property_id, pb.account_number__c as scheme_code, ms.name as customerset
        // ,m.name membership_name,account__r__member_id__c member_id,membership__c, membership__r__membership_number__c from tlcsalesforce.payment__c p Inner Join
        //  tlcsalesforce.payment_bifurcation__c pb On pb.payment__c = p.sfid left join tlcsalesforce.membership__c m on  m.sfid = p.membership__c left join tlcsalesforce.membershiptype__c
        //   ms on m.customer_set__c = ms.sfid Left Join tlcsalesforce.property__c On ms.property__c = property__c.sfid where p.transaction_id__c = '${SMTransactionId}' and p.transcationcode__c = '${TPLSTransactionId}'
        //    and pb.account_number__c='${schmeCode}' and p.transaction_id__c is not NULL`)   
        let qry = await pool.query(`select p.first_name__c,p.last_name__c,property__c.name property_name , property__c.sfid property_id, pb.account_number__c as scheme_code, ms.name as
         customerset,m.name membership_name,account__r__member_id__c member_id,membership__c, membership__r__membership_number__c 
         from tlcsalesforce.payment__c p Inner Join tlcsalesforce.payment_bifurcation__c pb On pb.payment__c = p.sfid left join 
         tlcsalesforce.membership__c m on  m.sfid = p.membership__c left join tlcsalesforce.membershiptype__c ms on m.customer_set__c = 
         ms.sfid Left Join tlcsalesforce.property__c On ms.property__c = property__c.sfid where p.transaction_id__c = '3802794' 
         and pb.account_number__c='SECOND' and p.transaction_id__c is not NULL`)   
        let data = qry?qry.rows: []
           return data
    }catch{
        return [];
    }
}

let arrangeDataSchemeCodeWise= async(values,header,fileName)=>{
    try{
    
    let schemeObj = {}
    for(let  a of values){
        //  console.log(schemeObj.hasOwnProperty(a[header.indexOf('Scheme_code')]))
     if(schemeObj[a[header.indexOf('Scheme')]]){
        schemeObj[a[header.indexOf('Scheme')]].push(await createJsonObj(a,header))
     }else{
        schemeObj[a[header.indexOf('Scheme')]] = [await createJsonObj(a,header)];
     }
    }
    return schemeObj
        
    }catch(e){
        await createLogForUTRReport(fileName,'ERROR' , false,`${e}`)
        console.log(e)
        return e;
    }

}



let uploadExcelToFTP = async (fileName, userId) => {
    return new Promise(async(resolve,reject)=>{
        try {

            ftpConnection = await ftp.connect();
            // // console.log(await ftpConnection.list())
            // console.log(data)
              await ftpConnection.uploadFrom(`UTRReport/${fileName}`, `UTRReport/${fileName}`)
            ftpConnection.close();
            resolve('Success')
        } catch (e) {
            await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`UTRReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}

let uploadExcel = async (file, fileName) => {
    return new Promise(async (resolve,reject)=>{
        // console.log(`from here 1`)
    try{
    const data = await writeFileSync(`UTRReport/${fileName}`, `${file}`, { encoding: "base64" })
    const result = await excelToJson({
        source: fs.readFileSync(`UTRReport/${fileName}`)
    });
    // console.log(`from here 1`)
    // console.log(result)
    resolve(`${JSON.stringify(result)}`); 
    }catch(err){
        console.log(err)
         reject(err)
    }
    })
}

module.exports={
    UTRReport
}