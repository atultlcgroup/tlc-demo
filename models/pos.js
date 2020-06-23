const {writeFileSync} = require("fs");
const pool = require("../databases/db").pool
const ftp = require('../databases/ftp')
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

let uploadExcelToFTP=async(fileName,file)=>{
    try{
    ftpConnection = await ftp.connect();
    // console.log(await ftpConnection.list())
        await ftpConnection.uploadFrom(`uploads/${fileName}`, `POS/${fileName}`)
        ftpConnection.close();
        fs.unlink(`uploads/${fileName}`,(err, da)=>{
            if(err)
            throw err;
        })
        return 'Success'
    }catch( e ){
        return e;
    }
} 


let uploadExcel=async(file ,fileName , body)=>{
   try{      
    console.log(`from here 1`)
   const data=await writeFileSync(`./uploads/${fileName}`, `${file}`,{encoding:"base64"})
   console.log(`from here 1`)
   await uploadExcelToFTP(fileName,file); 
   updatePOSTracking(body,fileName)
    return data;
   }catch( e ){
        console.log(e)
        return e
   }
}

let updatePOSTracking = (body, fileName) => {
    try {
        pool.query(`INSERT INTO tlcsalesforce.pos_tracking(
             brand_name, property_name, program_name, outlet_name, status, file_name, error_description, file_uploaded_by,created_date , pos_source)
            VALUES ('${body.brandName}', '${body.propertyName}', '${body.programName}', '${body.outletName}','UPLOADED', '${fileName}',  '','${body.userId}',now(),'${body.posSource}')`)
    } catch (e) {
        return e;
    }
}


let getPosData=async()=>{
    try{
        console.log('get Pos data api called');
        const result=await pool.query(`select file_name,pos_source from tlcsalesforce.pos_tracking where status='UPLOADED'`);
        getFileFromFTP((result) ? result.rows : null);
    }catch( e ){
        return e;
    }
}




let readExcel=async(fileName,posSource)=>{
    try{
        const result = await excelToJson({  
            source: fs.readFileSync(`uploads/${fileName}`)});
            let cnt = 1;
            let resultArr =[]
            let arr =[]
            let query = `INSERT INTO tlcsalesforce.pos_log(pos_source,status,`;
            for(d of result['Sheet1']){
                let query2=``;
                let len = Object.entries(d).length
                if(cnt == 1){
                    let n = 0;
                    for(e of Object.entries(d)){
                        // console.log(`select table_field_name from tlcsalesforce.pos_mapping where pos_source='${posSource}' and excel_field_name='${e[1]}'`)
                        let resultObj = await pool.query(`select table_field_name from tlcsalesforce.pos_mapping where pos_source='${posSource}' and excel_field_name='${e[1]}'`)
                        e[1] = (resultObj) ? resultObj.rows[0]['table_field_name'] : ''
                        // return
                        // console.log(n)
                        len- 1 == n ? query +=`"${e[1]}") values('${posSource}','NEW',` : query +=`"${e[1]}",` 
                        arr.push(e[1])
                        n++
                    }
                }else{
                    let n = 0;
                    let obj = {};
                    Object.entries(d).map(e=>{
                        len- 1 == n ? query2 +=`'${e[1]}');` : query2 +=`'${e[1]}',` 
                        obj[arr[n++]] = e[1] 
                    })
                    resultArr.push(obj)
                    await pool.query(`${query} ${query2}`)
                    // console.log(`${query} ${query2}`)
                    }
                cnt = 2 ;
            }
            fs.unlink(`uploads/${fileName}`,(err, da)=>{
                if(err)
                throw err;
            })
            await pool.query(`update tlcsalesforce.pos_tracking set status = 'SYNC STARTED ' where file_name = '${fileName}'`)
    }catch(e){
        await pool.query(`update tlcsalesforce.pos_tracking set status = 'SYNC ERROR',error_description='${e}' where file_name = '${fileName}'`)
        console.log(e)
    }
}


let getFileFromFTP=async(fileArr)=>{
    try{
    ftpConnection = await ftp.connect();
    for(file of fileArr){
        try{
            await ftpConnection.downloadTo(`uploads/${file['file_name']}`, `POS/${file['file_name']}`)
            await ftpConnection.rename(`POS/${file['file_name']}`,`POS/POS_ARCHIVE/${file['file_name']}`)
            await readExcel(file['file_name'],file['pos_source'])
        }catch(e){
            await pool.query(`update tlcsalesforce.pos_tracking set status = 'SYNC ERROR',error_description='${e}' where file_name = '${file['file_name']}'`)
        }
    }
    ftpConnection.close();
    }catch(err){
        console.log(err)
    }
 }
module.exports = {
    uploadExcel,
    getPosData
}