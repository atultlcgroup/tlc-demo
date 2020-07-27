const { writeFileSync } = require("fs");
const pool = require("../databases/db").pool
const ftp = require('../databases/ftp')
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');


let findDuplicate =async (Card_No,Bill_No,BillDate,BillTime)=>{
    let result= await pool.query(`select Card_No from tlcsalesforce.pos_log where Card_No='${Card_No}' and Bill_No='${Bill_No}' and BillDate='${BillDate}' and BillTime = '${BillTime}'`)
    return result ? result.rows.length : 0;
}
let uploadExcelToFTP = async (fileName, file) => {
    return new Promise(async(resolve,reject)=>{
        try {
            ftpConnection = await ftp.connect();
            // console.log(await ftpConnection.list())
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
        return new Promise(async (resolve,reject)=>{
            console.log(`from here 1`)
        try{
        const data = await writeFileSync(`./uploads/${fileName}`, `${file}`, { encoding: "base64" })
        console.log(`from here 1`)
        await uploadExcelToFTP(fileName, file);
        await updatePOSTracking(body, fileName)
        resolve(`SUCCESSFULLY TRANSFERRED`); 
        }catch(err){
             reject(err)
        }
        })
}

let updatePOSTracking = (body, fileName) => {
    try {

        // console.log(`INSERT INTO tlcsalesforce.pos_tracking__c(
        //     brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "branduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
        //    VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'))`)
               pool.query(`INSERT INTO tlcsalesforce.pos_tracking__c(
             brand_name__c, property_name__c, program_name__c, outlet_name__c, status__c, file_name__c, error_description__c, file_uploaded_by__c ,createddate, pos_source__c, "banduniqueidentifier__c","programuniqueidentifier__c","propertyuniqueidentifier__c","outletuniqueidentifier__c",outlet__c)
            VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}','${body.brandUniqueIdentifier}','${body.programUniqueIdentifier}','${body.propertyUniqueIdentifier}','${body.outletUniqueIdentifier}',(select sfid  from tlcsalesforce.outlet__c where unique_identifier__c = '${body.outletUniqueIdentifier}'))`)
    } catch (e) {
        return e;
    }
}


let getPosData = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log('get Pos data api called');
            let qry = ``;
            if(fileName)
            qry = `select file_name__c file_name,pos_source__c pos_source,id sync_id,outlet__c outlet from tlcsalesforce.pos_tracking__c where status__c='UPLOADED' and file_name__c = '${fileName}'`;
            else
            qry = `select file_name__c file_name,pos_source__c pos_source,id sync_id,outlet__c outlet from tlcsalesforce.pos_tracking__c where status__c='UPLOADED'`;
            const result = await pool.query(qry);
            await getFileFromFTP((result) ? result.rows : null,fileName);
            resolve(`SUCCESS`)
        } catch (e) {
            console.log(`${e}`)
            reject(`${e}`)
        }
    })
}

let deleteErrorExcelRecords=(tracking_id)=>{
    pool.query(`delete from tlcsalesforce.pos_log where pos_tracking_id = ${tracking_id}`)
}


