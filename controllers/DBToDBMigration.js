let DBToDBMigrationModel = require('../models/DBToDBMigration')
let  dotenv = require('dotenv');

dotenv.config();

let DBToDBMigration = async(req,res)=>{
    try{
        if(req.headers.token != process.env.POS_VARIFICATION_KEY ){      
            res.status(401).send({code: 401, message: 'Invalid Token'})
            return
        }
        if(!req.body.tables ){
            res.status(401).send({code: 401, message: 'Please provide table(s)!'})
            return      
        }
       DBToDBMigrationModel.getTableStructure(req.body.tables).then(DBToDBMigrationData=>{
        res.status(200).send({code :200 , message:'Success',data: DBToDBMigrationData})
       }).catch(error=>{
        res.status(500).send({code :500 , message : error})
       })


    }catch(e){
        console.log(`${e}`)
        res.status(500).send({code :500 , message : e})
}
}

module.exports={
    DBToDBMigration
}