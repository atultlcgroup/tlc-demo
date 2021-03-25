
const pool = require("../databases/db").pool;
const sendMail= require("../helper/mailModel");
const generatePdf = require("../helper/generateRRPdf")


let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program__c}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and program__c = '${req.program__c}'`;
        else if(req.customer_set_sfid)
        qry = `select hotel_email_send_rr__c,hotel_email_id_rr__c,tlc_email_id_rr__c,tlc_send_email_rr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program__c}'`;
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
      let qry = `select distinct property__c property_sfid, payment_email_rule__c.program__c from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_rr__c = true or tlc_send_email_rr__c = true) and  (property__c is not NULL or property__c !='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let propertyArr = [];
      let programArr = [];
      for(r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          propertyArr.push(r.property_sfid)
          programArr.push(r.program__c)
      }
      let resultObj = {emailArr: finalArr,propertyArr : propertyArr , programArr : programArr}
      return resultObj;
    }catch(e){
      return [];
    }
}


let getFRSfidCS = async()=>{
    try{
      let qry = `select distinct customer_set__c customer_set_sfid, payment_email_rule__c.program__c from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_rr__c = true or tlc_send_email_rr__c = true) and  (property__c is  NULL or property__c ='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let customerSetArr = [];
      for(r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          customerSetArr.push(r.customer_set_sfid)
          programArr.push(r.program__c)
      }
      let resultObj = {emailArr: finalArr,customerSetArr : customerSetArr , programArr : programArr}
      return resultObj;
    }catch(e){
      return [];
    }
}



let getDRRData =async()=>{
    let qry = await pool.query(``)
    return qry.rows ? qry.rows : []
}


let getRRData = async(property_id , program_id)=>{
try{
let qry = `
select  Distinct outlet__c.property__c property_id,property__c.name h_name,reservation__c.name record_id,account.name member_name,reservation__c.reservation_status__c,membership_offers__c.name membership_offer_name,
outlet__c.name outlet_name,membershiptype__c.name,
membership__c.membership_number__c,concat(reservation__c.reservation_date__c,' ',reservation__c.reservation_time__c) r_date_time,reservation__c.number_of_guests__c,
reservation__c.number_of_adults__c,reservation__c.number_of_kids__c,reservation__c.celebration_type__c,reservation__c.celebration_remark__c,
reservation__c.specialrequest__c,membershiptypeoffer__c.name as customer_set_name
,program__c.name as program_name,program__c.unique_identifier__c as program_unique_identifier
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
Left join tlcsalesforce.membershiptypeoffer__c
on membershiptypeoffer__c.sfid=membership_offers__c.customer_Set_offer__c 
inner Join tlcsalesforce.program__c on  membershiptype__c.program__c = program__c.sfid
where
--date(reservation__c.createddate) = (current_date-1)
--and
(outlet__c.property__c='${property_id}' 
and membershiptype__c.program__c = '${program_id}'
--and (outlet__c.property__c='a0D0k000009PPsEEAW' 
--or membershiptype__c.sfid='a0f0k000002bjhGAAQ'
) 
`
// console.log(qry)
let data = await pool.query(qry)
return data.rows ? data.rows : []
}catch(e){
return []
}
}