let readExcel = async (fileName, posSource,posTrackingId,bodyFileName,outlet ) => {
        try {
            let checkDuplicateExcel = 1;
            let findErr =0 ;
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
                if (cnt == 1) {
                    let n = 0;
                    for (e of Object.entries(d)) {
                        let resultObj = await pool.query(`select  table_field_name__c from tlcsalesforce.pos_mapping__c where pos_source__c='${posSource}' and excel_field_name__c='${e[1]}'`)
                    //    console.log(`select  table_field_name__c from tlcsalesforce.pos_mapping__c where pos_source__c='${posSource}' and excel_field_name__c='${e[1]}'`)
                        e[1] = (resultObj) ? resultObj.rows[0]['table_field_name__c'] : ''
                        len - 1 == n ? query += `"${e[1]}") values('${outlet}','${posSource}','NEW','${posTrackingId}',` : query += `"${e[1]}",`
                        arr.push(e[1])
                        n++
                    }
                
                } else {
                    let n = 0;
                    let obj = {};
                    Object.entries(d).map(e => {
                        len - 1 == n ? query2 += `'${e[1]}');` : query2 += `'${e[1]}',`
                        obj[arr[n++]] = e[1]
                    })
                    resultArr.push(obj)
                    try{
                        if(findErr == 0)
                        await pool.query(`${query} ${query2}`)
                    }catch(e1){
                        console.log(`==========+++++++++++++=========++++++++++=========+++++++++`)
                        console.log(`${e1}`)
                        if(!(`${e1}`.includes('duplicate key value'))){
                            findErr= 1;
                        fs.unlink(`uploads/${fileName}`, (err, da) => {
                            if (err)
                                throw err;
                        })
                        deleteErrorExcelRecords(posTrackingId)
                        await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e1}' where file_name__c = '${fileName}'`)
                        console.log(e1);
                        if(bodyFileName)
                         return {code:1,err:`${e1}`};
                      }else{
                        checkDuplicateExcel++;
                      }
                     
                    }
                   
                }
                cnt = 2;
            }
            if(findErr==0){
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    throw err;
            })
            console.log(`-----------------------------`)
            console.log(`${result['Sheet1'].length} == ${checkDuplicateExcel}`)
            console.log(`+{++++++++++++++++++++}+`)
            if(checkDuplicateExcel == result['Sheet1'].length){
                   updateStatusForDuplicateRecord(fileName)
                   if(bodyFileName)
                   return {code:1,err:`DUPLICATE FILE`}
            }else{
                await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_STARTED' where file_name__c = '${fileName}'`)
                console.log(`_____=+============_________=`)
                console.log(bodyFileName);
                if(bodyFileName)
                await getPosLogData(bodyFileName);
                console.log(`_____=+============_________=`)
            }
         
        }
            // resolve(`SUCCESS`)
        } catch (e) {
   
            deleteErrorExcelRecords(posTrackingId)
            await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e}' where file_name__c = '${fileName}'`)
            fs.unlink(`uploads/${fileName}`, (err, da) => {
                if (err)
                    throw err;
            })
            console.log(e);
            if(bodyFileName)
             return {code:1,err:`${e}`};
        }
}


