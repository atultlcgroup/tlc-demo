const { writeFileSync } = require("fs");
const pool = require("../databases/db").pool
const ftp = require('../databases/ftp')
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const ObjectsToCsv = require('objects-to-csv')

let sendMail= require("../helper/mailModel");


const reportType = [
    {type: 'CM',logoName:'logo-cm.png'},
{type: 'OS',logoName:'logo-gm.png'},
{type: 'TAJ',logoName:'taj.png'}];

//Time validation
let validateHhMm = async (inputField) => {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);

    if (isValid) {
        return isValid;

    } else {
        return isValid;

    }
}


let dateValidation=(dateString)=> {
    var regEx = /^\d{4}-\d{2}-\d{2}$/;
    if(!dateString.match(regEx)) return false;  // Invalid format
    var d = new Date(dateString);
    var dNum = d.getTime();
    if(!dNum && dNum !== 0) return false; // NaN value, Invalid date
    return d.toISOString().slice(0,10) === dateString;
  }

// //
// let dateValidation=async(currVal) =>{

//     if (currVal == '') return false;

//     //Declare Regex  
//     var rxDatePattern = /^(\d{1,2})(\/|-)(?:(\d{1,2})|(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec))(\/|-)(\d{4})$/i;

//     var dtArray = currVal.match(rxDatePattern);

//     if (dtArray == null) return false;

//     var dtDay =await parseInt(dtArray[1]);
//     var dtMonth =await parseInt(dtArray[3]);
//     var dtYear =await parseInt(dtArray[17]);

//     if (isNaN(dtMonth)) {
//         for (var i = 4; i <= 15; i++) {
//             if ((dtArray[i])) {
//                 dtMonth = i - 3;
//                 break;
//             }
//         }
//     }

//     if (dtMonth < 1 || dtMonth > 12) return false;
//     else if (dtDay < 1 || dtDay > 31) return false;
//     else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31) return false;
//     else if (dtMonth == 2) {
//         var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
//         if (dtDay > 29 || (dtDay == 29 && !isleap)) return false;
//     }

//     return true;
// }

//Find duplicate
let findDuplicate =async (str)=>{
    console.log("str",str);
    let str1 = str.substring(str.indexOf('pos_log(') + 8 , str.indexOf(') values'))
    let str2 = str.substring(str.indexOf('values(') + 7 , str.lastIndexOf(')'))
    let arr1 = str1.split(",")
    let arr2 = str2.split(",")
    let Card_No=arr2[arr1.indexOf('"Card_No"')];
    let Bill_No = arr2[arr1.indexOf('"Bill_No"')];
    let BillDate = arr2[arr1.indexOf('"BillDate"')];
    let BillTime=arr2[arr1.indexOf('"BillTime"')]
    let duplicateData =0;
        let selNewCnt = await pool.query(`select count(*) cnt from tlcsalesforce.pos_log where  "Bill_No"=${Bill_No} and "BillDate"=${BillDate}  and status in('NEW')`)
        if(selNewCnt.rows[0].cnt == 1){
            let result= await pool.query(`select count(*) cnt from tlcsalesforce.pos_log where  "Bill_No"=${Bill_No} and "BillDate"=${BillDate}  and status  in('SYNC_COMPLETED')`)
            if(result.rows[0].cnt > 0)
            duplicateData=1
        }else{
            duplicateData=1
        }
        
        return duplicateData;
    }

