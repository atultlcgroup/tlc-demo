
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let  dotenv = require('dotenv');

dotenv.config();
let pool = require("../databases/db").pool


//move code


let uploadErrorFileToFTP = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            ftpConnection = await ftp.connect();
              await ftpConnection.uploadFrom(`UTRReport/${fileName}`, `UTRReport/Error/${fileName}`)
            ftpConnection.close();
            fs.unlink(`UTRReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
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



let getErrorRecordandCreateCSV = async(UTRTrackingId, userId)=>{
    try{
    let selectQry = await pool.query(`Select "property_name"  "Property Name","Member","Membership Number","Membership Type","SR No." "CSV Serial Number","Bank Id","Bank Name","TPSL Transaction Id","SM Transaction Id","Bank Transaction Id","Total Amount","Charges","Service Tax","Net Amount","Transaction Date","Transaction Time","Payment Date","SRC ITC","Scheme","Schemeamount","ErrorDescription" from tlcsalesforce."UTR_Log" where "UTR Tracking Id"='${UTRTrackingId}' and "Status"= 'Error'`)
    let data=selectQry.rows ? selectQry.rows:[]
    if(data.length){
        let fileName = await generateCSV(data,userId)
                       await uploadErrorFileToFTP(fileName)
        console.log(fileName)
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
    let fileName = `./UTRReport/UTR_Error_${userId}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.csv`
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
 

getErrorRecordandCreateCSV(132,'AAA').then(d=>{
    // console.log(d)
}).catch(e=>{
    console.log(e)
})
