let memberSpentForPOS = require('../models/memberSpentForPOS')

let getPosMembersData = async(req,res)=>{
    try{
        memberSpentForPOS.getMembershipDetails().
        then(data=>{
           
            res.status(200).send({code :200 , message: data})

        }).catch(e=>{
            console.log(e);
            res.status(500).send({code: 500, message: e})
            
        })

    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    getPosMembersData
}