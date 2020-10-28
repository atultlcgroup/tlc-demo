const express = require('express');
const pool = require("../databases/db").pool


let insertInUTRLog=async(fileName,fileStatus,isEmailSent,uploadedBy)=>{
    try{
    console.log("inserteing query")
    console.log(`INSERT INTO tlcsalesforce.utr_tracking(
        "fileName", "fileStatus", "isEmailSent", "UploadedBy", "CreatedDate")
        VALUES ('${fileName}', '${fileStatus}', '${isEmailSent}', '${uploadedBy}', now())`);
    let result=await pool.query(`INSERT INTO tlcsalesforce.utr_tracking(
        "fileName", "fileStatus", "isEmailSent", "UploadedBy", "CreatedDate")
        VALUES ('${fileName}', '${fileStatus}', '${isEmailSent}', '${uploadedBy}', now())`);
        return "file uploaded successfully"
    }catch(e){
        console.log(e);
        return e
    }
    


}

insertInUTRLog("XYZ.txt","newFile",true,"Shubham").then(data=>{
    console.log(data);

}).catch(e=>{
   console.log(e);
})

// insertInUTRLog("XYZ.txt","newFile",true,"Shubham")