const express = require('express');
//const pool = require("../databases/db").pool


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



var json2xls = require('json2xls');
const fs=require('fs');

var json = {
    foo: 'bar',
    qux: 'moo',
    poo: 123,
    stux: new Date()
}

var xls = json2xls(json);

fs.writeFileSync('data.xlsx', xls, 'binary');