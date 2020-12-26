let axios = require('axios');
const ftp = require('./databases/ftp');

let url =  'https://tlc-loyalty-program-uat.herokuapp.com/api/feedback/url1';
//API call
let apiCall = async()=>{
    let data = JSON.stringify({"reservationId":"5519313453"});
    let config = {
      method: 'post',
      url: url,
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
        try{
            let data = await axios(config)
            let response = data.data;
            return response.code == 200 ? response : `err`
        }catch(e){
            return e
        }
}

apiCall().then(d=>{
    console.log(d)
}).catch(e=>{
    console.log(e)
})
//Upload file
let uploadFileForDSR = async(fileName, content)=>{
    try{
        fileName = createtFileName(fileName)
        fs.writeFileSync("./reports/UTReport/"+fileName,new Buffer(content))
    }catch(e){
    return e
    }
    fs.writeFileSync("./reports/UTReport/"+fileName,new Buffer(file.content))
}

let createtFileName = (fileName)=>{
    let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
    let fineNameWithoutFileExt = (fileName).replace(`.${extension}`,``)
    fileName = `${fineNameWithoutFileExt}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.${extension}`  
    uploadExcelToFTP(fileName)
    return fileName;
}
//Upload file to FTP
let uploadExcelToFTP = async (fileName) => {
    return new Promise(async(resolve,reject)=>{
        try {
            ftpConnection = await ftp.connect();
            // // console.log(await ftpConnection.list())
            // console.log(data)
              await ftpConnection.uploadFrom(`reports/DSRReport/${fileName}`, `DSRReport/${fileName}`)
            ftpConnection.close();
            resolve('Success')
        } catch (e) {
            await createLogForUTRReport(fileName,'ERROR', false,`${e}`)
            fs.unlink(`reports/DSRReport/${fileName}`, (err, da) => {
                if (err)
                    reject(`${err}`);
            })
            reject(`${e}`);
        }
    })
}

//Transfer the file to ftp 

//store data in database

//Attach that DSR with DSR report 