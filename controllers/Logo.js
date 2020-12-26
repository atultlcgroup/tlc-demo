let Logo = require('../models/Logo')
let  dotenv = require('dotenv');
const extensions = ['jpeg','jpg','png'];

dotenv.config();
let uploadLogo=(req,res)=>{
    console.time("dbsave");
    console.log(req.headers.token)
    try{
        console.log(`uploadExcel api called in controller`)
        if(!req.body.fileName|| !req.body.fileContent || !req.body.logoType){
            res.status(401).send({code: 401, message: 'Invalid Inputs'})
            return
        }
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        let file =  req.body.fileContent;
        let fileName = req.body.fileName;
        let type = req.body.logoType;
        let extension = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase()
        if(!extensions.includes(extension)){
            res.status(401).send({code: 401, message: `Please provide image among ${extensions.join(",")} format!`})
            return
        }
        Logo.uploadLogo(file,fileName,type).then(data=>{
            res.status(200).send({code: 200, message: data})
        }).catch(e=>{
            console.log(e)
            res.status(500).send({code: 500, message: e})
            
        })
        
    }catch( e ){
        console.log(e)
        res.status(500).json({code : 500 , message : e})
    }
    
}


module.exports={
    uploadLogo
}
