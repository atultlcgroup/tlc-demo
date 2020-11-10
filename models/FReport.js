
const pool = require("../databases/db").pool;

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_fr__c,hotel_email_id_fr__c,tlc_email_id_fr__c,tlc_send_email_fr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        if(req.property_sfid)
        qry = `select hotel_email_send_fr__c,hotel_email_id_fr__c,tlc_email_id_fr__c,tlc_send_email_fr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        if(req.customer_set_sfid)
        qry = `select hotel_email_send_fr__c,hotel_email_id_fr__c,tlc_email_id_fr__c,tlc_send_email_fr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_fr__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_fr__c.split(','));
            if(d.tlc_send_email_fr__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_fr__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let getFRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_fr__c = true or tlc_send_email_fr__c = true) and  (property__c is not NULL or property__c !='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let propertyArr = [];
      for(r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          propertyArr.push(r.property_sfid)
      }
      let resultObj = {emailArr: finalArr,propertyArr : propertyArr}
      return resultObj;
    }catch(e){
      return [];
    }
}



let getDRRData =async()=>{
    let qry = await pool.query(``)
    return qry.rows ? qry.rows : []
}


let FReport= ()=>{
    console.log(`-From DR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            let getEmailandPropertyArr = await getFRSfid()
            resolve(getEmailandPropertyArr)
            resolve('Success')
        }catch(e){
            reject(e)
        }
    })
}
module.exports={
    FReport
}
    