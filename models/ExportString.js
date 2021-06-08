const pool = require("../databases/db").pool;
let sendMail= require("../helper/mailModel");
let generateExcels = require("../helper/generateExportStingExcels");

/**
 * Get emails
 */



 let findPaymentRule= async(req )=>{
    try{
        console.log(`program id from findpayment rule = ${req.program__c}`)
        let qry = ``;
        if(req.program__c)
        qry = `select distinct hotel_email_send_es__c,hotel_email_id_es__c,tlc_email_id_es__c,tlc_send_email_es__c from tlcsalesforce.Payment_Email_Rule__c where program__c = '${req.program__c}'`;
        // else if(req.property_sfid && req.customer_set_sfid)
        // qry = `select distinct hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program_id}'`;
        // else if(req.property_sfid)
        // qry = `select distinct hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and program__c = '${req.program_id}'`;
        // else if(req.customer_set_sfid)
        // qry = `select distinct hotel_email_send_utr__c,hotel_email_id_utr__c,tlc_email_id_utr__c,tlc_send_email_utr__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}' and program__c = '${req.program_id}'`;
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_send_es__c == true)
            resultArray= resultArray.concat(d.hotel_email_id_es__c.split(','));
            if(d.tlc_send_email_es__c == true)
            resultArray=resultArray.concat(d.tlc_email_id_es__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        // await createLogForUTRReport(fileName,'ERROR',false,`${e}`)
        console.log(e)
        return [];
    }
}



let getEPRSfid = async()=>{
    try{
      let qry = `select distinct payment_email_rule__c.program__c,(select name from tlcsalesforce.program__c where sfid = payment_email_rule__c.program__c limit 1)  as program_name from tlcsalesforce.payment_email_rule__c where
      (hotel_email_send_es__c = true or tlc_send_email_es__c = true) and  (program__c is not NULL or program__c !='')`
      let data = await pool.query(`${qry}`)
      let result = data ? data.rows : []
      let finalArr = []
      let programNameArr = [];
      let programArr = [];
      for(let r of result){
          let emails = await findPaymentRule(r)
          finalArr.push(emails)
          programNameArr.push(r.program_name)
          programArr.push(r.program__c)
      }
      let resultObj = {emailArr: finalArr, programArr : programArr , programNameArr : programNameArr}
      return resultObj;
    }catch(e){
        console.log(e)
      return [];
    }
}

/**
 * Get Data 
 */
