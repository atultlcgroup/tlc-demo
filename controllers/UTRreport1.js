let UTRModel = require('../models/UTRReport')
const extensions = ['xls','xlsx','xlsm','xlt','xltx','xltm','xla','xlam','csv'];


const multer  =   require('multer');
const path = require('path');
const fs = require('fs');
const { reject } = require('bluebird');

let storage = multer.diskStorage({
    destination: function (req, file, callback) {
      let userId = req.headers.userid;
      let dir = './UTRReport';
      try{
        if(!fs.existsSync(dir)){
          fs.mkdirSync(dir);
          fs.chmodSync(dir,0777);
        }
      } catch(err) {
        req.fileValidationError = "Error Uploading Files";
        return callback(new Error(req.fileValidationError));
      }
      dir = `./UTRReport/`;
      callback(null, dir);
    },
    filename: function (req, file, callback) {
        let userId = req.headers.userid;
        let dir = `./UTRReport/${file.originalname}`;
        let ext = (file.originalname).substring((file.originalname).lastIndexOf(".") + 1, (file.originalname).length).toLowerCase()     
        let fineNameWithoutFileExt = (file.originalname).replace(`.${ext}`,``)
        let originalname =  createFileName(fineNameWithoutFileExt,userId, ext);
        req.body.fileName = originalname
        if(fs.existsSync(dir)){
            originalname = originalname
        }
        callback(null,originalname);
    }
  });

  let upload = multer({
    storage : storage,
    fileFilter: function (req, file, callback) {
      let ext = (file.originalname).substring((file.originalname).lastIndexOf(".") + 1, (file.originalname).length).toLowerCase()     
      if(extensions.indexOf(ext) == -1 ) {
          req.fileValidationError = "File type not allowed";
          return callback(new Error(req.fileValidationError));
      }
      callback(null, true)
    },
    limits:{
        fieldNameSize:1000,
        fileSize: 10*1024*1024,
        files: 1,
    }
  }).single('file');
  
  


let UTRReport =async(req,res)=>{
    try{
       if(!req.headers.userid){
        res.status(500).send({code :500 , message:'Please provide userid'})
           return
       }

        // upload(req, res, async function (err) {
        //     console.log(req.body.fileName)

        //     if (err) {
        //         if (err.code == 'LIMIT_FILE_SIZE') {
        //             res.status(500).json(response("Maximum 10MB allowed", "500"));
        //             return;
        //         } else {
        //             if (req.fileValidationError) {
        //                 res.status(500).json({code: 500, message:req.fileValidationError});
        //                 return;
        //             } else {
        //                 res.status(500).json({code: 500, message:'File uploading error'});
        //                 return;
        //             }
        //         }
        //     }
        //     if (!req.file) {
        //         res.status(500).json({code: 500, message:'Please add file to upload'});
        //         return;
        //     }
         
        //     UTRModel.UTRReport(req.headers.userid , req.body.fileName).then(data=>{
        //         res.status(200).json({code: 200, message:'Success',data: data});

        //     }).catch(err=>{
        //         res.status(500).json({code: 500, message:`${err}`});

        //     })
        //         return;
        // })
         
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
        let UTRData =await UTRModel.UTRReport(req.headers.userid,createFileName(fineNameWithoutFileExt,req.headers.userid,extension),file)
        res.status(200).send({code :200 , message:'Success', data : `${UTRData}`})
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