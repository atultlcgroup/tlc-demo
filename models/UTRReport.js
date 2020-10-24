
const { writeFileSync } = require("fs");
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');
const csv=require('csvtojson')
const ftp = require('../databases/ftp')

const readCsv=async(fileName)=>{
try{
 let valuesArr=[]
 const headerArr = ['SR No.','Bank Id','Bank Name','TPSL TransactiON id','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO']
 const exceHeaderArr = ['SR No.','Bank Id','Bank Name','TPSL TransactiON id','SM TransactiON Id','Bank TransactiON id','Total Amount','Net Amount','TransactiON Date','TransactiON Time','Payment Date','SRC ITC','Scheme_code','UTR_NO']

 console.log(fileName)
 const converter= await csv().fromFile(`${fileName}`)
 let button ='off' 
 for(d of converter){
    console.log(button)
    let ind=0;
    let cnt =0;
    let cntIfButtonOn= 0;
    let valueArr=[]
    for(let [key,value] of Object.entries(d)){
       if(button == 'on')
       valueArr.push(value)
       if((value.toLowerCase()).trim()==headerArr[ind++].toLowerCase())
          cnt++;
       if(button == 'on' && (!value || value == null)){
        cntIfButtonOn++;
       console.log(cntIfButtonOn)
       }
     }
     console.log(ind)
    if((button == 'on' && headerArr.length == cntIfButtonOn) || (button == 'on' && headerArr.length != ind)){
        button='off'
       console.log(cntIfButtonOn)
     }
        if(button == 'on')
        valuesArr.push(valueArr)
        if(headerArr.length == cnt){
          button = 'on'
          console.log(`Excel format matched`)
      }
    }
    return {values: valuesArr, header:headerArr }
    }catch(e){
        console.log(e)
    return {values: [], header:[] }
    }
 }


let UTRReport = async(userid,fileName,file)=>{
    return new Promise(async(resolve, reject)=>{
        try{            
            let data = await uploadExcel(file,fileName)
            // let excelToFTPServer = await uploadExcelToFTP(fileName, userid)
            let csvData = await readCsv(`UTRReport/${fileName}`)
            console.log(csvData)
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
            // fs.unlink(`UTRReport/${fileName}`, (err, da) => {
            //     if (err)
            //         reject(`${err}`);
            // })
            reject(`${e}`);
        }
    })
}

let uploadExcel = async (file, fileName) => {
    return new Promise(async (resolve,reject)=>{
        // console.log(`from here 1`)
    try{
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