let updateStatusForDuplicateRecord = async(fileName)=>{
    await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='DUPLICATE FILE' where file_name__c = '${fileName}'`)
} 


let getFileFromFTP = async (fileArr , fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            ftpConnection = await ftp.connect();
            for (file of fileArr) {
                try {
                    console.log(`download to ====`)
                    await ftpConnection.downloadTo(`uploads/${file['file_name']}`, `POS/${file['file_name']}`)
                    console.log(`rename to ====`)
                    await ftpConnection.rename(`POS/${file['file_name']}`, `POS/POS_ARCHIVE/${file['file_name']}`)
                    console.log(`readexcel to ====`)
                    let checkErr =await readExcel(file['file_name'], file['pos_source'], file['sync_id'],fileName,file['outlet'])
                    if(checkErr && checkErr.code==1)
                    reject(`${checkErr.err}`)
                } catch (e) {
                    if(fileName)
                    reject(e)
                    await pool.query(`update tlcsalesforce.pos_tracking__c set status__c = 'SYNC_ERROR',error_description__c='${e}' where file_name__c = '${file['file_name']}'`)
                }
            }
            ftpConnection.close();
            resolve(`SUCCESS`)
        } catch (err) {
            console.log(`${err}`)
            if(fileName)
            reject( `${err}`)
        }
    })
   
}

let getPosLogData = async (fileName) => {
    try {
        console.log("get POS data API called");
        let qry = ``
        if(fileName)
        qry=  `select *,pl.outlet  outlet_id from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c pt on pl.pos_tracking_id = pt.id  where pl.status='NEW' and pt.status__c = 'SYNC_STARTED' and pt.file_name__c = '${fileName}'`;
        else
        qry = `select *,pl.outlet  outlet_id from tlcsalesforce.pos_log pl left join tlcsalesforce.pos_tracking__c pt on pl.pos_tracking_id = pt.id  where pl.status='NEW' and pt.status__c = 'SYNC_STARTED'`;
        console.log(qry)

        const result = await pool.query(qry);
        console.log(result.rows)
        await postLogDataToPosChequeDetails(result.rows);

        return result.rows;
    } catch (e) {
        return 'SYNC_ERROR';
    }

}

let postLogDataToPosChequeDetails = async (data) => {
    try {
        for (n of data) {
            ConvertedBillDate = convert(n.BillDate);
            console.log('+++++++++++++++++++++++++++++++');
            console.log('mapping ID', n.mapping_id)
            console.log(ConvertedBillDate);
            console.log('+++++++++++++++++++++++++++++++');

            console.log("uploading POS log data to POS cheque details");
            let insertedValue = await pool.query(`INSERT INTO tlcsalesforce.pos_cheque_details__c(
            membership__r_membership_number__c, bill_number__c, bill_time__c,bill_date__c,pos_code__c,pax__c,bill_tax__c,gross_bill_total__c,outlet__c,pos_log_id)
          VALUES ('${n.Card_No}', '${n.Bill_No}', '${n.BillTime}', '${ConvertedBillDate}','${n.Pos_Code}', '${n.Actual_Pax}',  '${n.Tax}','${n.Grossbilltotal}','${n.outlet_id}','${n.mapping_id}') RETURNING id`);

            console.log('id', insertedValue.rows[0].id, 'mapping iD', n.mapping_id);
            console.log('n', n)

            let syncUpadte = await insertInPosChequeDetailsItemCategory(insertedValue.rows[0].id, n);


        }

    } catch (e) {
        updateStatusPostrackingTable('SYNC_ERROR', n.pos_tracking_id);
    }

}



let insertInPosChequeDetailsItemCategory = async (foreignKey, data) => {
    try {
        console.log("insert in insertInPosChequeDetailsItemCategory");

        await pool.query(`INSERT INTO tlcsalesforce.pos_cheque_details_item_category__c(
       cheque__c,gross_amount__c,tax_amount__c)
      VALUES ('${foreignKey}', '${data.Grossbilltotal}', '${data.Tax}') RETURNING id`);
        console.log('data.mapping id', data.mapping_id);
        console.log('data.pos_tracking_id', data.pos_tracking_id);
        updatePosLogTableNewToSYnc('SYNC_COMPLETED', data.mapping_id, data.pos_tracking_id);




    } catch (e) {
        updatePosLogTableNewToSYnc('SYNC_ERROR', data.mapping_id);
        updateStatusPostrackingTable('SYNC_ERROR', data.pos_tracking_id);
    }



}


let convert = (str) => {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}


let updatePosLogTableNewToSYnc = (status, mappingId, posTrackingId) => {
    try {
        console.log("changing the sync status");
        console.log('with mapping id', mappingId)
        let getStatus = pool.query(`update tlcsalesforce.pos_log set status='${status}' where mapping_id='${mappingId}' RETURNING status`);
        updateStatusPostrackingTable('SYNC_COMPLETED', posTrackingId);
    } catch (e) {
        updateStatusPostrackingTable('SYNC_ERROR', posTrackingId);

    }

}


let updateStatusPostrackingTable = (status, posTrackingId) => {
    try {
        console.log("updating pos_tracikng table status ");
        pool.query(`update tlcsalesforce.pos_tracking__c set status__c='${status}' where id='${posTrackingId}'`);

    } catch (e) {
        return e
    }

};


module.exports = {
    uploadExcel,
    getPosData,
    getPosLogData

}