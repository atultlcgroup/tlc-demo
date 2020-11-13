let UTRModel = require('../models/UTRReport')
// const extensions = ['xls','xlsx','xlsm','xlt','xltx','xltm','xla','xlam','csv'];
const extensions = ['csv'];
let  dotenv = require('dotenv');

dotenv.config();


let UTRReport =async(req,res)=>{
    try{
       if(!req.headers.userid){
        res.status(401).send({code :401 , message:'Please provide userid'})
           return
       } 
       if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
        res.status(401).send({code: 401, message: 'Invalid Token'})
        return
        }
        let file =  req.body.fileContent;
        let fileName = req.body.fileName;
        if(!req.body.fileName|| !req.body.fileContent){
            res.status(401).send({code: 401, message: 'Invalid Inputs'})
            return
        }
        let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
        if(!extensions.includes(extension)){
            res.status(401).send({code: 401, message: `Please provide ${extensions.join(",")} file!`})
            return
        }

        if(valudateFileNameSpecialChar(req.body)){
            let error=valudateFileNameSpecialChar(req.body)
            console.log(error);
            res.status(401).send({code: 401, message: error})
            return       
         }
         let fineNameWithoutFileExt = (req.body.fileName).replace(`.${extension}`,``)
        let UTRData =await UTRModel.UTRReport(req.headers.userid,createFileName(fineNameWithoutFileExt,req.headers.userid,extension),file)
        res.status(200).send({code :200 , message:'Success'})
    }catch(e){
        console.log(e)
        console.log(`${e}`)
        res.status(500).json({code: 500, message:`${e}`});
}
}



let createFileName= (fileName, userid,extension)=>{
    fileName = `${fileName}_${userid}_${require('dateformat')(new Date(), "yyyymmddhMMss")}.${extension}`  
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