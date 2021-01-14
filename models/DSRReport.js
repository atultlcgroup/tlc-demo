let sendMail= require("../helper/mailModel")
let generatePdf = require("../helper/generateDSRPdf");
let generateExcel = require("../helper/generateExcelForDSR");

const e = require("express");
const pool = require("../databases/db").pool;
const fs = require('fs');

const axios = require('axios');
const qs = require('qs');
var request = require("request");

let token= ``

// let saveSfdcFile = async(data, propertyId)=>{
//     try{
//         console.log(data)
//         let fileName = `./reports/DSRReport/SFDCFILES/SFDC_DSR_${propertyId}_${Date.now()}.pdf`;
//         console.log(`------------------------------${fileName}`)
//         fs.writeFileSync(fileName , data.toString('base64'), {encoding:'base64'});
//     }catch(e){
//         console.log(e)
//         return e;
//     }
// }
let loginApiCall = async ()=>{
    let data = qs.stringify({
        'grant_type': 'password',
       'client_id': '3MVG9iLRabl2Tf4gLB3z_w8GAMoTJ8p3kvePpMe8g0PWDQt0oRSGvs5E3baRAO.wRKVapH3EFDIvUmNLXz68r',
       'client_secret': '5C175EFED053E9E2C72E6B8816D7A181796BEE68A547DB3F8AC07A731D4CDA67',
       'username': 'apiintegrationuser@tlcgroup.com.devpro',
       'password': 'tlcgroup123' 
       });
       let config = {
         method: 'post',
         url: 'https://test.salesforce.com/services/oauth2/token',
         data : data
        };
       try{
           let data =await axios(config)
            return {code: data.status ,msg : data.data}
            // return (JSON.stringify(data.data))
    }catch (error) {
           throw {code: error.response.status, msg: error.response.data }
       }
}

let getFileFromSFDC=(fileId, token , propertyId)=>{
    let options = {
        method: 'GET',
        encoding: null,
        url: `https://prod-tlc--devpro.my.salesforce.com/services/data/v47.0/sobjects/ContentVersion/${fileId}/VersionData`,
        headers: 
         {
           authorization  : `Bearer ${token}` } 
          };
        return new Promise((resolve, reject)=>{
            try {
                request(options,  async(error, response, body) =>{
                   console.log(`hihhhh`)
                   if (error) reject(error);
                   // console.log(response)
                   try{
                     let parseData = JSON.parse(body.toString())
                     if( parseData[0].errorCode == 'INVALID_AUTH_HEADER' &&  parseData[0].message == 'INVALID_HEADER_TYPE' ){
                      resolve({code: parseData[0].errorCode, msg: parseData[0].message})
                   }else{
                      reject({code: parseData[0].errorCode, msg: parseData[0].message})
                   }
                   }catch(e){
                    //    console.log(e)
                       //wirte file from sfdc 
                   let fileName = `./reports/DSRReport/SFDCFILES/SFDC_DSR_${propertyId}_${Date.now()}.pdf`;
                     fs.writeFileSync(fileName , body.toString('base64'), {encoding:'base64'});
                      resolve({code: 200, msg: {fileName: fileName}})
                   }     
                 });
             } catch (error) {
                 console.log(error)
                 reject(error)
             }
    
        })
        
}
let sfdcApiCall =  async(propertyId, date)=>{
    try {
        console.log(`------------property id = ${propertyId}---Date= ${date}---------`)
        let fileId = `0681y000000PkNXAA0`;
        //get file id here by date and property id
        console.log(`----------------------token =${token} ------------------------`)
        let fileData =await getFileFromSFDC(fileId , token , propertyId);
        console.log(fileData)
        if(fileData.code == 'INVALID_AUTH_HEADER'){
            //call login api 
            console.log(`-----Login API called---------`)
            let data = await loginApiCall()
              token = data.msg.access_token  || ``;
              fileData =await getFileFromSFDC(fileId , token , propertyId);
        }
        if(fileData.code== 200){
            console.log(`yes! file exists for given fileId`)
            // let fileName = await saveSfdcFile(fileData.msg, propertyId)
            return fileData.msg.fileName || ``
        }
    } catch (error) {
        console.log(`++++++++++++=+++++++++++++++++++++`)
        return ``;
    }
}




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



