let TallyModel = require('../models/tally')
let tally = async(req,res)=>{
    try{    
        if(!req.headers.client_id || !req.headers.client_secret || !req.body.payment_id){
            res.status(401).send({code: 401 , message : 'Invalid inputs!'})
        }
        let tally = TallyModel.tally(req.headers.client_id , req.headers.client_secret , req.body.payment_id)
        res.status(200).send({code :200 , message:'Success', data : tally})
    }catch(e){
        console.log(`${e}`)
        res.status(e.code).send(e.data)
}
}
let updateLedger = async(req,res)=>{
    try{    
        if(!req.headers.client_id || !req.headers.client_secret || !req.body.member_id){
            res.status(401).send({code: 401 , message : 'Invalid inputs!'})
        }
        let tally =await TallyModel.updateLedger(req.headers.client_id , req.headers.client_secret , req.body.member_id , req.body.current_name , req.body.new_name)
        res.status(200).send({code :200 , message:'Success',data: tally})
    }catch(e){
        console.log(`${e}`)
        res.status(e.code).send(e.data)
}
}

module.exports={
    tally,
    updateLedger
}