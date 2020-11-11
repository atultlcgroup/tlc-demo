
const excelModel= require("../models/pos")
const extensions = ['xls','xlsx','xlsm','xlt','xltx','xltm','xla','xlam','csv'];
let  dotenv = require('dotenv');

dotenv.config();

let createFileName= (body)=>{
    let fileName =``;
    fileName = `${body.brandUniqueIdentifier}-${body.programUniqueIdentifier}-${body.propertyUniqueIdentifier}-${body.outletUniqueIdentifier}-${require('dateformat')(new Date(), "yyyymmddhMMss")}-${body.fileName}`  
    return fileName;
}
let uploadExcel=(req,res)=>{
    console.time("dbsave");
    try{
        if(req.body.token == process.env.POS_VARIFICATION_KEY ){      
        console.log(`uploadExcel api called in controller`)
        if(!req.body.fileName|| !req.body.fileContent || !req.body.brandName
            || !req.body.programName || !req.body.propertyName || !req.body.outletName
            || !req.body.brandUniqueIdentifier || !req.body.programUniqueIdentifier
            || !req.body.propertyUniqueIdentifier
            || !req.body.outletUniqueIdentifier
            || !req.body.userId || !req.body.posSource || !req.body.userEmail ){
            res.status(401).send({code: 401, message: 'Invalid Inputs'})
            return
        }}
        else{
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return

        }
        let file =  req.body.fileContent;
        let fileName = req.body.fileName;
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
        excelModel.uploadExcel(file,createFileName(req.body),req.body).then(data=>{
            console.timeEnd("dbsave");
            res.status(200).send({code: 200, message: data})
        }).catch(e=>{
            console.timeEnd("dbsave");
            res.status(500).send({code: 500, message: e})
            
        })
        
    }catch( e ){
        console.timeEnd("dbsave");
        res.status(500).json({code : 500 , message : e})
    }
    
}



let getPosData=async(req,res)=>{
    console.time("dbsave");
    console.log("Get POS api called");
    let fileName = req.body.fileName || "";
    excelModel.getPosData(fileName).then(data=>{
        console.timeEnd("dbsave");
        res.status(200).json({code: 200, message: data});
    }).catch(err=>{
        console.timeEnd("dbsave");
        res.status(200).json({code: 500, message: err});
    })
}


let readExcelInDirectory=async(result)=>{
    console.log('get POS excel in uploaded directory');
}


let getPosLogData=async(req,res)=>{
    console.time("dbsave");
    console.log("get pos log data");
    let fileName = ``
    excelModel.getPosLogData(fileName).then(data=>{
        console.timeEnd("dbsave");
        res.status(200).json({code: 200, message: 'success' });
    }).catch(err=>{
        console.timeEnd("dbsave");
        res.status(200).json({code:500,message:err});
    })
    
}



let GETURL=async(req,res)=>{
    console.log("get pos log data");
    if(!req.body.id){
        res.status(401).send({code: 401, message: 'Invalid Inputs'})
        return
    }
    let url=`https://dashboard.heroku.com/apps/tlc-demo/logs?id=${req.body.id}`
        res.status(200).json({code: 200, message: 'success' ,URL: url});

    
}






let valudateFileNameSpecialChar=(data)=>{
    console.log("inside vlaidation");
    console.log(data);
    if(`${data.programUniqueIdentifier}`.includes('*')  ){
        console.log(`Invalid programUniqueIdentifier in: ${data.programUniqueIdentifier}`)
        return `Invalid programUniqueIdentifier in: ${data.programUniqueIdentifier}`
    }
    if(`${data.propertyUniqueIdentifier}`.includes('*') ){
        console.log(`Invalid propertyUniqueIdentifier: ${data.propertyUniqueIdentifier}`)
        return `Invalid propertyUniqueIdentifier: ${data.propertyUniqueIdentifier}`
    }
    if(`${data.brandUniqueIdentifier}`.includes('*')  ){
        console.log(`Invalid  brandUniqueIdentifier: ${data.brandUniqueIdentifier}`);
        return `Invalid  brandUniqueIdentifier: ${data.brandUniqueIdentifier}`
    }
    if(`${data.outletUniqueIdentifier}`.includes('*')  ){
        console.log(`Invalid outletUniqueIdentifier: ${data.outletUniqueIdentifier}`)
        return `Invalid outletUniqueIdentifier: ${data.outletUniqueIdentifier}`
    }
    if(`${data.fileName}`.includes('*')){
        console.log(`Invalid fileName: ${data.fileName}`)
        return `Invalid fileName : ${data.fileName}`
    }
    if(`${data.propertyName}`.includes('*')){
        console.log(`Invalid propertyName: ${data.propertyName}`)
        return `Invalid propertyName : ${data.propertyName}`
    }
    if(`${data.outletName}`.includes('*')){
        console.log(`Invalid outletName: ${data.outletName}`)
        return `Invalid outletName : ${data.outletName}`
    }
    if(`${data.outletName}`.includes('*')){
        console.log(`Invalid outletName: ${data.outletName}`)
        return `Invalid outletName : ${data.outletName}`
    }
    if(`${data.programName}`.includes('*')){
        console.log(`Invalid programName: ${data.programName}`)
        return `Invalid programName : ${data.programName}`
    }

    return ``


}


let getRefferalData2=(req,res)=>{
    let  refferalData={
     membershipNumber:req.body.membershipNumber,
     referralCode:req.body.referralCode,
     membershipTypeId:req.body.membershipTypeId,
     transactionType:req.body.transactionType
     }
     
 
     console.log("by promise getting the data");
     refferalModel.getRefferalData2(refferalData).then(data=>{
         console.log("under the promise",data);  
         res.status(200).json({code: 200, message: data});
 
     }).catch(err=>{
         res.status(200).json({code: 500, message: err});
     })
     
 }


module.exports={
    uploadExcel,
    getPosData,
    getPosLogData,
    GETURL,
    getRefferalData2
}