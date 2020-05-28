const posModel= require("../models/posCheque")

let getPosCheque=(req,res)=>{
    try{
        console.log(`getPosCheque api called in controller`)
        posModel.getPosCheque().then(data=>{
            res.status(200).send({code: 200, message: 'success' , data : data})
        }).catch(e=>{
            res.status(500).send({code: 500, message: e})
        res.status(200).json({code : 200 , message : 'success'})

        })
    }catch( e ){
        res.status(500).json({code : 500 , message : e})
    }
   
}

module.exports={
    getPosCheque
}