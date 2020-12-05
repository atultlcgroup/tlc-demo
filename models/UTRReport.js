
const { writeFileSync } = require("fs");
const excelToJson = require('convert-excel-to-json');
const ObjectsToCsv = require('objects-to-csv')
const fs = require('fs');
const csv=require('csvtojson')
const ftp = require('../databases/ftp');
let pool = require("../databases/db").pool
// let generateExcel = require("../helper/generateUTRExcel")
let generateExcel = require("../helper/generateExcelForUTRandCommision")
let sendMail= require("../helper/mailModel");


let createLogForUTRReport=async(fileName,fileStatus,isEmailSent,errorDescription,uploadedBy)=>{
    try{
        let lastInsertedId =0;
        let isInsert = await pool.query(`select file_name__c from tlcsalesforce.utr_tracking__c where file_name__c = '${fileName}'`)
        if(isInsert.rows.length){
            console.log(`update tlcsalesforce.utr_tracking__c set isemailsent__c = ${isEmailSent} ,status__c= '${fileStatus}',error_description__c='${errorDescription}' where file_name__c='${fileName}'`)
             pool.query(`update tlcsalesforce.utr_tracking__c set isemailsent__c = ${isEmailSent} ,status__c= '${fileStatus}',error_description__c='${errorDescription}' where file_name__c='${fileName}'`);  
            
        }else{
            let result =await pool.query(`INSERT INTO tlcsalesforce.utr_tracking__c(external_id__c,
                file_name__c, status__c, isemailsent__c, uploaded_by__c, createddate,error_description__c)
                VALUES (gen_random_uuid(),'${fileName}', '${fileStatus}', ${isEmailSent}, '${uploadedBy}', now(),'') RETURNING id`);    
                lastInsertedId = result.rows[0].id;
            }
       return lastInsertedId
        }catch(e){
            unlinkFiles(`reports/UTReport/${fileName}`)
            console.log(e);
            return e
        }
}




