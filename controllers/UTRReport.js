let UTRModel = require('../models/UTRReport')
const extensions = ['xls','xlsx','xlsm','xlt','xltx','xltm','xla','xlam','csv'];

let UTRReport = async(req,res)=>{
    try{
        let file =  req.body.fileContent;
        let fileName = req.body.fileName;
        if(!req.body.fileName|| !req.body.fileContent){
            res.status(401).send({code: 401, message: 'Invalid Inputs'})
            return
        }
        let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
        if(!extensions.includes(extension)){
            res.status(401).send({code: 401, message: `Please provide excel among ${extensions.join(",")} format!`})
            return
        }

        if(valudateFileNameSpecialChar(req.body)){
            let error=valudateFileNameSpecialChar(req.body)
            console.log(error);
            res.status(401).send({code: 401, message: error})
            return       
         }
         let fineNameWithoutFileExt = (req.body.fileName).replace(`.${extension}`,``)
        let UTRData =await UTRModel.UTRReport(file,createFileName(fineNameWithoutFileExt,extension))
        res.status(200).send({code :200 , message:'Success'})
    }catch(e){
        console.log(`${e}`)
}
}
let createFileName= (fileName, extension)=>{
    fileName = `${fileName}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.${extension}`  
    return fileName;
}


let valudateFileNameSpecialChar=(data)=>{
    if(`${data.fileName}`.includes('*')){
        console.log(`Invalid fileName: ${data.fileName}`)
        return `Invalid fileName : ${data.fileName}`
    }

}

module.exports={
    UTRReport
}