let uploadExcelToFTP = async (fileName, file) => {
    return new Promise(async (resolve, reject) => {
        try {
            ftpConnection = await ftp.connect();
            // // console.log(await ftpConnection.list())
            await ftpConnection.uploadFrom(`uploads/${fileName}`, `POS/${fileName}`)
            ftpConnection.close();
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            resolve('Success')
        } catch (e) {
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}


let uploadExcel = async (file, fileName, body) => {
    return new Promise(async (resolve, reject) => {
        // console.log(`from here 1`)
        try {
            const data = await writeFileSync(`./uploads/${fileName}`, `${file}`, { encoding: "base64" })
            // console.log(`from here 1`)
            await uploadExcelToFTP(fileName, file);
            await updatePOSTracking(body, fileName)
            resolve(`SUCCESSFULLY TRANSFERRED`);
        } catch (err) {
            reject(err)
        }
    })
}

let updatePOSTracking = (body, fileName) => {
    try {

        console.log(`INSERT INTO tlcsalesforce.pos_tracking__c(
             brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "branduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
            VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'))`)
        pool.query(`INSERT INTO tlcsalesforce.pos_tracking__c(external_id__c,
             brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "banduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c,user_email_id__c)
            VALUES (gen_random_uuid(),'${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'),'${body.userEmail}')`)
    } catch (e) {
        return e;
    }
}


let getPosData = async (fileName) => {
    return new Promise(async (resolve, reject) => {
        try { 
            // checking FTP file to upload;
            await directUploadingFileFromFTP()
            let qry = ``;
            if (fileName)
                qry = `select file_name__c file_name,pos_source__c pos_source,id sync_id,outlet__c outlet from tlcsalesforce.pos_tracking__c where status__c='UPLOADED' and file_name__c = '${fileName}'`;
            else
                qry = `select file_name__c file_name,pos_source__c pos_source,id sync_id,outlet__c outlet from tlcsalesforce.pos_tracking__c where status__c='UPLOADED'`;
            const result = await pool.query(qry);
            console.log("Input values",result.rows);
            await getFileFromFTP((result) ? result.rows : null, fileName);
            //await get
            resolve(`SUCCESS`)
        } catch (e) {
            // console.log(`${e}`)
            reject(`${e}`)
        }
    })
}

let deleteErrorExcelRecords = (tracking_id) => {
    pool.query(`delete from tlcsalesforce.pos_log where pos_tracking_id = ${tracking_id}`)
}


let getMemberId = async (memberShipNumber) => {
    try {
        let qry = await pool.query(`select member__r__member_id__c member_id from tlcsalesforce.membership__c where membership_number__c = '${memberShipNumber}'`)

        console.log((qry && qry.rows) ? qry.rows[0].member_id : '')
        return (qry && qry.rows) ? qry.rows[0].member_id : ''
    } catch (e) {
        return ''
    }


}



let findTendorMediaNumber = (str)=>{
    console.log(`From findTendorMediaNumber`)
    let err = ``
    let TendorMediaArr =["'AME'","'CAS'","'MAS'","'ROM'","'SAF'","'TBD'","'VIS'"]
    let str1 = str.substring(str.indexOf('pos_log(') + 8 , str.indexOf(') values'))
    let str2 = str.substring(str.indexOf('values(') + 7 , str.lastIndexOf(')'))
    let arr1 = str1.split(",")
    let arr2 = str2.split(",")
     return TendorMediaArr.indexOf(arr2[arr1.indexOf('"Tendor_No"')]) == -1 ? err=`Invalid Tendor Media Number!`:``
    }


let readExcel = async (fileName, posSource, posTrackingId, bodyFileName, outlet) => {
    try {
        let checkDuplicateExcel = 1;
        let findErr = 0;
        const result = await excelToJson({
            source: fs.readFileSync(`uploads/${fileName}`)
        });
        let cnt = 1;
        let resultArr = []
        let arr = []
        let query = `INSERT INTO tlcsalesforce.pos_log(outlet,pos_source,status,pos_tracking_id,`;
        for (d of result['Sheet1']) {
            let query2 = ``;
            let len = Object.entries(d).length
            let indexForMember = 0;
            let lockIndex = 0;
            let duplicateCheckArr = [];
            if (cnt == 1) {
                let n = 0;
                for (e of Object.entries(d)) {
                    console.log("pos source and excel field name",posSource,e[1])
                    let resultObj = await pool.query(`select  table_field_name__c from tlcsalesforce.pos_mapping__c where pos_source__c='${posSource}' and excel_field_name__c='${e[1]}'`)
                    //    // console.log(`select  table_field_name__c from tlcsalesforce.pos_mapping__c where pos_source__c='${posSource}' and excel_field_name__c='${e[1]}'`)
                    e[1] = (resultObj) ? resultObj.rows[0]['table_field_name__c'] : ''
                    // len - 1 == n ? query += `"${e[1]}") values('${outlet}','${posSource}','NEW','${posTrackingId}',` : query += `"${e[1]}",`
                    resultObj.rows[0]['table_field_name__c'] == 'Card_No' ? lockIndex = indexForMember : ``
                    indexForMember++

                    query += `"${e[1]}",`
                    arr.push(e[1])
                    n++
                }
                query += `"member_id") values('${outlet}','${posSource}','NEW','${posTrackingId}',`

            } else {
                indexForMember = 0
                let cardNo = ''
                let n = 0;
                let obj = {};

                Object.entries(d).map(e => {
                    lockIndex == indexForMember ? cardNo = `${e[1]}` : ``
                    indexForMember++;
                    // len - 1 == n ? query2 += `'${e[1]}');` : query2 += `'${e[1]}',`
                    query2 += `'${e[1]}',`
                    obj[arr[n++]] = e[1]
                })
                query2 += `'${(await getMemberId(cardNo))}')`
                resultArr.push(obj)
                try {
                    if (findErr == 0) {
                        console.log(`${query} ${query2} RETURNING mapping_id`);
                        let insertDataToLog = await pool.query(`${query} ${query2} RETURNING mapping_id`)
                        let insertedlogId = insertDataToLog.rows[0].mapping_id ? insertDataToLog.rows[0].mapping_id : 0
                       console.log(`${query} ${query2}`)
                        let checkDuplicate = await findDuplicate(`${query} ${query2}`)
                        console.log(`------check duplicate=${checkDuplicate}---------`)
                        if(posSource == 'GM-POS'){
                            let errTendor =findTendorMediaNumber(`${query} ${query2}`)
                            if(errTendor){
                                console.log(`update tlcsalesforce.pos_log set status='SYNC_ERROR',error_description='${errTendor}' where mapping_id = '${insertedlogId}'`)
                               await pool.query(`update tlcsalesforce.pos_log set status='SYNC_ERROR',error_description='${errTendor}' where mapping_id = '${insertedlogId}'`)
                            }
                        }
                        if (checkDuplicate > 0) {
                            checkDuplicateExcel++;
                            let updatelog = await pool.query(`update tlcsalesforce.pos_log set status='SYNC_ERROR',error_description='duplicate record' where mapping_id = '${insertedlogId}'`)
                        }
                    }
                } catch (e1) {
                    console.log(`==========+++++++++++++=========++++++++++=========+++++++++`)
                    console.log(`${e1}`)
                    if (!(`${e1}`.includes('duplicate key value'))) {
                        findErr = 1;
                        fs.unlink(`uploads/${fileName}`, (err, da) => {
                            if (err)
                                throw err;
                        })
                        // deleteErrorExcelRecords(posTrackingId)
                        await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e1}' where file_name__c = '${fileName}'`)
                        if (bodyFileName)
                            return { code: 1, err: `${e1}` };
                    } else {
                        // checkDuplicateExcel++;
                    }

                }

            }
            cnt = 2;
        }
        if (findErr == 0) {
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    throw err;
            })
            console.log(`-----------------------------`)
            console.log(`${result['Sheet1'].length} == ${checkDuplicateExcel}`)
            console.log(`+{++++++++++++++++++++}+`)
            if (checkDuplicateExcel == result['Sheet1'].length) {
                updateStatusForDuplicateRecord(fileName)
                if (bodyFileName)
                    return { code: 1, err: `DUPLICATE FILE` }
            } else {
                await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_STARTED' where file_name__c = '${fileName}'`)
                console.log(`_____=+============_________=`)
                console.log(bodyFileName);
                if (bodyFileName)
                    await getPosLogData(bodyFileName);
                console.log(`_____=+============_________=`)
            }

        }
        // resolve(`SUCCESS`)
    } catch (e) {
        console.log(e)

        // deleteErrorExcelRecords(posTrackingId)
        await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e}' where file_name__c = '${fileName}'`)
        fs.unlink(`uploads/${fileName}`, (err, da) => {
            if (err)
                throw err;
        })
        console.log(e);
        if (bodyFileName)
            return { code: 1, err: `${e}` };
    }
}