let convertDateFormat = () => {
    let today = new Date();
    today.setDate(today.getDate() - 1); 
    today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
   return today    
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
        let query=await pool.query(`select name dsr_subject_name,brand_name__c,brand_logo__c,tlc_logo__c,page_footer_2_dsr__c,page_footer_1_dsr__c,footer_dsr__c,from_email_id_dsr__c,
        column_1_dsr__c,column_2_dsr__c,column_3_dsr__c,display_name_dsr__c  from tlcsalesforce.dynamic_report__c where brand_name__c='${brandId}'`)
        let result = query ? query.rows : [];
        return result;
    }catch(e){
        return [];
    } 
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

                    //get brand Id
                    let brandId = await getBrandId(dataObj.propertyArr[ind],``)
                    console.log(`brand id = ${brandId}`)
                    let dynamicValues=await getDynamicValues(brandId);
                    console.log(dynamicValues)
                       if(dynamicValues.length){
                      //get dsr file from SFDC
                      let sfdcFile = await sfdcApiCall(dataObj.propertyArr[ind], convertDateFormat())
                      let pdfFile = await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind],DSRCertificateIssued , dynamicValues[0]);
                      let excelFile = await generateExcel.generateExcel(DSRRecords,dataObj.propertyArr[ind],DSRCertificateIssued , dynamicValues[0]);
                      console.log(excelFile)
                      console.log(`------------------------------------------------------------`)
                        sendMail.sendDSRReport(`${pdfFile}`,`${excelFile}`,`${sfdcFile}`,'Daily Sales Report',emails ,dynamicValues, DSRRecords[0].program_name ) 
                        updateLog(insertedId, true ,'Success', '' , pdfFile)
                       }else{
                        updateLog(insertedId, false ,'Error', 'No record found for given brand in dynamic report object!' , '' )  
                       }
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
            //get brand id 
            // let brandId1 = await getBrandId(`` , dataObj1.customerSetArr[ind1])
            // let dynamicValues1=await getDynamicValues(brandId);
            // if(dynamicValues1.length){
            //get dsr file from SFDC
                //   let sfdcFile = await sfdcApiCall(dataObj.propertyArr[ind], convertDateFormat())
                   
        //           let pdfFile1 = await generatePdf.generateDSRPDF(DSRRecords1,dataObj1.customerSetArr[ind1],DSRCertificateIssued1 , dynamicValues1[0]); 
        //           let excelFile1 = await generateExcel.generateExcel(DSRRecords1,dataObj1.customerSetArr[ind1],DSRCertificateIssued1 , dynamicValues1[0]);
               
        //          sendMail.sendDSRReport(`${pdfFile1}`,`${excelFile}`,`${sfdcFile1}`,'Daily Sales Report',emails1 , dynamicValues1 ,  DSRRecords1[0].program_name)
        //           updateLog(insertedId1, true ,'Success', '' , pdfFile1)
        //           }else{
        //             updateLog(insertedId1, false ,'Error', 'Email not found!' , '' )
        //           }
        //     }else{
        //     updateLog(insertedId, false ,'Error', 'Email not found!' , '' )
        // }
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
       qry+=` membership__c.customer_set__c IN ('${customer_set_sfid}') `
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
        membershiptype__c.name customer_set_name,
        membershiptype__c.customer_set_program_level__c customer_set_level_name,
        payment__c.bank_name__c || ' ' || payment__c.cheque_number__c || ' ' || payment__c.createddate cheque_details
        ,program__c.name as program_name,
        payment__c.promocode__c
        from tlcsalesforce.payment__c
        inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.city__c on city__c.sfid=property__c.city__c
        Inner Join tlcsalesforce.program__c
        On membershiptype__c.program__c = program__c.sfid 
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
        membershiptype__c.name customer_set_name,
        membershiptype__c.customer_set_program_level__c customer_set_level_name,
        payment__c.bank_name__c || ' ' || payment__c.cheque_number__c || ' ' || payment__c.createddate cheque_details
        ,program__c.name as program_name,
        payment__c.promocode__c
        from tlcsalesforce.payment__c
        inner join tlcsalesforce.account on account.sfid=payment__c.Account__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        inner join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        inner join tlcsalesforce.city__c on city__c.sfid=property__c.city__c
        Inner Join tlcsalesforce.program__c
        On membershiptype__c.program__c = program__c.sfid
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