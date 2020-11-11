
const pool = require("../databases/db").pool;
let sendMail= require("../helper/mailModel")

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        else if(req.customer_set_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_drr__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_drr__c.split(','));
            if(d.tlc_send_email_drr__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_drr__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let getDRRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_drr__c = true or tlc_send_email_drr__c = true) and  (property__c is not NULL or property__c !='')`
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

let getDRRSfidCS = async()=>{
    try{
      let qry = `select distinct customer_set__c customer_set_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_drr__c = true or tlc_send_email_drr__c = true) and  (property__c is  NULL or property__c ='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let customerSetArr = [];
      for(r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          customerSetArr.push(r.customer_set_sfid)
      }
      let resultObj = {emailArr: finalArr,customerSetArr : customerSetArr}
      return resultObj;
    }catch(e){
      return [];
    }
}




let getDRRData =async()=>{
    try{
        let qry = ``;
        let data = await pool.query(qry)
        return data.rows ? data.rows : []
    }catch(e){
        return []
    }
}

let getDRRDataCS =async()=>{
    try{
        let qry = ``;
        let data = await pool.query(qry)
        return data.rows ? data.rows : []
    }catch(e){
        return []
    }
}

let DRReport= ()=>{
    console.log(`-From DRR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            let getEmailandPropertyArr = await getDRRSfid()
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                let propertyId =  getEmailandPropertyArr.propertyArr[ind++];
                let dataPropertyWise = await getDRRData(propertyId)
                console.log(dataPropertyWise)
                // if(dataPropertyWise.length){
                    let pdfFile = ``//await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind]);
                    console.log(pdfFile)
                    sendMail.sendDRReport(`${pdfFile}`,'Daily Redemption Report',e)
                    console.log(`From Model`)
                // }
            }
            let getEmailandCSArr = await getDRRSfidCS();
            let ind1 = 0;
            for(let e of getEmailandCSArr.emailArr){
                let csId = getEmailandCSArr.customerSetArr[ind1++];
                let dataCSWise = await getDRRDataCS(csId)
                console.log(dataCSWise)
                if(dataCSWise.length){
                let pdfFile = ``//await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind]);
                console.log(pdfFile)
                sendMail.sendDRReport(`${pdfFile}`,'Daily Redemption Report',e)
                console.log(`From Model`)
                }
            }
        
            resolve('Success')
        }catch(e){
            reject(e)
        }        
    })
}
module.exports={
    DRReport
}
    