let updateStatusForDuplicateRecord = async (fileName) => {
    await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='DUPLICATE FILE' where file_name__c = '${fileName}'`)
}


let getFileFromFTP = async (fileArr, fileName) => {
    return new Promise(async (resolve, reject) => {
        try {
            ftpConnection = await ftp.connect();
            for (file of fileArr) {
                try {
                    // console.log(`download to ====`)
                    await ftpConnection.downloadTo(`uploads/${file['file_name']}`, `POS/${file['file_name']}`)
                    // console.log(`rename to ====`)
                    await ftpConnection.rename(`POS/${file['file_name']}`, `POS/POS_ARCHIVE/${file['file_name']}`)
                    console.log(`readexcel to ====`)
                    let checkErr = await readExcel(file['file_name'], file['pos_source'], file['sync_id'], fileName, file['outlet'])
                    if (checkErr && checkErr.code == 1)
                        reject(`${checkErr.err}`)
                } catch (e) {
                    console.log(e)
                    if (fileName)
                        reject(e)
                    await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e}' where file_name__c = '${file['file_name']}'`)
                }
            }
            ftpConnection.close();
            resolve(`SUCCESS`)
        } catch (err) {
            console.log(`${err}`)
            if (fileName)
                reject(`${err}`)
        }
    })

}

