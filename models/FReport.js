
const pool = require("../databases/db").pool;
let sendMail= require("../helper/mailModel")

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_fr__c,hotel_email_id_fr__c,tlc_email_id_fr__c,tlc_send_email_fr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_fr__c,hotel_email_id_fr__c,tlc_email_id_fr__c,tlc_send_email_fr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        else if(req.customer_set_sfid)
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




let getFRSfidCS = async()=>{
    try{
      let qry = `select distinct customer_set__c customer_set_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_fr__c = true or tlc_send_email_fr__c = true) and  (property__c is  NULL or property__c ='')`
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
    let qry = await pool.query(``)
    return qry.rows ? qry.rows : []
}


let getFRData=async(property__c)=>{
    try{
        let qry =`select Distinct member_feedback__c.name  Feedbacknumber,member_feedback__c.sfid ID,account.name as AccountOwner,outlet__c.name outlet,member_feedback__c.rating__c,member_feedback__c.createddate
        from tlcsalesforce.member_feedback__c
        inner join tlcsalesforce.account
        on member_feedback__c.member__c=account.sfid
        inner join tlcsalesforce.outlet__c
        on member_feedback__c.outlet__c=outlet__c.sfid
        inner join tlcsalesforce.property__c
        on property__c.sfid=outlet__c.property__c
        Left join tlcsalesforce.membershiptype__c
        on membershiptype__c.property__c=property__c.sfid
        where
        -- date(member_feedback__c.createddate) ='2020-04-21'--(current_date-1)
        date(member_feedback__c.createddate) =(current_date-1)
        and (outlet__c.property__c='${property__c}' 
        --or membershiptype__c.sfid=''
        )
        `
        let data = await pool.query(qry)
        return data.rows? data.rows : []
    }catch(e){
        console.log(e)
    }
}


let getFRDataCS=async( customer_set__c)=>{
    try{
        let qry =`select Distinct member_feedback__c.name  Feedbacknumber,member_feedback__c.sfid ID,account.name as AccountOwner,outlet__c.name outlet,member_feedback__c.rating__c,member_feedback__c.createddate
        from tlcsalesforce.member_feedback__c
        inner join tlcsalesforce.account
        on member_feedback__c.member__c=account.sfid
        inner join tlcsalesforce.outlet__c
        on member_feedback__c.outlet__c=outlet__c.sfid
        inner join tlcsalesforce.property__c
        on property__c.sfid=outlet__c.property__c
        Left join tlcsalesforce.membershiptype__c
        on membershiptype__c.property__c=property__c.sfid
        where
        --date(member_feedback__c.createddate) ='2020-04-21'--(current_date-1)
        date(member_feedback__c.createddate) =(current_date-1)
        and 
        (
            --outlet__c.property__c='' or 
        membershiptype__c.sfid='${customer_set__c}'
        )
        `
        let data = await pool.query(qry)
        return data.rows? data.rows : []
    }catch(e){
        console.log(e)
    }
}


let FReport= ()=>{
    console.log(`-From FR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            let getEmailandPropertyArr = await getFRSfid();
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                let propertyId =  getEmailandPropertyArr.propertyArr[ind++];
                let dataPropertyWise = await getFRData(propertyId)
                if(dataPropertyWise.length){
                    let pdfFile = ``//await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind]);
                    console.log(pdfFile)
                    sendMail.sendFReport(`${pdfFile}`,'Feedback Report',e)
                    console.log(`From Model`)
                }
            }
            let getEmailandCSArr = await getFRSfidCS();
            console.log(getEmailandCSArr)
            let ind1 = 0;
            for(let e of getEmailandCSArr.emailArr){
                let csId = getEmailandCSArr.customerSetArr[ind1++];
                let dataCSWise = await getFRDataCS(csId)
                if(dataCSWise.length){
                let pdfFile = ``//await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind]);
                console.log(pdfFile)
                sendMail.sendFReport(`${pdfFile}`,'Feedback Report',e)
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
    FReport
}
    