let getRRDataCS=async(customer_set__c , program_id)=>{
    try{
 let qry = `select  Distinct outlet__c.property__c property_id,membershiptype__c.name  h_name,reservation__c.name record_id,account.name member_name,reservation__c.reservation_status__c,membership_offers__c.name membership_offer_name,
 outlet__c.name outlet_name,
 membership__c.membership_number__c,concat(reservation__c.reservation_date__c,' ',reservation__c.reservation_time__c) r_date_time,reservation__c.number_of_guests__c,
 reservation__c.number_of_adults__c,reservation__c.number_of_kids__c,reservation__c.celebration_type__c,reservation__c.celebration_remark__c,
 reservation__c.specialrequest__c,membershiptypeoffer__c.name as customer_set_name,program__c.name as program_name,program__c.unique_identifier__c as program_unique_identifier
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
 Left join tlcsalesforce.membershiptypeoffer__c
 on membershiptypeoffer__c.sfid=membership_offers__c.customer_Set_offer__c
Inner Join tlcsalesforce.program__c
 On membershiptype__c.program__c = program__c.sfid
 where
 date(reservation__c.createddate) = (current_date-1)
 and (
     --outlet__c.property__c='a0D0k000009PPsEEAW' or 
     membershiptype__c.sfid='${customer_set__c}'
     and membershiptype__c.program__c = '${program_id}'
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
            // return
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                 
                let insertedId = await insertLog(getEmailandPropertyArr.propertyArr[ind],'',e)
                let propertyId =  getEmailandPropertyArr.propertyArr[ind];
                let programId = getEmailandPropertyArr.programArr[ind];
                ind++
                let dataPropertyWise = await getRRData(propertyId , programId)
                // console.log(`DSR DATA = ${dataPropertyWise}`)
                // console.log(dataPropertyWise)
                if(dataPropertyWise.length){
                    if(e.length){
                        console.log("dataPropertyWise",propertyId)                        
                        //get brand Id
                        let brandId = await getBrandId(propertyId,``)
                        console.log(brandId)
                        console.log(`brand id = ${brandId}`)
                        let dynamicValues=await getDynamicValues(brandId);
                        console.log(`dynamic value = ${JSON.stringify(dataPropertyWise)}`)
                        if(dynamicValues.length){
                            
                        if(dataPropertyWise[0].program_unique_identifier == 'TLC_MAR_CLMOld')
                        dataPropertyWise[0].program_name = 'Club Marriott';
                        if(dataPropertyWise[0].program_unique_identifier == 'TLC_OLE_GRMTOld')
                        dataPropertyWise[0].program_name = 'Gourmet Club';
                            console.log("dynamicValuesdynamicValues",dynamicValues,dynamicValues.length);
                        let pdfFile = await generatePdf.generateRRPDF(dataPropertyWise , dynamicValues);
                        console.log(pdfFile)
                        sendMail.sendRReport(`${pdfFile}`,'Todays Reservation Report',e,dynamicValues,dataPropertyWise[0].program_name)
                        updateLog(insertedId, true ,'Success', '' , pdfFile)

                        }
                        else{
                            updateLog(insertedId, false ,'Error', 'No record found for given brand in dynamic report object!' , '' )  ;
                        }
                        
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
                let programId1 = getEmailandCSArr.programArr[ind1];
                let dataCSWise = await getRRDataCS(csId , programId1)
                // console.log(dataCSWise)
                if(dataCSWise.length){
                    if(e.length){
                        console.log(`Property Id = ${getEmailandCSArr.propertyArr[ind1]}`)
                        
                        //get brand Id
                        let brandId1 = await getBrandId(``,getEmailandCSArr.propertyArr[ind1])
                        console.log(`brand id = ${brandId1}`)
                        let dynamicValues1=await getDynamicValues(brandId1);
                        console.log("dynamicValuesdynamicValues",dynamicValues1,dynamicValues1.length);
                        if(dynamicValues.length){
                            if(dataCSWise[0].program_unique_identifier == 'TLC_MAR_CLMOld')
                            dataCSWise[0].program_name = 'Club Marriott';
                            if(dataCSWise[0].program_unique_identifier == 'TLC_OLE_GRMTOld')
                            dataCSWise[0].program_name = 'Gourmet Club';
                            let pdfFile = await generatePdf.generateRRPDF(dataCSWise);
                        console.log(pdfFile)
                        sendMail.sendRReport(`${pdfFile}`,'Todays Reservation Report',e,dynamicValues1 , dataCSWise[0].program_name)
                        updateLog(insertedId1, true ,'Success', '' , pdfFile)
                        }else{
                            updateLog(insertedId, false ,'Error', 'No record found for given brand in dynamic report object!' , '' )  ;
                        }
                        
                    }else{
                        updateLog(insertedId1, false ,'Error', 'Email not found!' , '' )
                    }
           
                console.log(`From Model`)
               }else{
                updateLog(insertedId1, false ,'Error', 'Record not found!' , '' )
              }
              ind1++;
            }
        
            resolve('Success')
        }catch(e){
            reject(e)
        }
    })
}


//getting brand ID
let getBrandId = async(property__c, customer_set__c)=>{
    try{
        console.log(property__c , `property id`)
        console.log(`select brand__c  from tlcsalesforce.payment_email_rule__c where property__c = '${property__c}' limit 1`)
        let qry=``
        if(property__c) qry=`select brand__c  from tlcsalesforce.payment_email_rule__c where property__c = '${property__c}' limit 1`
        else qry=`select brand__c  from tlcsalesforce.payment_email_rule__c where customer_set__c  = '${customer_set__c}' limit 1`;
        let data =await pool.query(qry)
        return data.rows ? data.rows[0].brand__c : ``
    }catch(e){
        return ``;
    }
}


//getting dynamic value 

let getDynamicValues=async(brandId)=>{
    try{
        console.log(`select brand_name__c,brand_logo__c, tlc_logo__c,page_footer_1_rr__c,page_footer_2_rr__c,column_1_rr__c,column_2_rr__c,column_3_rr__c,display_name_rr__c,subject_rr__c,footer_rr__c,
		from_email_id_rr__c  from tlcsalesforce.dynamic_report__c where brand_name__c='${brandId}'`)
        let query=await pool.query(`select brand_name__c,brand_logo__c, tlc_logo__c,page_footer_1_rr__c,page_footer_2_rr__c,column_1_rr__c,column_2_rr__c,column_3_rr__c,display_name_rr__c,subject_rr__c,footer_rr__c,
		from_email_id_rr__c  from tlcsalesforce.dynamic_report__c where brand_name__c='${brandId}'`)
        
        
        let result = query ? query.rows : [];
        console.log("query",result);
        return result;        
    }catch(e){
        console.log(e);

    }
}


module.exports={
    RReport
}
    