let getPosLogData = async (fileName) => {
    try {
        console.log("get POS data API called");
        let findProperty = await pool.query(`select id pos_tracking_id,pos_source__c  propertyuniqueidentifier__c, (select sfid from tlcsalesforce.property__c where unique_identifier__c = pt.propertyuniqueidentifier__c) property_id from tlcsalesforce.pos_tracking__c pt where status__c = 'SYNC_STARTED'`)
        let propertyResult = (findProperty) ? findProperty.rows : [];
        let propertObj = {};
        for (p of propertyResult) {
            propertObj[p.pos_tracking_id] = p.property_id
        }
        console.log(`--------------------------------`)
        console.log(`${JSON.stringify(propertObj)}`)
        let qry = ``
        if (fileName)
            qry = `select *,pt.id posTrackingId,pl.outlet  outlet_id,pos_source__c from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c pt on pl.pos_tracking_id = pt.id  where pl.status='NEW' and pt.status__c = 'SYNC_STARTED' and pt.file_name__c = '${fileName}'`;
        else
            qry = `select *,pt.id posTrackingId,pl.outlet outlet_id,pos_source__c from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c pt on pl.pos_tracking_id = pt.id  where pl.status='NEW' and pt.status__c = 'SYNC_STARTED'`;
        console.log("before query call");
        console.log(qry);
        const result = await pool.query(qry);
        
        console.log("after query call");
        console.log(result.rows);
        let queryForErrorFind=``
        console.log("+++++++++++++++++++++ before calling postLogDataToPosChequeDetails ++++++++++++")
         await postLogDataToPosChequeDetails(result.rows, propertObj);
         console.log("+++++++++++++++++++++ after  calling postLogDataToPosChequeDetails ++++++++++++")
        if (fileName){
            console.log("inside file name");
            
            queryForErrorFind=await pool.query(`select distinct pt.id "posTrackingId" from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c pt on pl.pos_tracking_id = pt.id  where pl.status='SYNC_ERROR' and  pt.file_name__c = '${fileName}' and error_file_url__c is NULL`) 
           
        }else{
            console.log("inside file name else");

            
            queryForErrorFind=await pool.query(`select distinct pt.id "posTrackingId",pl.status,error_file_url__c from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c
            pt on pl.pos_tracking_id = pt.id  where pl.status='SYNC_ERROR'  and error_file_url__c is NULL`) 
            
        }
        for(let n of queryForErrorFind.rows){
            console.log("nnnnn",n)
            let getFileURL= await getErrorDataFromPOSLog(n.posTrackingId);
            console.log("getFileURL",getFileURL);
            await pool.query(`update tlcsalesforce.pos_tracking__c set error_file_url__c='${getFileURL}' where id='${n.posTrackingId}'`)
            
        }
        
   
        return result.rows;
    } catch (e) {
        console.log(e);
        return 'SYNC_ERROR';
    }

}