let findPaymentRule= async(req,fileName)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        else if(req.customer_set_sfid)
        qry = `select hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_utr__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_utr__c.split(','));
            if(d.tlc_send_email_utr__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_utr__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        await createLogForUTRReport(fileName,'ERROR',false,`${e}`)
        console.log(e)
        return [];
    }
}


let checkExcelFormatWithUTR = async(converter)=>{
    try{ 
        let valuesArr=[]
        let formatCheck = 0
        let headerArr=['SR No.','Bank Id','Bank Name','TPSL TransactiON id','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO'];
        let button ='off' 
        for(let d of converter){
            let ind=0;
            let cnt =0;
            let cntIfButtonOn= 0;
            let valueArr=[]
            let excelHeaderIndex = 0;
            for(let [key,value] of Object.entries(d)){
                excelHeaderIndex++;
               if(button == 'on'){
                valueArr.push(value)
               }
               if(headerArr[ind] && (value.toLowerCase()).trim()==headerArr[ind++].toLowerCase()){
                //    console.log(d)
                //    console.log(headerArr)
                cnt++;
               }
               if(button == 'on' && (value)){
                cntIfButtonOn++;
               }
             }
            if(button == 'on'){
                if( headerArr.length == cntIfButtonOn || headerArr.length -1 == cntIfButtonOn){
                }else{
                    button='off'
                }
             }
                if(button == 'on'){
                valuesArr.push(checkHeaderandValue(valueArr,headerArr))
                }
                if(headerArr.length -1 == cnt || headerArr.length == cnt){
                 formatCheck=1;
                  button = 'on'
                  console.log(`Excel format matched`)
              }
            }
            if(formatCheck == 0){
                console.log(`----Format Issue----`)
                // await createLogForUTRReport(fileNameInLog,'ERROR',false,`CSV Format Issue!`)
                return `Format Issue`
            }

            return {values: valuesArr, header:headerArr , utr: 'YES'}
    }catch(e){
        // unlinkFiles(`reports/UTReport/${fileName}`)        
        // await createLogForUTRReport(fileNameInLog,'ERROR',false,`${e}`)
      return {values: [], header:[] ,  utr: 'YES' }
    }
}
const readCsv=async(fileName,fileNameInLog)=>{
try{
 let valuesArr=[]
 let formatCheck = 0
 const headerArr = ['SR No.','Bank Id','Bank Name','TPSL Transaction Id','SM Transaction Id','Bank Transaction Id','Total Amount','Charges','Service Tax','Net Amount','Transaction Date','Transaction Time','Payment Date','SRC ITC','Scheme','Schemeamount','UTR_NO']
 const exceHeaderArr = ['SR No.','Bank Id','Bank Name','TPSL TransactiON id','Member','Membership','Customer Set','Property_Id','Property','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO']

 const converter= await csv().fromFile(`${fileName}`)
 let button ='off' 
 for(let d of converter){
    let ind=0;
    let cnt =0;
    let cntIfButtonOn= 0;
    let valueArr=[]
    let excelHeaderIndex = 0;
    for(let [key,value] of Object.entries(d)){
        excelHeaderIndex++;
       if(button == 'on'){
        valueArr.push(value)
       }
       if(headerArr[ind] && (value.toLowerCase()).trim()==headerArr[ind++].toLowerCase()){
        //    console.log(d)
        //    console.log(headerArr)
        cnt++;
       }
       if(button == 'on' && (value)){
        cntIfButtonOn++;
       }
     }
    if(button == 'on'){
        if( headerArr.length == cntIfButtonOn || headerArr.length -1 == cntIfButtonOn){
        }else{
            button='off'
        }
     }
        if(button == 'on'){
        valuesArr.push(checkHeaderandValue(valueArr,headerArr))
        }
        if(headerArr.length -1 == cnt || headerArr.length == cnt){
         formatCheck=1;
          button = 'on'
          console.log(`Excel format matched`)
      }
    }
    if(formatCheck == 0){
       let UTRFormat = await checkExcelFormatWithUTR(converter)

        // console.log(`----Format Issue----`)
        // await createLogForUTRReport(fileNameInLog,'ERROR',false,`CSV Format Issue!`)
        // return `Format Issue`
        return UTRFormat;
    }
    return {values: valuesArr, header:headerArr  , utr: 'NO'}
    }catch(e){
        console.log(`error: ${e}`)
        unlinkFiles(`reports/UTReport/${fileName}`)        
        await createLogForUTRReport(fileNameInLog,'ERROR',false,`${e}`)
    return {values: [], header:[] , utr: 'NO'}
    }
 }

 let checkHeaderandValue=(valueArr,headerArr)=>{
    try {
        if(headerArr.length == valueArr.length +1 ){

            valueArr.push('')
        }
        return valueArr;
    } catch (e) {
        
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


let checkDuplicate= async(SMTransactionId,TPLSTransactionId)=>{
    let sqlQry = await pool.query(`select * from tlcsalesforce."UTR_Log" where "SM Transaction Id"='${SMTransactionId}' and "TPSL Transaction Id"='${TPLSTransactionId}' and "Status"  in ('Completed','New')`)
    return sqlQry.rows ?  sqlQry.rows.length : 0  
}

let insertDataToLogTable = async(csvData, lastInsertedId, fileName)=>{
    try{    
       let insertLog = `insert into tlcsalesforce."UTR_Log"("UTR Tracking Id","isEmailSent"`
       for(let d of csvData.header){
        insertLog+=`,"${d}"`
       }
       for(let d of csvData.values){
         let isDuplicate = await checkDuplicate(d[csvData.header.indexOf('SM Transaction Id')],d[csvData.header.indexOf('TPSL Transaction Id')])
        let status = 'New';
        let syncDescription = ''
        isDuplicate > 0 ? status = 'Error' : status = 'New';
        isDuplicate > 0 ? syncDescription = 'Deplicate Record' : syncDescription = ''
        let insertLog1 =``
        insertLog1+=`,"Status","ErrorDescription") values(${lastInsertedId},false`

        
        // let data = await getPCMM(d[csvData.header.indexOf('Scheme')],d[csvData.header.indexOf('SM Transaction Id')],d[csvData.header.indexOf('TPSL Transaction Id')])
        // console.log(data)
        // console.log(csvData)
        // return
        // if(data.length)
        //  {
        //     insertLog1+=`,'${data[0].property_name}'`
        //     insertLog1+=`,'${data[0].property_id}'`
        //     let memberName =`${data[0].first_name__c ? data[0].first_name__c : ''} ${data[0].last_name__c ? data[0].last_name__c : ''}`
        //     insertLog1+=`,'${memberName}'` 
        //     insertLog1+=`,'${data[0].customerset}'`
        //     insertLog1+=`,'${data[0].membership_name}'`
        // }else{
        //     status='Error'
        //     syncDescription=`Scheme, SM Transaction Id, TPSL Transaction Id do not match in database!`
        //     insertLog1+=`,''`
        //     insertLog1+=`,''`
        //     insertLog1+=`,''`
        //     insertLog1+=`,''`
        //     insertLog1+=`,''`  
        // }
            for(d1 of d){
                insertLog1+=`,'${d1}'` 
            }
            insertLog1+=`,'${status}','${syncDescription}')`
        await pool.query(`${insertLog} ${insertLog1}`)
       }

    }catch(e){
        unlinkFiles(`reports/UTReport/${fileName}`)
        console.log(e)
    }

}

let updateDataToUTRLog= async(values, header)=>{
    try{
        let TPSLTransactionIdIndex=header.indexOf('TPSL TransactiON id');
        let SMTransactionIdIndex=header.indexOf('SM TransactiON Id');
        let UTRNoIndex = header.indexOf('UTR_NO')
        let Identifier= 0;
        let UTRLogArr = [];
        let fileName = '';
        for(d of values){
            console.log(`Update tlcsalesforce."UTR_Log" set  "UTR_NO"= '${d[UTRNoIndex]}' where "SM Transaction Id"  = '${d[SMTransactionIdIndex]}' and "TPSL Transaction Id" = '${d[TPSLTransactionIdIndex]}'  RETURNING "UTR Log Id"`)
            let updateUTR = await pool.query(`Update tlcsalesforce."UTR_Log" set  "UTR_NO"= '${d[UTRNoIndex]}' where "SM Transaction Id"  = '${d[SMTransactionIdIndex]}' and "TPSL Transaction Id" = '${d[TPSLTransactionIdIndex]}'  RETURNING "UTR Log Id"`)
            let data = updateUTR.rows.length ? updateUTR.rows[0]["UTR Log Id"] : 0;
            if(data > 0)
            UTRLogArr.push(data)
        }
        return UTRLogArr;
    
    }catch(e){

    }
}

let UTRReport = async(userid,fileName,file)=>{
    return new Promise(async(resolve, reject)=>{
        try{            
            let data = await uploadExcel(file,fileName)
            let csvData = await readCsv(`reports/UTReport/${fileName}`,fileName)
            if(csvData == 'Format Issue')
            throw `CSV Format Issue!`
            if(csvData.utr=='NO'){
                let lastInsertedId = await createLogForUTRReport(fileName,'STARTED',false,'',userid)
                let excelToFTPServer = await uploadExcelToFTP(fileName, userid)
                await createLogForUTRReport(fileName,'UPLOADED',false,'')
                await insertDataToLogTable(csvData,lastInsertedId , fileName)
                await moveFileToArchiveFolder(fileName)
                unlinkFiles(`reports/UTReport/${fileName}`)
            }else{
                let UTRData = await updateDataToUTRLog(csvData.values,csvData.header)
                console.log(`From Yes!!!!`)
                unlinkFiles(`reports/UTReport/${fileName}`)
                if(!UTRData.length){
                    reject('Please upload the crosspondent file first!')
                    return
                  }
                let excelToFTPServer = await uploadExcelToFTP(fileName, userid)
                await moveFileToArchiveFolder(fileName)  
                await UTRReport2(UTRData, fileName, userid)
            }
            // console.log(lastInsertedId)
            resolve({userid:userid,fileName:`result`})
        }catch(e){
            await createLogForUTRReport(fileName,'ERROR',false,`${e}`)
            console.log(`${e}`)
            reject(`${e}`)
        }
    
    })
}


let updateUTRLogStatus = async(scheme,UTRTrackingId, isEmailSent,status,errorDescription)=>{
    if(scheme)
    await pool.query(`update tlcsalesforce."UTR_Log" set "Status"='${status}',"ErrorDescription"='${errorDescription}',"isEmailSent"=${isEmailSent} where "UTR Tracking Id"='${UTRTrackingId}' and "Scheme"='${scheme}'`)
    else
    await pool.query(`update tlcsalesforce."UTR_Log" set "Status"='${status}',"ErrorDescription"='${errorDescription}',"isEmailSent"=${isEmailSent} where "UTR Tracking Id"='${UTRTrackingId}'`)

}

let updateUTRLogStatusByArr=async(scheme,UTRTrackingId, isEmailSent,status,errorDescription)=>{
    if(scheme)
    await pool.query(`update tlcsalesforce."UTR_Log" set "Status"='${status}',"ErrorDescription"='${errorDescription}',"isEmailSent"=${isEmailSent} where "UTR Tracking Id"='${UTRTrackingId}' and "Scheme"='${scheme}'`)
    else
    await pool.query(`update tlcsalesforce."UTR_Log" set "Status"='${status}',"ErrorDescription"='${errorDescription}',"isEmailSent"=${isEmailSent} where "UTR Tracking Id"='${UTRTrackingId}'`)

}

let getFileName = async(logId)=>{
    try{
        let selFileName = await pool.query(`select file_name__c,id from tlcsalesforce.utr_tracking__c utc left join tlcsalesforce."UTR_Log" ul on utc.id =  CAST(ul."UTR Tracking Id" as INTEGER) where ul."UTR Log Id" = ${logId}`)
        return selFileName.rows.length ? selFileName.rows[0] : {id: 0,file_name__c:''}
    }catch(e){
        return {id: 0,file_name__c:''}
    }
}
let UTRReport2=async(UTRData,fileName,userid)=>{
    console.log(`UTRData=${UTRData}`)
    return new Promise(async(resolve, reject)=>{
    try{
       let fileData = await getFileName(UTRData[0])
       console.log(fileData)
       UTRTrackingId = fileData.id
       fileName = fileData.file_name__c
       console.log(`file Name= ${fileName} and utr Tracking id = ${UTRTrackingId}`) 
      let selData = await pool.query(`Select "SR No.","Bank Id","Bank Name","TPSL Transaction Id","SM Transaction Id","Bank Transaction Id","Total Amount","Charges","Service Tax","Net Amount","Transaction Date","Transaction Time","Payment Date","SRC ITC","Scheme","Schemeamount","UTR_NO","UTR Log Id" from tlcsalesforce."UTR_Log" where "UTR Log Id" in (${UTRData}) and "Status"= 'New'`)
      let dataSchemeCodeWise = await arrangeDataSchemeCodeWise(selData.rows? selData.rows : [],fileName) 
      let errorArr = [];  
      for(let [key,value] of Object.entries(dataSchemeCodeWise)){
          console.log(`++++++++++++++++++++++++++++-----------++++++++++++`)
            console.log(`---------propertyId =${value[0].property_id}----------`)
            let obj = {property_sfid: value[0].property_id}
            let emails = await findPaymentRule(obj,fileName)
            if(emails.length){
                try{
                    let excelFile = await generateExcel.generateExcel(value,'PG Settlement Report');
                    await sendMail.sendUTRReport(`${excelFile}`,'PG Settlement Report',emails)
                    // await sendMail.sendUTRReport(`${excelFile}`,'UTR Report',['atul.srivastava@tlcgroup.com'])
                   await updateUTRLogStatus(key,UTRTrackingId, true,'Completed','')
                }catch(e){
                    await updateUTRLogStatus(key,UTRTrackingId, false,'Error',`${e}`)
                }
            }else{
                await updateUTRLogStatus(key,UTRTrackingId, false,'Error','Email Not Found !')
                errorArr.push({scheme_code:key,message:'Email Not Found !'})
                console.log(`Email Not Found !`) 
            }
        }
        if(errorArr.length)
        await createLogForUTRReport(fileName,'UPLOADED',false,`${JSON.stringify(errorArr)}`)
        else{
            selData.rows.length ? 
            await createLogForUTRReport(fileName,'UPLOADED',true,''):
            ``
        }
        await getErrorRecordandCreateCSV(UTRTrackingId,userid)
        resolve("Success")
        }catch(e){
            console.log(e)
       await updateUTRLogStatus('',UTRTrackingId, false,'Error',`${e}`)   
         reject(e)
        }
    })
  
    // let dataSchemeCodeWise = await arrangeDataSchemeCodeWise(csvData.values,csvData.header,fileName) 
    // let errorArr = [];
    // for(let [key,value] of Object.entries(dataSchemeCodeWise)){
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
    // }
    // if(errorArr.length)
    // await createLogForUTRReport(fileName,'UPLOADED',false,`${JSON.stringify(errorArr)}`)
    // else
    // await createLogForUTRReport(fileName,'UPLOADED',true,'')
   
}
 




let uploadErrorFileToFTP = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let path = `UTRReport/Error/${fileName}`
            ftpConnection = await ftp.connect();
              await ftpConnection.uploadFrom(`reports/UTReport/${fileName}`, `${path}`)
            ftpConnection.close();
            fs.unlink(`reports/UTReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            resolve(path)
        } catch (e) {
            await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`reports/UTReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}



let getErrorRecordandCreateCSV = async(UTRTrackingId, userId)=>{
    try{
    let selectQry = await pool.query(`Select "SR No." "CSV Serial Number","Bank Id","Bank Name","TPSL Transaction Id","SM Transaction Id","Bank Transaction Id","Total Amount","Charges","Service Tax","Net Amount","Transaction Date","Transaction Time","Payment Date","SRC ITC","Scheme","Schemeamount","ErrorDescription" from tlcsalesforce."UTR_Log" where "UTR Tracking Id"='${UTRTrackingId}' and "Status"= 'Error'`)
    let data=selectQry.rows ? selectQry.rows:[]
    if(data.length){
        let fileName = await generateCSV(data,userId)
        console.log(`hi`)
        let fullPath = await uploadErrorFileToFTP(fileName)
        let updateErrorFileInUTRTracking = await pool.query(`UPDATE tlcsalesforce.utr_tracking__c SET  status__c= 'ERROR',error_file_url__c='UTRReport/Error/${fileName}' where id = '${UTRTrackingId}'`)
    }else{
        console.log(`No Error`)
    }

  }catch(e){
      console.log(e)

  }

}

let generateCSV=async(data,userId)=>{
    let headerArr = [{id:"SR No.",title:"SR No."}]
    for(let [key,value] of Object.entries(data[0])){
        headerArr.push({id: `${key}`, title:`${key}`})
    }

    let fileName = `UTR_Error_${userId}_${Date.now()}.csv`
    let path = `./reports/UTReport/${fileName}`
    // const csvWriter = createCsvWriter({
    //     path: path,
    //     header: headerArr
    // });
    let bodyArr = [];
    let index = 1;
    for(let d of data){
        let bodyObj = {'SR No.':index++}
        
        for(let [key,value] of Object.entries(d)){
            bodyObj[`${key}`] = `${value}`
        }   
        bodyArr.push(bodyObj)
    }
    const records = bodyArr;
    const csv = new ObjectsToCsv(bodyArr)
    await csv.toDisk(`${path}`)   
//    let result= await csvWriter.writeRecords(records)  
    return  fileName;  
} // returns a promise



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
        let qry = `Select  distinct property__c.name as property_name,property__c.sfid property_id,payment__c.membership__r__membership_number__c, payment__c.email__c, firstname, lastname, membershiptype__c.name membership_type_name,
        membershiptype__c.sfid membership_type_id, 
        Case when payment_for__c = 'New Membership' OR payment_for__c = 'Add-On'
        Then 'Fresh'
        when  payment_for__c = 'Renewal'
        THEN 'Renewal'
        Else
            'Other'
        END as FreshRenewal, payment__c.createddate,transcationCode__c, payment__c.transaction_id__c,
        GST_details__c, payment_email_rule__c.manager_email__c, payment__c.country__c billingcountry,payment__c.state__c billingstate, payment__c.city__c billingcity,payment__c.address_line_1__c billingstreet,
        payment__c.pin_code__c billingpostalcode, payment_mode__c, payment_bifurcation__c.share_percent__c* grand_total__c/100 as membership_fee, net_amount__c membership_amount , grand_total__c membership_total_amount,
        tax_breakup__c.name breakup,
        payment__c.state__c, payment_email_rule__c.state__c hotel_state,payment_bifurcation__c.account_number__c as scheme_code
        from 
        tlcsalesforce.payment__c
        Inner Join tlcsalesforce.account
        On account.sfid = payment__c.account__c
        Inner Join tlcsalesforce.payment_bifurcation__c
        On payment_bifurcation__c.payment__c = payment__c.sfid
        Inner Join tlcsalesforce.membership__c On --change here
        payment__c.membership__c = membership__c.sfid
        Inner Join tlcsalesforce.membershiptype__c On --change here
        membership__c.customer_set__c = membershiptype__c.sfid
        Left join tlcsalesforce.tax_master__c
        On membershiptype__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.tax_breakup__c
        On tax_breakup__c.tax_master__c = tax_master__c.sfid
        Left Join tlcsalesforce.payment_email_rule__c
        On payment_email_rule__c.customer_set__c = membershiptype__c.sfid
        left join tlcsalesforce.property__c  on membershiptype__c.property__c = property__c.sfid
        where 
                (payment__c.payment_status__c = 'CONSUMED' OR 
                payment__c.payment_status__c = 'SUCCESS')  and 
                --payment__c.transaction_id__c = '7635753' and payment__c.transcationcode__c='1286212703' 
                --and  payment_bifurcation__c.account_number__c = 'SECOND' 
                payment__c.transaction_id__c = '${SMTransactionId}' and payment__c.transcationcode__c='${TPLSTransactionId}' 
                and  payment_bifurcation__c.account_number__c = '${schmeCode}' 
                limit 1
        `
        let data = await pool.query(qry)
        // let qry = await pool.query(`select p.first_name__c,p.last_name__c,property__c.name property_name , property__c.sfid property_id, pb.account_number__c as scheme_code, ms.name as customerset
        // ,m.name membership_name,account__r__member_id__c member_id,membership__c, membership__r__membership_number__c from tlcsalesforce.payment__c p Inner Join
        //  tlcsalesforce.payment_bifurcation__c pb On pb.payment__c = p.sfid left join tlcsalesforce.membership__c m on  m.sfid = p.membership__c left join tlcsalesforce.membershiptype__c
        //   ms on m.customer_set__c = ms.sfid Left Join tlcsalesforce.property__c On ms.property__c = property__c.sfid where p.transaction_id__c = '${SMTransactionId}' and p.transcationcode__c = '${TPLSTransactionId}'
        //    and pb.account_number__c='${schmeCode}' and p.transaction_id__c is not NULL`)
        // let qry = await pool.query(`select p.first_name__c,p.last_name__c,property__c.name property_name , property__c.sfid property_id, pb.account_number__c as scheme_code, ms.name as
        //  customerset,m.name membership_name,account__r__member_id__c member_id,membership__c, membership__r__membership_number__c 
        //  from tlcsalesforce.payment__c p Inner Join tlcsalesforce.payment_bifurcation__c pb On pb.payment__c = p.sfid left join 
        //  tlcsalesforce.membership__c m on  m.sfid = p.membership__c left join tlcsalesforce.membershiptype__c ms on m.customer_set__c = 
        //  ms.sfid Left Join tlcsalesforce.property__c On ms.property__c = property__c.sfid where p.transaction_id__c = '3802794' 
        //  and pb.account_number__c='SECOND' and p.transaction_id__c is not NULL`)   
        return data.rows?data.rows: []
    }catch{
        return [];
    }
}

