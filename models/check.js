let  dotenv = require('dotenv');
dotenv.config();
const ftp = require('../databases/ftp');
const fs = require('fs');


const pool = require("../databases/db").pool


// let insertInUTRLog=async(fileName,fileStatus,isEmailSent,uploadedBy)=>{
//     try{
//     console.log("inserteing query")
//     console.log(`INSERT INTO tlcsalesforce.utr_tracking(
//         "fileName", "fileStatus", "isEmailSent", "UploadedBy", "CreatedDate")
//         VALUES ('${fileName}', '${fileStatus}', '${isEmailSent}', '${uploadedBy}', now())`);
//     let result=await pool.query(`INSERT INTO tlcsalesforce.utr_tracking(
//         "fileName", "fileStatus", "isEmailSent", "UploadedBy", "CreatedDate")
//         VALUES ('${fileName}', '${fileStatus}', '${isEmailSent}', '${uploadedBy}', now())`);
//         return "file uploaded successfully"
//     }catch(e){
//         console.log(e);
//         return e
//     }
    


// }

// insertInUTRLog("XYZ.txt","newFile",true,"Shubham").then(data=>{
//     console.log(data);

// }).catch(e=>{
//    console.log(e);
// })

// insertInUTRLog("XYZ.txt","newFile",true,"Shubham")

// let  validateHhMm=async (inputField)=> {
//     var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(inputField);

//     if (isValid) {
//         return isValid;
        
      
//     } else {
//         return isValid;
      
//     }
   
   
//   }

//   validateHhMm("24:59").then(data=>{
//       console.log("data is",data)
//   }).catch(e=>{
//       console.log("error is",e)
//   })



// var json2xls = require('json2xls');
// const fs=require('fs');
// const va=require("./")

// var json = {
//     foo: 'bar',
//     qux: 'moo',
//     poo: 123,
//     stux: new Date()
// }

// var xls = json2xls(json);

// fs.writeFileSync('/data.xlsx', xls, 'binary');


let getErrorDataFromPOSLog=async (posTrackingId)=>{
    try{
        console.log("++++Get POS log data with Error status+++++");
       
         let result=await pool.query(`select "Card_No","Bill_No","BillDate","BillTime","Actual_Pax", "Pos_Code" , "Food", "Disc_Food"
        ,"Soft_Bev","Disc_Soft_Bev","Dom_Liq","Disc_Dom_Liq","Imp_Liq","Disc_Imp_Liq","Tobacco","Disc_Tobacco","Misc","Grossbilltotal","Disc_Misc","Tax",status,error_description
         from tlcsalesforce.pos_log where pos_tracking_id='${posTrackingId}' and status='SYNC_ERROR'`);
         if( result.rows)
     result ? result.rows : null
     
     if( result.rows.length > 0){
        console.log("Error data is",result.rows);
        generateCSV(result.rows);

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

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let generateCSV=async(data)=>{
    let headerArr = [{id:"SR No.",title:"SR No."}]
    for(let [key,value] of Object.entries(data[0])){
        headerArr.push({id: `${key}`, title:`${key}`})
    }

    let fileName = `POS_Error_${require('dateformat')(new Date(), "yyyymmddhMMss")}.csv`
    let path = `./POSReport/${fileName}`
    const csvWriter = createCsvWriter({
        path: path,
        header: headerArr
    });
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
     
   let result= await csvWriter.writeRecords(records)  
   await uploadErrorFileToFTP (fileName)
   return  fileName;  
} // returns a promise


let uploadErrorFileToFTP = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            let path = `POS/error/${fileName}`
            ftpConnection = await ftp.connect();
              await ftpConnection.uploadFrom(`POSReport/${fileName}`, `${path}`)
            ftpConnection.close();
            fs.unlink(`POSReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            
            resolve(path)
        } catch (e) {
            // await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`POSReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}


getErrorDataFromPOSLog(680);