let postLogDataToPosChequeDetails = async (data, propertObj) => {
    try {
        console.log("inside postLogDataToPosChequeDetails ");
          
       console.log("data for POS",data);
       
        for (n of data) {
       
                       
            console.log("POS source",n.pos_source);
            console.log("n.BillDate",n.BillDate)
            ConvertedBillDate = convert(n.BillDate);
            console.log('+++++++++++++++++++++++++++++++');
            console.log('mapping ID', n.mapping_id)
            console.log("ConvertedBillDate",ConvertedBillDate);
            console.log('+++++++++++++++++++++++++++++++')
            let billDiscount = parseInt(n.Disc_Food) + parseInt(n.Disc_Soft_Bev) + parseInt(n.Disc_Misc) + parseInt(n.Disc_Dom_Liq) + parseInt(n.Disc_Imp_Liq) + parseInt(n.Disc_Tobacco);
            let verifyBillTotal = parseInt(n.Food) + parseInt(n.Soft_Bev) + parseInt(n.Misc) + parseInt(n.Dom_Liq) + parseInt(n.Imp_Liq) + parseInt(n.Tobacco);

            let billTotal = parseInt(n.Grossbilltotal);
            // let grossbilltotal = billTotal - billDiscount + parseInt(n.Tax)
            let grossbilltotal = billTotal - billDiscount ;
            console.log('type');
            
            console.log('billDiscount', billDiscount);
            console.log('billTotal', billTotal);
            console.log("+++++++++++++validation of HHMM++++++++++++++++++++");
            let validateTime = await validateHhMm(n.BillTime);
            let validateDate = await dateValidation(ConvertedBillDate)
            console.log("validateTime,dateValidation", validateTime,validateDate);

            
            if(validateDate){
                if(validateTime){
                    console.log("time validation ");
                    if (billTotal >= verifyBillTotal-2 && billTotal <= verifyBillTotal+2) {
                        console.log("uploading POS log data to POS cheque details");
                        console.log(`INSERT INTO tlcsalesforce.pos_cheque_details__c(
                            membership__r_membership_number__c, bill_number__c, bill_time__c,bill_date__c,pos_code__c,pax__c,bill_tax__c,gross_bill_total__c,outlet__c,pos_log_id,covers__c,actual_bill_date__c,property__c,bill_total__c,bill_disc__C,created_time__c,member_id)
                            VALUES ('${n.Card_No}', '${n.Bill_No}', '${n.BillTime}', '${ConvertedBillDate}','${n.Pos_Code}', '${n.Actual_Pax}',  '${n.Tax}','${grossbilltotal}','${n.outlet_id}','${n.mapping_id}','${n.Actual_Pax}', '${ConvertedBillDate}','${propertObj[n.pos_tracking_id]}','${billTotal}','${billDiscount}',now(),'${n.member_id}') RETURNING id`)
                        let insertedValue = await pool.query(`INSERT INTO tlcsalesforce.pos_cheque_details__c(
                        membership__r_membership_number__c, bill_number__c, bill_time__c,bill_date__c,pos_code__c,pax__c,bill_tax__c,gross_bill_total__c,outlet__c,pos_log_id,covers__c,actual_bill_date__c,property__c,bill_total__c,bill_disc__C,created_time__c,member_id)
                        VALUES ('${n.Card_No}', '${n.Bill_No}', '${n.BillTime}', '${ConvertedBillDate}','${n.Pos_Code}', '${n.Actual_Pax}',  '${n.Tax}','${grossbilltotal}','${n.outlet_id}','${n.mapping_id}','${n.Actual_Pax}', '${ConvertedBillDate}','${propertObj[n.pos_tracking_id]}','${billTotal}','${billDiscount}',now(),'${n.member_id}') RETURNING id`);
                    
                        console.log('id', insertedValue.rows[0].id, 'mapping iD', n.mapping_id);
                       
                        let syncUpadte = await insertInPosChequeDetailsItemCategory(insertedValue.rows[0].id, n, billDiscount, grossbilltotal);
        
                    }
                    else {
                        status = "SYNC_ERROR"
                        errorDiscription = "ToTAL value mismatch,please check total"
                        console.log(`Please check total bill for card number ${n.Card_No} `);
                        let getStatus = await pool.query(`update tlcsalesforce.pos_log set status='${status}', error_description='${errorDiscription}' where mapping_id='${n.mapping_id}' RETURNING status`);
        
                    }
    
                }else{
                    status = "SYNC_ERROR"
                    errorDiscription = "error:time and should be in HH:MM and dd-mon-yyyy"
                    console.log("error:time and should be in HH:MM and dd-mon-yyyy");
                    let getStatus = await pool.query(`update tlcsalesforce.pos_log set status='${status}', error_description='${errorDiscription}' where mapping_id='${n.mapping_id}' RETURNING status`);
                    
    
                }

            }else{
                   status = "SYNC_ERROR"
                   errorDiscription = "error:date should be in  dd-mon-yyyy"
                   console.log("error:date should be in dd-mon-yyyy");
                   let getStatus = await pool.query(`update tlcsalesforce.pos_log set status='${status}', error_description='${errorDiscription}' where mapping_id='${n.mapping_id}' RETURNING status`);


            }
            

        
       
        }

            return;

    } catch (e) {
        updateStatusPostrackingTable('SYNC_ERROR', n.pos_tracking_id);
    }

}