let getDSRData = async(programSFID)=>{
    try {
        let qry = `select
        membership__c.membership_number__c,account.name,account.address_line_2__c,City__c.name,
        account.billingpostalcode,account.Email_for_notification__c,account.salutation,account.firstname,
        account.lastname,membership__c.membership_enrollment_date__c,membership__c.expiry_date__c,
              payment__c.net_amount__c,payment__c.payment_mode__c,
              consultant__c.name consultant_name,account.Birth_date__c Dt_Of_Birth,
        Payment__c.Payment_For__c Type_Of_Enrollement, Membership__c.Membership_Enrollment_Date__c Dsr_Date,
        Payment__c.GST_Amount__c Sales_Tax,Payment__c.Net_Amount__c Total_Fees,
        Payment__c.Payment_Mode__c Mbr_Rct_No,Payment__c.Payment_Mode__c Payment_Method,Payment__c.Payment_Mode__c Payment_Type,
        Payment__c.Cheque_Number__c Cheque_Number,Payment__c.Bank_Name__c Bank_Name,Payment__c.Bank_Deposit_Date__c Cheque_Date,
        Payment__c.Bank_Deposit_Number__c Bank_Cheque_Deposit_Number,Payment__c.Bank_Deposit_Date__c Bank_Deposit_Date,
        Payment__c.Credit_Number__c Cc_Details,membershiptype__c.Customer_Set_Program_Level__c Add_On_Plan_Code,
        Payment__c.Payment_For__c Enrollment_Type,Membership__c.Membership_Enrollment_Date__c New_Renewal_Date,
        membership__c.expiry_date__c Next_Renewal_Expiry_Date,Payment__c.Payment_For__c First_Enrolledat,
        Payment__c.Payment_For__c First_Enroll_Source,membership__c.membership_number__c Membershipno,
        membershiptype__c.Customer_Set_Program_Level__c Tier,Payment__c.GST_details__c Statusdesc,
        account.PersonBirthDate Dt_Of_Birth,account.Gender_c__c Gender,account.Salutation Title,
        account.FirstName First_Name,account.LastName Last_Name,account.Company_c__c Company,account.Designation__c Job_Description,
        Payment__c.Payment_For__c Created_At_Source,Payment__c.Payment_For__c Created_At_Channel,Payment__c.Payment_For__c Createdby,
        Membership__c.Membership_Enrollment_Date__c Createddt,Membership__c.Membership_Enrollment_Date__c Modifieddt,
        account.anniversary__c Anniversary,Membership__c.Membership_Enrollment_Date__c orion_transaction_date,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.Address_Line_1__c
        END as Officeadd1,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.Address_Line_2__c
        END as Officeadd2,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.Address_Line_3__c
        END as Officeadd3,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.Country__c
        END as OfficeCountry,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.State__c
        END as OfficeState,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.City__c
        END as OfficeCity,
        case
        when Member_Address_information__c.address_type__c='Loyalty - Business'
        or Member_Address_information__c.address_type__c='Business'
        then
        Member_Address_information__c.Pin_code__c
        END as OfficePin,
        Account.Marital_Status__c as Marital,
        A2.Gender_c__c as Spoussex,A2.salutation as Spous_Sal,A2.firstname as Spous_Firstname,
        A2.lastname As Spous_Lastname,A2.Birth_date__c as Spousdob,
        Taj_Bank_Detail__c.Bank_Code__c as orion_cheque_bank,City__c.taj_state_code__c as State_code,
        city__c.taj_city_code__c as city_code,Account.Enrolled_in_Taj_loyalty_program__c,
        Account.Email_Communication_Preferences__c,Account.SMS_Communication_Preferences__c,
        Case
        when Account.PersonDoNotCall=true then False
        when Account.PersonDoNotCall=false then true
        END as Call_Communication_Preference__c,Account.Terms_and_condition_Flag__c,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.Address_Line_1__c
END as Homeadd1,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.Address_Line_2__c
END as Homeadd2,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.Address_Line_3__c
END as Homeadd3,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.Country__c
END as HomeCountry,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.State__c
END as Homestate,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.City__c
END as HomeCity,
case
when Member_Address_information__c.address_type__c='Personal'
then
Member_Address_information__c.Pin_code__c
END as Homepin
        from tlcsalesforce.Payment__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.Account on membership__c.member__c=account.sfid
        Left join tlcsalesforce.Account A2 on Account.Spouse_account__c=A2.sfid
        Left join tlcsalesforce.City__c on Account.City__c=City__c.sfid
        Left join tlcsalesforce.Member_Address_information__c on Member_Address_information__c.member__c=Account.sfid
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        Inner Join tlcsalesforce.program__c On membershiptype__c.program__c = program__c.sfid
        Left Join tlcsalesforce.Taj_Bank_Detail__c on payment__c.Taj_Bank_Detail__c=Taj_Bank_Detail__c.sfid
        Left join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        Left join TLcsalesforce.consultant__c on Payment__c.consultant__c=consultant__c.sfid 
         where (Membership__c.Membership_Enrollment_Date__c = current_date - interval '1 days' 
        or (Membership__c.Membership_Renewal_Date__c = current_date - interval '1 days'))
         and
       Membership__c is not Null and Membership_Offer__c is null
        and
        (
            --(Property__c.sfid='')
        --Or
        program__c.sfid  = '${programSFID}')
       AND membershiptype__c.sfid != program__c.default_membership_type__c
        `;
        let data = await pool.query(qry);
        return data.rows.length ? data.rows  : [];
        } catch (error) {
        console.log(error)
        return []; 
    }
}




