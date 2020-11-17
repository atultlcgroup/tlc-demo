
const pool = require("../databases/db").pool;
let sendMail= require("../helper/mailModel")
let generateFRPdf = require("../helper/generateFRPdf");


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
        console.log(`property__c:` , property__c)
        let qry =`select Distinct casenumber,member_feedback__c.name  Feedbacknumber,member_feedback__c.sfid ID,account.name as AccountOwner,outlet__c.name outlet,member_feedback__c.rating__c,member_feedback__c.createddate
        from tlcsalesforce.member_feedback__c
        inner join tlcsalesforce.account
        on member_feedback__c.member__c=account.sfid
        inner join tlcsalesforce.outlet__c
        on member_feedback__c.outlet__c=outlet__c.sfid
        inner join tlcsalesforce.property__c
        on property__c.sfid=outlet__c.property__c
        Left join tlcsalesforce.membershiptype__c
        on membershiptype__c.property__c=property__c.sfid
        Left join tlcsalesforce.case c
        on c.sfid=member_feedback__c.case__c
        where
         --date(member_feedback__c.createddate) ='2020-04-21'--(current_date-1)
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
        console.log(`customer_set__c:${customer_set__c}`)
        let qry =`select Distinct casenumber,member_feedback__c.name  Feedbacknumber,member_feedback__c.sfid ID,account.name as AccountOwner,outlet__c.name outlet,member_feedback__c.rating__c,member_feedback__c.createddate
        from tlcsalesforce.member_feedback__c
        inner join tlcsalesforce.account
        on member_feedback__c.member__c=account.sfid
        inner join tlcsalesforce.outlet__c
        on member_feedback__c.outlet__c=outlet__c.sfid
        inner join tlcsalesforce.property__c
        on property__c.sfid=outlet__c.property__c
        Left join tlcsalesforce.membershiptype__c
        on membershiptype__c.property__c=property__c.sfid
        Left join tlcsalesforce.case c
        on c.sfid=member_feedback__c.case__c
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


let getCSName=async(customer_set_sfid)=>{
   try{
    let data = await pool.query(`select name from tlcsalesforce.membershiptype__c where sfid = '${customer_set_sfid}'`)
    return data.rows && data.rows[0].name
    }catch(e){
     return ``;
   }
}

let getPName=async(property_sfid)=>{
  try{
    let data = await pool.query(`select name from tlcsalesforce.property__c where sfid = '${property_sfid}'`)
    return data.rows && data.rows[0].name
   }catch(e){
    return ``
   }
}

let updateLog = async(insertedId, isEmailSent ,status, errorDescription , fileName )=>
{
    try{
    await pool.query(`update  tlcsalesforce.reports_log set "isEmailSent"=${isEmailSent} , status= '${status}', "errorDescription"='${errorDescription}', "fileName"='${fileName}'  where id = ${insertedId}`)
    }catch(e){
        console.log(e)
    }
}
let insertLog = async(propertyId,customerSetId, emails)=>
{
    try{
        emails =emails.length ? emails.join(","):''
        let isEmailSent= false
        let data = await pool.query(`insert into tlcsalesforce.reports_log("isEmailSent","propertyId",status,"typeBifurcation","customerSetId",emails) values(${isEmailSent},'${propertyId}', 'New' , 'FR' ,'${customerSetId}' , '${emails}') RETURNING  id`)
        return data.rows ? data.rows[0].id : 0;
    }catch(e){
        console.log(e)
    }
}
let FReport= ()=>{
    console.log(`-From FR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            let getEmailandPropertyArr = await getFRSfid();
            console.log(getEmailandPropertyArr)
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                let insertedId = await insertLog(getEmailandPropertyArr.propertyArr[ind],'',e)
                let propertyId =  getEmailandPropertyArr.propertyArr[ind];
                ind++
                let dataPropertyWise = await getFRData(propertyId)
                if(dataPropertyWise.length){
                    let propertyName = await getPName(propertyId)
                    if(e.length){
                    let pdfFile = await generateFRPdf.generateFRPDF(dataPropertyWise, propertyName , propertyId)
                    console.log(pdfFile)
                    sendMail.sendFReport(`${pdfFile}`,'Feedback Report',e)
                    updateLog(insertedId, true ,'Success', '' , pdfFile)
                        }else{
                            updateLog(insertedId, false ,'Error', 'Email not found!' , '' )
                        }
                    console.log(`From Model`)
                }else{
                    updateLog(insertedId, false ,'Error', 'Record not found!', '' )
                }
            }
            let getEmailandCSArr = await getFRSfidCS();
            let ind1 = 0;
            for(let e of getEmailandCSArr.emailArr){
                let insertedId1 = await insertLog('',getEmailandCSArr.customerSetArr[ind1],e)
                let csId = getEmailandCSArr.customerSetArr[ind1];
                ind1++;
                let dataCSWise = await getFRDataCS(csId)
                if(dataCSWise.length){
                    let customersetName = await getCSName(csId)
                    if(e.length){
                    let pdfFile = await generateFRPdf.generateFRPDF(dataCSWise,customersetName,csId)
                            sendMail.sendFReport(`${pdfFile}`,'Feedback Report',e)
                            updateLog(insertedId1, true ,'Success', '' , pdfFile)
                    }else{
                        updateLog(insertedId1, false ,'Error', 'Email not found!' , '' )
                    }

                console.log(`From Model`)
                }else{
                    updateLog(insertedId1, false ,'Error', 'Record not found!' , '' )
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
    