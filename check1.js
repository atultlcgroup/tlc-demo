
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let  dotenv = require('dotenv');

dotenv.config();
let pool = require("./databases/db").pool

let getErrorRecordandCreateCSV = async(UTRTrackingId)=>{
    try{
    let selectQry = await pool.query(`Select "property_name"  "Property Name","Member","Membership Number","Membership Type","SR No." "CSV Serial Number","Bank Id","Bank Name","TPSL Transaction Id","SM Transaction Id","Bank Transaction Id","Total Amount","Charges","Service Tax","Net Amount","Transaction Date","Transaction Time","Payment Date","SRC ITC","Scheme","Schemeamount","ErrorDescription" from tlcsalesforce."UTR_Log" where "UTR Tracking Id"='${UTRTrackingId}' and "Status"= 'Error'`)
    let data=selectQry.rows ? selectQry.rows:[]
    if(data.length){
        let fileName = await generateCSV(data)
        console.log(fileName)
    }else{
        console.log(`No Error`)
    }

  }catch(e){
      console.log(e)

  }

}

let generateCSV=async(data)=>{
    let headerArr = [{id:"SR No.",title:"SR No."}]
    for(let [key,value] of Object.entries(data[0])){
        headerArr.push({id: `${key}`, title:`${key}`})
    }
    let fileName = `./UTRReport/UTR_Error_${require('dateformat')(new Date(), "yyyymmddhMMss")}.csv`
    const csvWriter = createCsvWriter({
        path: fileName,
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
    return  fileName;  
} // returns a promise
 

getErrorRecordandCreateCSV(132).then(d=>{
    // console.log(d)
}).catch(e=>{
    console.log(e)
})
