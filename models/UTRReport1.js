
const { writeFileSync } = require("fs");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const ftp = require('../databases/ftp')



let UTRReport = async(userid,fileName,file)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            // let excelData=await uploadExcel(fileName,fileContent)
            // return excelData
            // const result = await excelToJson({
            //     source: fs.readFileSync(`UTRReport/${fileName}`)
            // });

          //UTRReport/${fileName}
            // var excel2Json = require('excel2json');

            // excel2Json(`UTRReport/${fileName}`, function(err, output) {
            //    console.log(output)
            // });
            
            let data = await uploadExcel(file,fileName)
            // let excelToFTPServer = await uploadExcelToFTP(fileName, userid)
            resolve({userid:userid,filename:`result`})
    
        }catch(e){
            console.log(`${e}`)
            reject(`${e}`)
        }
    
    })
}
 




let uploadExcelToFTP = async (fileName, userId) => {
    return new Promise(async(resolve,reject)=>{
        try {

            ftpConnection = await ftp.connect();
            // // console.log(await ftpConnection.list())
            // console.log(data)

              await ftpConnection.uploadFrom(`UTRReport/${fileName}`, `UTRReport/${fileName}`)
            ftpConnection.close();
            fs.unlink(`UTRReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            resolve('Success')
        } catch (e) {
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
    // const data = await writeFileSync(`./uploads/${fileName}`, `${file}`, { encoding: "base64" })
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