
let getUPLUrl = async(req, res)=>{
    try{
    console.log(`updateProfileLinkURL  called in controller`)
    console.log(`process.env.UPDATE_PROFILE_LINK ${process.env.UPDATE_PROFILE_LINK}`)
        res.status(200).send({code:200 , message : `Success`,'updateProfileLinkURL':  process.env.UPDATE_PROFILE_LINK})

   }catch( e ){
       res.status(500).send({code:500 , message : `${e}`})
   }
}

module.exports={
    getUPLUrl
}
