let sendMail= require("../helper/mailModel")
let generatePdf = require("../helper/generateDSRPdf");
let generateExcel = require("../helper/generateExcelForDSR");

const e = require("express");
const pool = require("../databases/db").pool;
const fs = require('fs');

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_send_dsr__c,hotel_email_id_dsr__c,tlc_email_id_dsr__c,tlc_send_email_dsr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        else if(req.property_sfid)
         qry = `select hotel_email_send_dsr__c,hotel_email_id_dsr__c,tlc_email_id_dsr__c,tlc_send_email_dsr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
         else if(req.customer_set_sfid)
        qry = `select hotel_email_send_dsr__c,hotel_email_id_dsr__c,tlc_email_id_dsr__c,tlc_send_email_dsr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_dsr__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_dsr__c.split(','));
            if(d.tlc_send_email_dsr__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_dsr__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
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
        let data = await pool.query(`insert into tlcsalesforce.reports_log("isEmailSent","propertyId",status,"typeBifurcation","customerSetId",emails) values(${isEmailSent},'${propertyId}', 'New' , 'DSR' ,'${customerSetId}' , '${emails}') RETURNING  id`)
        return data.rows ? data.rows[0].id : 0;
    }catch(e){
        console.log(e)
    }
}

let unlinkFiles = (files)=>{
    fs.unlink(`${files}`, (err, da) => {
        if (err)
            return(`${err}`);
    })
}
let DSRReport = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let dataObj = await getEPRSfid();
            console.log(dataObj)
            let ind = 0;
             for(let e of dataObj.emailArr){

            let insertedId = await insertLog(dataObj.propertyArr[ind],'',e)
            let emails = e;
            // req.property_sfid = 'a0Y1y000000EFBNEA4';
   
            let DSRRecords=await getDSRReport(dataObj.propertyArr[ind]);
            let DSRCertificateIssued =await getCertificateIssuedByPropertyId(dataObj.propertyArr[ind] , ``)
            console.log(`DSRCertificateIssued`)
             console.log(DSRCertificateIssued)
            //  let DSRRecords=await getDSRReport('a0Y1y000000EFBNEA4');
                if(DSRRecords.length){
                   
                  if(emails.length){
                    // let pdfFile = await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind],DSRCertificateIssued1);
                    let excelFile = await generateExcel.generateExcel(DSRRecords,dataObj.propertyArr[ind],DSRCertificateIssued);
                    console.log(excelFile)
                    console.log(`------------------------------------------------------------`)
                    //   sendMail.sendDSRReport(`${pdfFile}`,`${excelFile}`,'Daily Sales Report',emails) 
                      updateLog(insertedId, true ,'Success', '' , pdfFile)
                  }
                  else{
                      updateLog(insertedId, false ,'Error', 'Email not found!' , '' )
                  }
                    console.log(`From Model`)
                }else{
                    updateLog(insertedId, false ,'Error', 'Record not found!', '' )
                }
            ind++;
            
          }

          //For customerset 
        //   let dataObj1 = await getEPRSfidCS();
        //   console.log(dataObj1)
        //   let ind1 = 0;
        //    for(let e of dataObj1.emailArr){
        //     let insertedId1 = await insertLog('',dataObj1.customerSetArr[ind1],e)
        //   let emails1 = e;
        //   // req.property_sfid = 'a0Y1y000000EFBNEA4';
        //   console.log("getting DSR report");
        //    let DSRRecords1=await getDSRReportCS(dataObj1.customerSetArr[ind1]);
        //    let DSRCertificateIssued1 =await getCertificateIssuedByPropertyId(`` , dataObj1.customerSetArr[ind1])

        // //   let DSRRecords1=await getDSRReportCS('a0J1y000000u9BJEAY');
        //       if(DSRRecords1.length){
        //         if(emails1.length){
        //           let pdfFile1 = await generatePdf.generateDSRPDF(DSRRecords1,dataObj1.customerSetArr[ind1],DSRCertificateIssued1); 
        //           let excelFile = await generateExcel.generateExcel(DSRRecords1,dataObj1.customerSetArr[ind1],DSRCertificateIssued1);
               
        //          sendMail.sendDSRReport(`${pdfFile1}`,'Daily Sales Report',emails1)
        //           updateLog(insertedId1, true ,'Success', '' , pdfFile1)
        //           }else{
        //             updateLog(insertedId1, false ,'Error', 'Email not found!' , '' )
        //           }
        //           console.log(`From Model`)
        //       }else{
        //         updateLog(insertedId1, false ,'Error', 'Record not found!' , '' )
        //       }
        //   ind1++;
        
        // }

        }catch(e){
            console.log(`${e}`)
        }
    })
}

let getEPRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_dsr__c = true or tlc_send_email_dsr__c = true) and  (property__c is not NULL or property__c !='')`
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

let getEPRSfidCS = async()=>{
    try{
      let qry = `select distinct customer_set__c customer_set_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_dsr__c = true or tlc_send_email_dsr__c = true) and (property__c is  NULL or property__c ='')`
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

let getCertificateIssuedByPropertyId =async(property_sfid,customer_set_sfid)=>{
    try{
        let qry = ` Select payment__c.createddate, account.name membername,
        membership__c.membership_number__c, membershiptype__c.name membershiptypename,
        count(payment__c.sfid) from tlcsalesforce.payment__c
        Inner Join tlcsalesforce.account On 
        payment__c.account__c = account.sfid
        Inner Join tlcsalesforce.membership_offers__c
        On payment__c.membership_offer__c = membership_offers__c.sfid
        Inner Join tlcsalesforce.membership__c
        On membership_offers__c.membership2__c = membership__c.sfid
        Inner Join tlcsalesforce.membershiptype__c
        On membership__c.customer_set__c = membershiptype__c.sfid
        Left Join tlcsalesforce.property__c
        On membershiptype__c.property__c = property__c.sfid
        where  (Membership__c.Membership_Enrollment_Date__c = current_date - interval '1 day'
    
       or (Membership__c.Membership_Renewal_Date__c = current_date - interval '1 day'))
       and
       Membership__c is not Null and Membership_Offer__c is null
       and`
       ;
       if(property_sfid)
       qry+=` (Property__c.sfid='${property_sfid}') `
       else
       qry+=` membership__c.customer_set__c IN ('customer_set_sfid') `
       qry+=`group by payment__c.createddate, account.name,
        membership__c.membership_number__c, membershiptype__c.name`
        let result  = await pool.query(qry)
        return result ? result.rows : []
     }catch(e){
        return []
    }
}


let getDSRReport=async(property_sfid)=>{
    try{
        let query=await pool.query(`select account.name,membership__c.membership_number__c,payment__c.payment_for__c,
        case
        when payment__c.payment_for__c='New Membership' OR (payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is null) then 'N'
        when payment__c.payment_for__c='Renewal' OR (payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is not null) OR (payment__c.payment_for__c='Add-on Renewal') then 'R'
        when payment__c.payment_for__c = 'Cancellation' then 'C'
        END as Type_N_R__c,
        membership__c.expiry_date__c,
        Membership__c.Membership_Enrollment_Date__c,    
        membership__c.membership_renewal_date__c,
        --CC_CheqNo_Online_Trn_No__c,
        case
        when payment__c.payment_mode__c='Cheque'then payment__c.cheque_number__c
        when payment__c.payment_mode__c='Credit Card' then payment__c.credit_number__c
        when payment__c.payment_mode__c='Online' then payment__c.transaction_id__c
        END as CC_CheqNo_Online_Trn_No__c,
        authorization_number__c,
        receipt_No__c,Payment_Mode__c,Batch_Number__c,Amount__c,    
        Amount__c*membershiptype__c.tax_1__c/100+Amount__c as Total_Amount__c,
        account.gstin__c,remarks__c,city__c.state_code__c,property__c.name as property_name,payment__c,credit_card__c,
        membershiptype__c.sfid as customer_set_sfid,
        membershiptype__c.customer_set_program_level__c customer_set_name
        from tlcsalesforce.payment__c
        inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.city__c on city__c.sfid=property__c.city__c limit 10
        `)
        let qry =(`
        where
        (Membership__c.Membership_Enrollment_Date__c = current_date - interval '1 day'
        
           or (Membership__c.Membership_Renewal_Date__c = current_date - interval '1 day'))
           and
           Membership__c is not Null and Membership_Offer__c is null
           and
           (Property__c.sfid='${property_sfid}'
           --or membership__c.customer_set__c IN ('')
            )
         `)
        console.log(`hiiiSS`)
        let result = query ? query.rows : [];
        return result;

    }catch(e){
        console.log(`${e}`);

    }
}


let getDSRReportCS=async(customer_set_sfid)=>{
    try{
        let query=await pool.query(`select account.name,membership__c.membership_number__c,payment__c.payment_for__c,
        case
        when payment__c.payment_for__c='New Membership' OR (payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is null) then 'N'
        when payment__c.payment_for__c='Renewal' OR (payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is not null) OR (payment__c.payment_for__c='Add-on Renewal') then 'R'
        when payment__c.payment_for__c = 'Cancellation' then 'C'
        END as Type_N_R__c,
        membership__c.expiry_date__c,
        Membership__c.Membership_Enrollment_Date__c,    
        membership__c.membership_renewal_date__c,
        --CC_CheqNo_Online_Trn_No__c,
        case
        when payment__c.payment_mode__c='Cheque'then payment__c.cheque_number__c
        when payment__c.payment_mode__c='Credit Card' then payment__c.credit_number__c
        when payment__c.payment_mode__c='Online' then payment__c.transaction_id__c
        END as CC_CheqNo_Online_Trn_No__c,
        authorization_number__c,
        receipt_No__c,Payment_Mode__c,Batch_Number__c,Amount__c,    
        Amount__c*membershiptype__c.tax_1__c/100+Amount__c as Total_Amount__c,
        account.gstin__c,remarks__c,city__c.state_code__c,property__c.name as property_name,payment__c,credit_card__c,
        membershiptype__c.sfid as customer_set_sfid,
        membershiptype__c.name customer_set_name
        from tlcsalesforce.payment__c
        inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.city__c on city__c.sfid=property__c.city__c
        where
        (Membership__c.Membership_Enrollment_Date__c = current_date - interval '1 day'
        
           or (Membership__c.Membership_Renewal_Date__c = current_date - interval '1 day'))
           and
           Membership__c is not Null and Membership_Offer__c is null
           and
           (
           --    Property__c.sfid='${property_sfid}'
           --or 
           membership__c.customer_set__c IN ('${customer_set_sfid}')
            )
         `)
        let result = query ? query.rows : [];
        return result;

    }catch(e){
        console.log(e);

    }
}

module.exports={
    DSRReport
}