let calculateIGSTCGSTSGST=async(d)=>{
    try{
        d.IGST=0;
        d.CGST=0;
        d.SGST=0;
        let qryForGST = `select state__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${d.membership_type_id}' limit 1`;
        let dataForGST = await pool.query(`${qryForGST}`)
        let GSTstate = dataForGST.rows.length ?  dataForGST.rows[0].state__c : "";
         if(GSTstate != d.state__c){
             d.IGST = d.membership_amount ? ((d.membership_amount * 18) / 100): 0;
         }else{
            d.CGST=  d.membership_amount ? ((d.membership_amount * 9) / 100): 0;;
            d.SGST= d.membership_amount ? ((d.membership_amount * 9) / 100): 0;;
         }
         return d;
    }catch(e){
          return d;
    }
}

let arrangeDataSchemeCodeWise= async(data,fileName)=>{
    try{
    let schemeObj = {}
    for(let  a of data){
        // console.log(`-----------+++++++++++------------`)
        let PCMMdata = await getPCMM(a['Scheme'],a['SM Transaction Id'],a['TPSL Transaction Id'])
        let newObj = a
        if(PCMMdata.length){
            let calculateIGSTCGSTSGSTData = await calculateIGSTCGSTSGST(PCMMdata[0])
           newObj = {
            ...a,
            ...calculateIGSTCGSTSGSTData 
            }
        }
        if(schemeObj[newObj['Scheme']]){
            schemeObj[newObj['Scheme']].push(newObj)
        }else{
            schemeObj[newObj['Scheme']]=[newObj] 
        }
    //     //  console.log(schemeObj.hasOwnProperty(a[header.indexOf('Scheme_code')]))
    //  if(schemeObj[a[header.indexOf('Scheme')]]){
    //     schemeObj[a[header.indexOf('Scheme')]].push(await createJsonObj(a,header))
    //  }else{
    //     schemeObj[a[header.indexOf('Scheme')]] = [await createJsonObj(a,header)];
    //  }
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
              await ftpConnection.uploadFrom(`reports/UTReport/${fileName}`, `UTRReport/${fileName}`)
            ftpConnection.close();
            resolve('Success')
        } catch (e) {
            await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`reports/UTReport/${fileName}`, (err, da) => {
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
    const data = await writeFileSync(`reports/UTReport/${fileName}`, `${file}`, { encoding: "base64" })
    const result = await excelToJson({
        source: fs.readFileSync(`reports/UTReport/${fileName}`)
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