/**
 * Get brand id by program id
 * 
 */


 let getBrandId = async(program__c)=>{
    try{
        let  qry=`select brand__c  from tlcsalesforce.payment_email_rule__c where program__c = '${program__c}' limit 1`
        let data =await pool.query(qry)
        return data.rows ? data.rows[0].brand__c : ``
    }catch(e){
        return ``;
    }
}


 /**
  * Get dynamic value by brand id 
  */


  let getDynamicValues=async(brandId)=>{
    try{
        let query=await pool.query(`select subject_es__c es_subject_name,brand_name__c,brand_logo__c,tlc_logo__c,page_footer_2_es__c,page_footer_1_es__c,footer_es__c,from_email_id_es__c,
        column_1_es__c,column_2_es__c,column_3_es__c,display_name_es__c  from tlcsalesforce.dynamic_report__c where brand_name__c='${brandId}'`)
        let result = query ? query.rows : [];
        return result;
    }catch(e){
        return [];
    } 
}


/**
 * Create log
 * Pass program instead of property
 */
 let insertLog = async(program_id, emails)=>
 {
     try{
         emails =emails.length ? emails.join(","):''
         let isEmailSent= false
         let data = await pool.query(`insert into tlcsalesforce.reports_log("isEmailSent","propertyId",status,"typeBifurcation","customerSetId",emails) values(${isEmailSent},'${program_id}', 'New' , 'Export Sting' ,'' , '${emails}') RETURNING  id`)
         return data.rows ? data.rows[0].id : 0;
     }catch(e){
         console.log(e)
     }
 }
 
/**
 * Get Orion String DATA
 */
let getOrionStringData =async(program_id)=>
{
    try {
        let qry = `select
        membership__c.membership_number__c,account.name,account.address_line_2__c,City__c.name,city__c.taj_state_code__c,
        city__c.taj_state_code__c,
        account.billingpostalcode,account.Email_for_notification__c,account.salutation,account.firstname,
        account.lastname,membership__c.membership_enrollment_date__c,membership__c.expiry_date__c,
        payment__c.net_amount__c,payment__c.payment_mode__c,payment__c.Cheque_Number__c,
        payment__c.bank_deposit_date__c,payment__c.Credit_Number__c,payment__c.Credit_Card__c,
        payment__c.gst_details__c,membershiptype__c.customer_Set_program_level__c,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.Address_Line_1__c
        END as add1,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.Address_Line_2__c
        END as add2,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.Address_Line_3__c
        END as add3,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.Country__c
        END as Country,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.State__c
        END as State,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.City__c
        END as City,
        case
        when Member_Address_information__c.address_type__c='Personal'
        then
        Member_Address_information__c.Pin_code__c
        END as Pin,
        Account.Marital_Status__c as Marital,
        A2.Gender_c__c as Spoussex,A2.salutation as Spous_Sal,A2.firstname as Spous_Firstname,
        A2.lastname As Spous_Lastname,A2.Birth_date__c as Spousdob,
        Taj_Bank_Detail__c.Bank_Code__c as orion_cheque_bank,City__c.taj_state_code__c as State_code,
        city__c.taj_city_code__c as city_code,Account.Enrolled_in_Taj_loyalty_program__c,
        Account.Email_Communication_Preferences__c,Account.SMS_Communication_Preferences__c,
        Case
        when Account.PersonDoNotCall=true then False
        when Account.PersonDoNotCall=false then true
        END as Call_Communication_Preference__c,Account.Terms_and_condition_Flag__c
        from tlcsalesforce.Payment__c
        inner join tlcsalesforce.membership__c on membership__c.sfid=payment__c.membership__c
        inner join tlcsalesforce.Account on membership__c.member__c=account.sfid
        Left join tlcsalesforce.Account A2 on Account.Spouse_account__c=A2.sfid
        Left join tlcsalesforce.City__c on Account.City__c=City__c.sfid
        Left join tlcsalesforce.Member_Address_information__c on Member_Address_information__c.member__c=Account.sfid
        inner join tlcsalesforce.membershiptype__c on membership__c.customer_set__c=membershiptype__c.sfid
        Inner Join tlcsalesforce.program__c On membershiptype__c.program__c = program__c.sfid
        Left Join tlcsalesforce.Taj_Bank_Detail__c on payment__c.Taj_Bank_Detail__c=Taj_Bank_Detail__c.sfid
        Left join tlcsalesforce.property__c on membershiptype__c.property__c=property__c.sfid
        where (Membership__c.Membership_Enrollment_Date__c = current_date - interval '1 days'
        
              or (Membership__c.Membership_Renewal_Date__c = current_date - interval '1 days'))
               and
        Membership__c is not Null and Membership_Offer__c is null
        and
        (
            --(Property__c.sfid='')
        Or
        program__c.sfid  = '${program_id}')
        AND membershiptype__c.sfid != program__c.default_membership_type__c
        
        `;
        // console.log(qry);
        let data =await pool.query(qry);
        return data.rows.length ? data.rows : [];
    } catch (error) {
        console.log(error);
        return [];
    }
}

