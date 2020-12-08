let memberSpentForPOS = require('../models/memberSpentForPOS')

let getPosMembersData = async(req,res)=>{
    try{
        memberSpentForPOS.getMembershipDetails()
      
           
            res.status(200).send({code :200 , message: 'Success'})


    }catch(e){
        console.log(`${e}`)
}
}

module.exports={
    getPosMembersData
}