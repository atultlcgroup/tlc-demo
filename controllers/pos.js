
const excelModel= require("../models/pos")
const extensions = ['xls','xlsx','xlsm','xlt','xltx','xltm','xla','xlam','csv'];

let createFileName= (body)=>{
    let fileName =``;
    fileName = `${body.brandUniqueIdentifier}-${body.programUniqueIdentifier}-${body.propertyUniqueIdentifier}-${body.outletUniqueIdentifier}-${require('dateformat')(new Date(), "yyyymmddhMMss")}-${body.fileName}`  
    return fileName;
}
let uploadExcel=(req,res)=>{
    try{
        console.log(`uploadExcel api called in controller`)
        if(!req.body.fileName|| !req.body.fileContent || !req.body.brandName
            || !req.body.programName || !req.body.propertyName || !req.body.outletName
            || !req.body.brandUniqueIdentifier || !req.body.programUniqueIdentifier
            || !req.body.propertyUniqueIdentifier
            || !req.body.outletUniqueIdentifier
            || !req.body.userId || !req.body.posSource){
            res.status(401).send({code: 401, message: 'Invalid Inputs'})
            return
        }
        let file =  req.body.fileContent;
        let fileName = req.body.fileName;
        let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
        if(!extensions.includes(extension)){
            res.status(401).send({code: 401, message: `Please provide excel among ${extensions.join(",")} format!`})
            return
        }
        excelModel.uploadExcel(file,createFileName(req.body),req.body).then(data=>{
            res.status(200).send({code: 200, message: 'success' , data : data})
        }).catch(e=>{
            res.status(500).send({code: 500, message: e})
        })
    }catch( e ){
        res.status(500).json({code : 500 , message : e})
    }
   
}



let getPosData=async(req,res)=>{
    console.log("Get POS api called");
    let fileName = req.body.fileName || "";
    excelModel.getPosData(fileName).then(data=>{
        res.status(200).json({code: 200, message: 'success' , data : data});
    }).catch(err=>{
        console.log("In get pos data controller");
        console.log(err);
        res.status(200).join({code: 500, message: err});
    })
}


let readExcelInDirectory=async(result)=>{
    console.log('get POS excel in uploaded directory');
}


let getPosLogData=async(req,res)=>{
    console.log("get pos log data");
    let fileName = ``
    excelModel.getPosLogData(fileName).then(data=>{
        res.status(200).json({code: 200, message: 'success' , data : data});
    }).catch(err=>{
        res.status(200).json({code:500,message:err});
    })
    
}






module.exports={
    uploadExcel,
    getPosData,
    getPosLogData
}