/**
 * main calling function
 */
let exportString = async()=>{
     /**
      * Get emails for export string
      */
     try {
     let paymentEmailRuleObject = await getEPRSfid();
     for(let i =0 ; i< paymentEmailRuleObject.emailArr.length;i++){
        let brandId = await getBrandId(paymentEmailRuleObject.programArr[i])
        console.log(`brand id = ${brandId}`)
        let dynamicValues=await getDynamicValues(brandId);
        if(dynamicValues.length){
            let logId = await insertLog(paymentEmailRuleObject.programArr[i] , paymentEmailRuleObject.emailArr[i]);
        // console.log(dynamicValues)
        //  console.log(paymentEmailRuleObject.emailArr[i]);
        //  console.log(paymentEmailRuleObject.programArr[i]);
        //  console.log(paymentEmailRuleObject.programNameArr[i]);

         //get data and send to generate excel function
         let DSRdata = await getDSRData(paymentEmailRuleObject.programArr[i]);
         let OrionStringData =await getOrionStringData(paymentEmailRuleObject.programArr[i]);
        // console.log(OrionStringData);
         /**
         * Generate Excels
         */
         let DSRChequeExcel = await generateExcels.DSRCheque(DSRdata);
         let DSRPriviledgeExcel = await generateExcels.DSRPrivilege(DSRdata);
         let DSRPreferredExcel = await generateExcels.DSRPreferred(DSRdata);
         let OrionStringExcel = await generateExcels.OrionString(OrionStringData);
         
         let filesArr = [{fileName: `DSR Cheque` , filePath : `${DSRChequeExcel}`},{fileName: `DSR Privileged` , filePath : `${DSRPriviledgeExcel}`},{fileName: `DSR Preferred` , filePath : `${DSRPreferredExcel}`},{fileName: `Orion String` , filePath : `${OrionStringExcel}`}];
    //    console.log(filesArr)
         //  console.log(OrionStringcel , DSRChequeExcel , DSRPriviledgeExcel , DSRPreferredExcel )

        /**
         * SendMail 
         */        
         let sendMailData = await sendMail.sendExportSrtingReport(filesArr, `atul.srivastava@tlcgroup.com` , dynamicValues , paymentEmailRuleObject.programNameArr[i] , logId);
         }
        }
    } catch (error) {
        console.log(error)
         return error;
    }
    //  console.log(paymentEmailRuleObject);
}

exportString()
/**
 * Exporting functions
 */
module.exports={
    exportString
}

