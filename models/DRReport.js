
const pool = require("../databases/db").pool;
let sendMail= require("../helper/mailModel")
let generatePdf = require("../helper/generateDRRPdf")
let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program__c}'`;
        else if(req.property_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and program__c = '${req.program__c}'`;
        else if(req.customer_set_sfid)
        qry = `select hotel_email_send_drr__c,hotel_email_id_drr__c,tlc_email_id_drr__c,tlc_send_email_drr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program__c}'`;
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
      let qry = `select distinct property__c property_sfid, payment_email_rule__c.program__c from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_drr__c = true or tlc_send_email_drr__c = true) and  (property__c is not NULL or property__c !='')`
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




let getDRRData =async(property_id , program_id)=>{
    try{
        let qry = `select property__c.sfid property_sfid,membershiptype__c.name membership_type_name,membershiptypeoffer__c.name as offer_name,redemption_log__c.redemption_date_time__c,account.name member_name,
        membership__c.membership_number__c,membership_offers__c.certifcate_number__c,
        reservation__c.redemption_transaction_code__c,reservation__c.assigned_staff_member__c,
        pos_cheque_details__c.net_amount__c,property__c.name as hotel_name,outlet__c.name as outlet_name,
        reservation__c.check_number__c as cheque_number__c,a.name as Hotel_app_user,membership_offers__c.offer_unique_identifier__c,reservation__c.redemption_transaction_code__c,program__c.name as program_name,program__c.unique_identifier__c as program_unique_identifier
        from tlcsalesforce.redemption_log__c
        inner join tlcsalesforce.membership_offers__c
        on membership_offers__c.sfid=redemption_log__c.membership_offer__c
        inner join tlcsalesforce.membershiptypeoffer__c
        on membershiptypeoffer__c.sfid=membership_offers__c.customer_set_offer__c
        inner join tlcsalesforce.membership__c
        on membership_offers__c.membership2__c=membership__c.sfid
        inner join tlcsalesforce.membershiptype__c
        on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.account
        on account.sfid=redemption_log__c.redeemed_by__c
        Left join tlcsalesforce.reservation__c
        on reservation__c.sfid=redemption_log__c.reservation__c
        Left JOIN tlcsalesforce.pos_cheque_details__c ON
        pos_cheque_details__c.redemption_code__c=reservation__c.redemption_transaction_code__c
        Left join tlcsalesforce.property__c
        on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.outlet__c
        on reservation__c.outlet__c=outlet__c.sfid
        Left join  tlcsalesforce.account a
        on a.sfid=reservation__c.assigned_staff_member__c
        Inner Join tlcsalesforce.program__c
        On membershiptype__c.program__c = program__c.sfid 
        where 
        (
            membershiptype__c.property__c='${property_id}' 
            and membershiptype__c.program__c = '${program_id}'

       -- membershiptype__c.property__c='a0D0k000009PPsEEAW' 
        --or membershiptype__c.sfid='a0f0k000003FSKyAAO'
        ) limit 100
        and 
        --date(redemption_log__c.redemption_date_time__c) = '2020-10-20'
       date(redemption_log__c.redemption_date_time__c) = (current_date-1) --'2020-08-25'
        `;
        let data = await pool.query(qry)
        return data.rows ? data.rows : []
    }catch(e){
        return []
    }
}

let getDRRDataCS =async(customer_set__c)=>{
    try{
        let qry = `select property__c.sfid property_sfid,membershiptype__c.name membership_type_name,membershiptypeoffer__c.name as offer_name,redemption_log__c.redemption_date_time__c,account.name member_name,
        membership__c.membership_number__c,membership_offers__c.certifcate_number__c,
        reservation__c.redemption_transaction_code__c,reservation__c.assigned_staff_member__c,
        pos_cheque_details__c.net_amount__c,property__c.name as hotel_name,outlet__c.name as outlet_name,
        reservation__c.check_number__c as cheque_number__c,a.name as Hotel_app_user,membership_offers__c.offer_unique_identifier__c,reservation__c.redemption_transaction_code__c,program__c.name as program_name,program__c.unique_identifier__c as program_unique_identifier
        from tlcsalesforce.redemption_log__c
        inner join tlcsalesforce.membership_offers__c
        on membership_offers__c.sfid=redemption_log__c.membership_offer__c
        inner join tlcsalesforce.membershiptypeoffer__c
        on membershiptypeoffer__c.sfid=membership_offers__c.customer_set_offer__c
        inner join tlcsalesforce.membership__c
        on membership_offers__c.membership2__c=membership__c.sfid
        inner join tlcsalesforce.membershiptype__c
        on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.account
        on account.sfid=redemption_log__c.redeemed_by__c
        Left join tlcsalesforce.reservation__c
        on reservation__c.sfid=redemption_log__c.reservation__c
        Left JOIN tlcsalesforce.pos_cheque_details__c ON
        pos_cheque_details__c.redemption_code__c=reservation__c.redemption_transaction_code__c
        Left join tlcsalesforce.property__c
        on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.outlet__c
        on reservation__c.outlet__c=outlet__c.sfid
        Left join  tlcsalesforce.account a
        on a.sfid=reservation__c.assigned_staff_member__c
        Inner Join tlcsalesforce.program__c
        On membershiptype__c.program__c = program__c.sfid 
        where 
        (
        --membershiptype__c.property__c='a0D0k000009PPsEEAW' or 
        membershiptype__c.sfid='${customer_set__c}')
        --membershiptype__c.sfid='a0f0k000003FSKyAAO')
        and 
        date(redemption_log__c.redemption_date_time__c) =(current_date-1) --'2020-08-25'`;
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
        let data = await pool.query(`insert into tlcsalesforce.reports_log("isEmailSent","propertyId",status,"typeBifurcation","customerSetId",emails) values(${isEmailSent},'${propertyId}', 'New' , 'DRR' ,'${customerSetId}' , '${emails}') RETURNING  id`)
        return data.rows ? data.rows[0].id : 0;
    }catch(e){
        console.log(e)
    }
}

