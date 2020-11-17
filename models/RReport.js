
const pool = require("../databases/db").pool;
const sendMail= require("../helper/mailModel");
const generatePdf = require("../helper/generateRRPdf")


let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        else if(req.customer_set_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        // console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_rr__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_rr__c.split(','));
            if(d.tlc_send_email_rr__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_rr__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let getRRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_rr__c = true or tlc_send_email_rr__c = true) and  (property__c is not NULL or property__c !='')`
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
      (hotel_email_send_rr__c = true or tlc_send_email_rr__c = true) and  (property__c is  NULL or property__c ='')`
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


let getRRData = async(property_id)=>{
try{
let qry = `select  Distinct outlet__c.property__c property_id,property__c.name h_name,reservation__c.name record_id,account.name member_name,reservation__c.reservation_status__c,membership_offers__c.name membership_offer_name,
outlet__c.name outlet_name,
membership__c.membership_number__c,concat(reservation__c.reservation_date__c,' ',reservation__c.reservation_time__c) r_date_time,reservation__c.number_of_guests__c,
reservation__c.number_of_adults__c,reservation__c.number_of_kids__c,reservation__c.celebration_type__c,reservation__c.celebration_remark__c,
reservation__c.specialrequest__c
from tlcsalesforce.reservation__c
inner join tlcsalesforce.account
on reservation__c.member__c=account.sfid
Left join tlcsalesforce.membership_offers__c
on membership_offers__c.sfid=reservation__c.Membership_Offer__c
inner join tlcsalesforce.outlet__c
on reservation__c.outlet__c=outlet__c.sfid
left join tlcsalesforce.membership__c
on membership__c.sfid=reservation__c.membership__c
inner join tlcsalesforce.property__c
on property__c.sfid=outlet__c.property__c
Left join tlcsalesforce.membershiptype__c
on membershiptype__c.property__c=property__c.sfid
where
date(reservation__c.createddate) = (current_date-1)
and
 (outlet__c.property__c='${property_id}' 
--and (outlet__c.property__c='a0D0k000009PPsEEAW' 
--or membershiptype__c.sfid='a0f0k000002bjhGAAQ'
)
`
console.log(qry)
let data = await pool.query(qry)
return data.rows ? data.rows : []
}catch(e){
return []
}
}

let getRRDataCS=async(customer_set__c)=>{
    try{
 let qry = `select  Distinct outlet__c.property__c property_id,membershiptype__c.name  h_name,reservation__c.name record_id,account.name member_name,reservation__c.reservation_status__c,membership_offers__c.name membership_offer_name,
 outlet__c.name outlet_name,
 membership__c.membership_number__c,concat(reservation__c.reservation_date__c,' ',reservation__c.reservation_time__c) r_date_time,reservation__c.number_of_guests__c,
 reservation__c.number_of_adults__c,reservation__c.number_of_kids__c,reservation__c.celebration_type__c,reservation__c.celebration_remark__c,
 reservation__c.specialrequest__c
 from tlcsalesforce.reservation__c
 inner join tlcsalesforce.account
 on reservation__c.member__c=account.sfid
 Left join tlcsalesforce.membership_offers__c
 on membership_offers__c.sfid=reservation__c.Membership_Offer__c
 inner join tlcsalesforce.outlet__c
 on reservation__c.outlet__c=outlet__c.sfid
 left join tlcsalesforce.membership__c
 on membership__c.sfid=reservation__c.membership__c
 inner join tlcsalesforce.property__c
 on property__c.sfid=outlet__c.property__c
 Left join tlcsalesforce.membershiptype__c
 on membershiptype__c.property__c=property__c.sfid
 where
 date(reservation__c.createddate) = (current_date-1)
 and (
     --outlet__c.property__c='a0D0k000009PPsEEAW' or 
     membershiptype__c.sfid='${customer_set__c}'
     --membershiptype__c.sfid='a0f0k000002bjhGAAQ'
 )`
//  console.log(qry)
 let data = await pool.query(qry)
return data.rows ? data.rows : []
}catch(e){
return []
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
        let data = await pool.query(`insert into tlcsalesforce.reports_log("isEmailSent","propertyId",status,"typeBifurcation","customerSetId",emails) values(${isEmailSent},'${propertyId}', 'New' , 'RR' ,'${customerSetId}' , '${emails}') RETURNING  id`)
        return data.rows ? data.rows[0].id : 0;
    }catch(e){
        console.log(e)
    }
}

let RReport= ()=>{
    console.log(`-From RR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            let getEmailandPropertyArr = await getRRSfid()
            console.log(getEmailandPropertyArr)
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                let insertedId = await insertLog(getEmailandPropertyArr.propertyArr[ind],'',e)
                let propertyId =  getEmailandPropertyArr.propertyArr[ind];
                ind++
                let dataPropertyWise = await getRRData(propertyId)
                // console.log(dataPropertyWise)
                if(dataPropertyWise.length){
                    if(e.length){
                        let pdfFile = await generatePdf.generateRRPDF(dataPropertyWise);
                        console.log(pdfFile)
                        sendMail.sendRReport(`${pdfFile}`,'Todays Reservation Report',e)
                        updateLog(insertedId, true ,'Success', '' , pdfFile)
                    }else{
                        updateLog(insertedId, false ,'Error', 'Email not found!' , '' )
                    }
                    console.log(`From Model`)
                }else{
                    updateLog(insertedId, false ,'Error', 'Record not found!' , '' )
                }
            }
            let getEmailandCSArr = await getFRSfidCS();
            let ind1 = 0;
            for(let e of getEmailandCSArr.emailArr){
                let insertedId1 = await insertLog('',getEmailandCSArr.customerSetArr[ind1],e)
                let csId = getEmailandCSArr.customerSetArr[ind1];
                ind1++;
                let dataCSWise = await getRRDataCS(csId)
                // console.log(dataCSWise)
                if(dataCSWise.length){
                    if(e.length){
                        let pdfFile = await generatePdf.generateRRPDF(dataCSWise);
                        console.log(pdfFile)
                        sendMail.sendRReport(`${pdfFile}`,'Todays Reservation Report',e)
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
    RReport
}
    