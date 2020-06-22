
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
    let result= await excelModel.getPosData();
    console.log('=====================Response============================')
    console.log(result);
    res.status(200).send({code: 200, message: 'success' , data : result});
    

    readExcelInDirectory(result)

    

}


let readExcelInDirectory=async(result)=>{
    console.log('get POS excel in uploaded directory');
    

}



module.exports={
    uploadExcel,
    getPosData
}