let insertInPosChequeDetailsItemCategory = async (foreignKey, data, billDiscount, billTotal) => {
    try {
        // console.log("insert in insertInPosChequeDetailsItemCategory");

        await pool.query(`INSERT INTO tlcsalesforce.pos_cheque_details_item_category__c(
       cheque__c,gross_amount__c,tax_amount__c,disc_amount__c,net_amount__c)
      VALUES ('${foreignKey}', '${data.Grossbilltotal}', '${data.Tax}','${billDiscount}','${billTotal}') RETURNING id`);
        console.log('data.mapping id', data.mapping_id);
        console.log('data.pos_tracking_id', data.pos_tracking_id);
        updatePosLogTableNewToSYnc('SYNC_COMPLETED', data.mapping_id, data.pos_tracking_id);

        


    } catch (e) {
        updatePosLogTableNewToSYnc('SYNC_ERROR', data.mapping_id);
        updateStatusPostrackingTable('SYNC_ERROR', data.pos_tracking_id);
        return
    }



}

//convert date
let convert = (str) => {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

//convert Time
let convertTime = (str) => {
    var date = new Date(str),
        hrs = ("0" + (date.getMonth() + 1)).slice(-2),
        min = ("0" + date.getDate()).slice(-2);
    return [hrs, min].join(":");
}

let updatePosLogTableNewToSYnc = (status, mappingId, posTrackingId) => {
    try {
        console.log("changing the sync status");
        // console.log('with mapping id', mappingId)
        let getStatus = pool.query(`update tlcsalesforce.pos_log set status='${status}' where mapping_id='${mappingId}' RETURNING status`);
        updateStatusPostrackingTable('SYNC_COMPLETED', posTrackingId);
        
    } catch (e) {
        updateStatusPostrackingTable('SYNC_ERROR', posTrackingId);

    }

}


let updateStatusPostrackingTable = async(status, posTrackingId) => {
    try {
        // console.log("updating pos_tracikng table status ");
       await pool.query(`update tlcsalesforce.pos_tracking__c set status__c='${status}' where id='${posTrackingId}'`);
       return;
    } catch (e) {
        return e
    }

};



let getErrorDataFromPOSLog=async (posTrackingId)=>{
    try{
        console.log("++++Get POS log data with Error status+++++");
          console.log(`select "Card_No","Bill_No","BillDate","BillTime","Actual_Pax", "Pos_Code" , "Food", "Disc_Food"
          ,"Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Grossbilltotal","Disc_Misc","Tax",status,error_description
           from tlcsalesforce.pos_log where pos_tracking_id='${posTrackingId}' and status='SYNC_ERROR'`);
         let result=await pool.query(`select "Card_No","Bill_No","BillDate","BillTime","Actual_Pax", "Pos_Code" , "Food", "Disc_Food"
        ,"Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Grossbilltotal","Disc_Misc","Tax",status,error_description
         from tlcsalesforce.pos_log where pos_tracking_id='${posTrackingId}' and status='SYNC_ERROR'`);
           console.log("result.rows",result.rows);
         if( result.rows)
     result ? result.rows : null
         let email=await pool.query(`select user_email_id__c,pos_source__c from tlcsalesforce.pos_tracking__c  where id='${posTrackingId}'`) 
         email ? email.rows : null
         if( result.rows.length > 0){
        console.log("Error data is",result.rows);
        let fileURL= await generateCSV(result.rows, email.rows[0].user_email_id__c, email.rows[0].pos_source__c);
        return fileURL
     }else{
        console.log("Error data is",result.rows);
        console.log("no error data found");
        return

     }
     


    }catch(e){
        console.log("cannot find pos tracking ID");
        return e
    }
   
}


let generateCSV=async(data,email,posSource)=>{
    // let headerArr = [{id:"SR No.",title:"SR No."}]
    // for(let [key,value] of Object.entries(data[0])){
    //     headerArr.push({id: `${key}`, title:`${key}`})
    // }
    
    let fileName = `POS_Error_${require('dateformat')(new Date(), "yyyymmddhMMss")}.csv`
    let path = `./uploads/${fileName}`
    // const csvWriter = createCsvWriter({
    //     path: path,
    //     header: headerArr
    // });
    let bodyArr = [];
    let index = 1;
    for(let d of data){
        let bodyObj = {"SR No.":index++}
        
        for(let [key,value] of Object.entries(d)){
            bodyObj[`${key}`] = `${value}`
        }   
        bodyArr.push(bodyObj)
    }
    const csv = new ObjectsToCsv(bodyArr)
    await csv.toDisk(`${path}`)    
    // const records = bodyArr;
    // console.log(headerArr)
     console.log("email value ",email);

//    let result= await csvWriter.writeRecords(records) 
   let fileUrl=await uploadErrorFileToFTP (fileName,email,posSource)
    
   console.log("path",fileUrl);
   return  fileUrl;  
} // returns a promise


let uploadErrorFileToFTP = async (fileName,email,posSource) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let path = `POS/error/${fileName}`
            ftpConnection = await ftp.connect();
              await ftpConnection.uploadFrom(`uploads/${fileName}`, `${path}`)
            ftpConnection.close();
            console.log("email value uploadErrorFileToFTP ",email);
            if(email){
                let logoName='';
                if(posSource == 'POS'){
                    logoName=reportType[0].logoName;
        
                }
                else if(posSource == 'GM-POS'){
                    logoName=reportType[1].logoName;
                }
                console.log("email will send");
            await sendMail.sendPOSErrorReport(`uploads/${fileName}`,'POS Error Report',email,logoName);
            }
            else{
                fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })

            }
            
            resolve(path)
        } catch (e) {
            // await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}


let getRefferalData2 = (data) => {
    console.log('refferalData', data);
    return new Promise((resolve, reject) => {
        try {
            console.log("under the resolve promise", data);
            resolve(data)

        } catch (err) {
            console.log("under the promise reject");
            reject("promise reject");
        }
    })
}




//Direct uploading file from FTP 
let directUploadingFileFromFTP=async()=>{
    ftpConnection = await ftp.connect();
    // // console.log(await ftpConnection.list())
    let data =await ftpConnection.list('/POS_direct_uploaded')
    for(d of data ){
       let dir1= d['name']
       //check for dir
       let data1 =await ftpConnection.list(`/POS_direct_uploaded/${dir1}`)
       for(d1 of data1){
        let outlet = d1['name']
        let posSource = dir1;
        console.log(dir1+'/'+d1['name'])
        let data2 =await ftpConnection.list(`/POS_direct_uploaded/${posSource}/${outlet}`)
        for(d2 of data2){
            result=await pool.query(`
                    select 
                    p1.name outletName,p1.unique_identifier__c  outletUniqueIdentifier, 
                    p2.name propertyName,p2.unique_identifier__c  propertyUniqueIdentifier,
                    p4.name brandName,p4.unique_identifier__c  brandUniqueIdentifier,
                    p5.name programName,p5.unique_identifier__c  programUniqueIdentifier
                    from tlcsalesforce.outlet__c p1 left join tlcsalesforce.property__c p2 on p1.property__c=p2.sfid
                    left join tlcsalesforce.subbrand__c p3 on p2.sub_brand__c=p3.sfid 
                    left join tlcsalesforce.brand__c p4 on p3.brand__c=p4.sfid 
                    left join tlcsalesforce.program__c p5 on p4.sfid=p5.brand__c where p1.unique_identifier__c='${outlet}'
                     limit 1`)

                    console.log("result rows",result.rows)
                    let resultValue = (result) ? result.rows[0] : null
                    
                    let body={}
                    body.brandName=resultValue.brandname;
                    body.propertyName=resultValue.propertyname;
                    body.programName=resultValue.programname;
                    body.outletName=resultValue.outletname;
                    body.userId='';
                    body.posSource=posSource;
                    body.brandUniqueIdentifier=resultValue.branduniqueidentifier;
                    body.programUniqueIdentifier=resultValue.programuniqueidentifier;
                    body.propertyUniqueIdentifier=resultValue.propertyuniqueidentifier
                    body.outletUniqueIdentifier=resultValue.outletuniqueidentifier;
                    body.userEmail='';
                    body.isDirectUploaded=true

                    fileName=await createFileName(body,d2['name']);
                    console.log("body",body);
                    console.log("fileName",fileName);
            //create a record in pos_tracking table
            //After inserting data to pos_tracking atble rename the file and move it to pos folder with current format of filename
            console.log("fileName",dir1+'/'+d1['name']+'/'+d2['name'])
            await ftpConnection.rename(`POS_direct_uploaded/${posSource}/${outlet}/${d2['name']}`, `POS/${fileName}`)
            console.log("After file++++++++++++++");
            await updatePOSTracking(body, fileName);
            console.log("AFTER UPDATEING IN DIRECT POS TRACKING")

        }
    
       }
      
    }
    
    ftpConnection.close();
    return data
    }


// creating unique filename
let createFileName= (body,file)=>{
    let fileName =``;
    console.log("file name body ",body)
    fileName = `${body.brandUniqueIdentifier}-${body.programUniqueIdentifier}-${body.propertyUniqueIdentifier}-${body.outletUniqueIdentifier}-${require('dateformat')(new Date(), "yyyymmddhMMss")}-${file}`  
    console.log("fileName",fileName)
    return fileName;
}



module.exports = {
    uploadExcel,
    getPosData,
    getPosLogData,
    getRefferalData2
}