let getBrandId = async(property__c, customer_set__c)=>{
    try{
        let qry=``
        if(property__c) qry=`select brand__c  from tlcsalesforce.payment_email_rule__c where property__c = '${property__c}' limit 1`
        else qry=`select brand__c  from tlcsalesforce.payment_email_rule__c where customer_set__c  = '${customer_set__c}' limit 1`;
        let data =await pool.query(qry)
        return data.rows ? data.rows[0].brand__c : ``
    }catch(e){
        return ``;
    }
}

let getDynamicValues=async(brandId)=>{
    try{
        let query=await pool.query(`select  subject_drr__c drr_subject_name,brand_name__c,brand_logo__c,tlc_logo__c,page_footer_2_drr__c,page_footer_1_drr__c,footer_drr__c,from_email_id_drr__c,
        column_1_drr__c,column_2_drr__c,column_3_drr__c,display_name_drr__c  from tlcsalesforce.dynamic_report__c where brand_name__c='${brandId}'`)
        let result = query ? query.rows : [];
        return result;
    }catch(e){
        return [];
    } 
}


let DRReport= ()=>{
    console.log(`-From DRR Report-`)
    return new Promise(async(resolve, reject)=>{
        try{
            console.log(`-------------`)
            let getEmailandPropertyArr = await getDRRSfid()
            // console.log(getEmailandPropertyArr)
            let ind = 0;
            for(let e of getEmailandPropertyArr.emailArr){
                let insertedId = await insertLog(getEmailandPropertyArr.propertyArr[ind],'',e)
                let propertyId =  getEmailandPropertyArr.propertyArr[ind];
                let programId = getEmailandPropertyArr.programArr[ind];
                let dataPropertyWise = await getDRRData(propertyId ,programId)

                console.log(dataPropertyWise)
                if(dataPropertyWise.length){
                    if(e.length){
                    //get brand Id
                    console.log(`Property Id = ${getEmailandPropertyArr.propertyArr[ind]}`)
                    let brandId = await getBrandId(getEmailandPropertyArr.propertyArr[ind],``)
                    let dynamicValues=await getDynamicValues(brandId);
                    console.log(dynamicValues)
                    if(dynamicValues.length){
                        if(dataPropertyWise[0].program_unique_identifier == 'TLC_MAR_CLMOld')
                        dataPropertyWise[0].program_name = 'Club Marriott';
                        if(dataPropertyWise[0].program_unique_identifier == 'TLC_OLE_GRMTOld')
                        dataPropertyWise[0].program_name = 'Gourmet Club';
                        
                                              //get DRR file from SFDC
         
                    let pdfFile = await generatePdf.generateDRRPDF(dataPropertyWise , dynamicValues);
                    console.log(pdfFile)
                    sendMail.sendDRReport(`${pdfFile}`,'Daily Redemption Report',e, dynamicValues , dataPropertyWise[0].program_name)
                    updateLog(insertedId, true ,'Success', '' , pdfFile)
                    console.log(`From Model`)
                    }else{
                        updateLog(insertedId, false ,'Error', 'No record found for given brand in dynamic report object!' , '' )  
                    }
                    }else{
                        updateLog(insertedId, false ,'Error', 'Email not found!' , '' )
                    }
                }else{
                    updateLog(insertedId, false ,'Error', 'Record not found!', '' )
                }
                ind++;

            }
            let getEmailandCSArr = await getDRRSfidCS();
            let ind1 = 0;
            for(let e of getEmailandCSArr.emailArr){
                let insertedId1 = await insertLog('',getEmailandCSArr.customerSetArr[ind1],e)
                let csId = getEmailandCSArr.customerSetArr[ind1];
                ind1++;
                let dataCSWise = await getDRRDataCS(csId)
                console.log(dataCSWise)
                if(dataCSWise.length){
                if(e.length){
                        //get brand Id
                        console.log(`Property Id = ${getEmailandCSArr.propertyArr[ind]}`)
                        let brandId1 = await getBrandId(getEmailandCSArr.propertyArr[ind],``)
                        let dynamicValues1=await getDynamicValues(brandId1);
                        console.log(dynamicValues1)
                           if(dynamicValues1.length){
                            if(dataCSWise[0].program_unique_identifier == 'TLC_MAR_CLMOld')
                            dataCSWise[0].program_name = 'Club Marriott';
                            if(dataCSWise[0].program_unique_identifier == 'TLC_OLE_GRMTOld')
                            dataCSWise[0].program_name = 'Gourmet Club';
                          //get DRR file from SFDC

                        let pdfFile = await generatePdf.generateDRRPDF(dataCSWise, dynamicValues1);
                        console.log(pdfFile)
                        sendMail.sendDRReport(`${pdfFile}`,'Daily Redemption Report',e,dynamicValues1 , dataCSWise[0].program_name)
                        console.log(`From Model`)
                        updateLog(insertedId1, true ,'Success', '' , pdfFile)
                        }else{
                            updateLog(insertedId, false ,'Error', 'No record found for given brand in dynamic report object!' , '' )  
                        }
                }else{
                    updateLog(insertedId1, false ,'Error', 'Email not found!' , '' )
                }
                }else{
                    updateLog(insertedId1, false ,'Error', 'Record not found!' , '' )
                }
            }
        
            resolve('Success')
        }catch(e){
            console.log(e)
            reject(e)
        }        
    })
}
module.exports={
    DRReport
}
    