let xl = require('excel4node');



/**
* This function takes all required values for DSR Cheque and generates an excel for the same
*/ 

let DSRCheque=async(data)=>{
      // Create a new instance of a Workbook class
    let wb = new xl.Workbook();
    // Add Worksheets to the workbook
    // let ws = wb.addWorksheet('tlc collects money');
    let ws2 = wb.addWorksheet(`DSR Cheque`);
    let style = wb.createStyle({
        font: {
          color: '#000000',
          size: 12,
        },
        // numberFormat: '$#,##0.00; ($#,##0.00); -',
      });
      let sheetHeaderArr=['Dsr no','Dmdb_Uid','Type_Of_Enrollement','Profile_Type','Type_Of_Upload','Dsr_Date','Fees_Of_Addon_Plan','Sales_Tax','Total_Fees','Mbr_Rct_No','Payment_Method','Payment_Type','Cheque_Number','Bank_Name','Cheque_Date','Bank_Cheque_Deposit_Number','Bank_Deposit_Date','Cc_Details','Consultant_Name','Partner_Name','Add_On_Plan_Code','Enrollment_Type','New_Renewal_Date','Next_Renewal_Expiry_Date','First_Enrolledat','First_Enroll_Source','Last_Updateat','Last_Update_Source','Membershipno','Tier','Reason_Code_For_Higher_Tier','Statusdesc','Dt_Of_Birth','Gender','Nationality','Title','Full_Name	Addas','First_Name','Middlename','Last_Name','Officeadd1','Officeadd2','Officeadd3','Officecountry','Officestate','Officecity','Officepin','Officetel','Officetel2','Officemobile','Officefax','Officeembil','Addr_Type_Cd','Region_Of_Office_Address','Homeadd1','Homeadd2','Homeadd3','Homecountry','Homestate','Homecity','Homepin','Hometel','Hometel2','Mobile','Homefax','Homeemail','Alt_Addr_Type_Cd','Region_Of_Home_Address','Preferred_Postal_Communication','Preferred_Email_Communication','Preferred_Mobile_Communication','Designation','Company','Job_Description','Profession','Tic_Form_No','Form_Sign_Date','Created_At_Source(Non Member)','Created_At_Channel(Non Member)','Createdby','Createddt','Modifiedby','Modifieddt','Relation','Marital','Spoussex','Fullname','Spous_Sal','Spous_Firstname','Spous_Lastname','Spousdob','Anniversary','Pan_No','Passport_No','Passport_Issue_Date','Adharcard_No','Driving_Lic_No','Cis_Id','Sfa_Id','Do_Not_Expiry_Flag','Do_Not_Downgrade','Do_Not_Send_Statement','Unsubscribefrompromomails','Contact_Me_On_Mobile','Sales_Acount_Type','Easypaycardno','Easypayexpdt','Easypaytype','Tapcity','Relationship_Manager','Do_Send_Postal_Mail','Do_Not_Send_Email','Do_Not_Call','Cis_Remark','Inactive_Status','Address_Invalid','Emial_Id_Invalid','Fnb_Remarks','Fo_Remarks','Hk_Remarks','Rs_Remarks','Send_Email','Sic','Priorty','Influence','Accountlevel','Accounttype','Accountno','Accountid','Contactid','Acc_Basetype','orion_cheque_bank','orion_cheque_branch','orion_cheque_city','orion_cheque_type','orion_paid_by','orion_payment_method','orion_payment_type','orion_transaction_date','Addon_Calling(Need to add in adhoc temp table)','State Code','City Code','Enrolled into the Taj Inner Circle loyalty programme','Agree to Receive marketing and promotional emails/SMS /Calls','Agree to Use of your personal information for analytics and research purpose'];
  /**
       * Looping header
       */
   for(let h =0 ; h <sheetHeaderArr.length ;h++){
    ws2.cell(1, h +1).string(`${sheetHeaderArr[h]}`).style(style);
  }

  let fileName = `./reports/ExportString/DSRCheque_${Date.now()}.xlsx`
  const buffer = await wb.writeToBuffer();
   
  await wb.write(`${fileName}`);
  return new Promise(async(resolve,reject)=>{
    try{
      await resolve(`${fileName}`)
       
    }catch(e){
        console.log(e)
      reject(`${e}`)
    }
  })
    }

/**
 * This function takes all required values for DSR Privilege and generates an excel for the same
 */

let DSRPrivilege=async(data)=>{
        // Create a new instance of a Workbook class
        let wb = new xl.Workbook();
        // Add Worksheets to the workbook
        // let ws = wb.addWorksheet('tlc collects money');
        let ws2 = wb.addWorksheet(`DSR Priviledged`);
        let style = wb.createStyle({
            font: {
              color: '#000000',
              size: 12,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
          });
     let sheetHeaderArr = ['Dsr no','Dmdb_Uid','Type_Of_Enrollement','Profile_Type','Type_Of_Upload','Dsr_Date','Fees_Of_Addon_Plan','Sales_Tax','Total_Fees','Mbr_Rct_No','Payment_Method','Payment_Type','Cheque_Number','Bank_Name','Cheque_Date','Bank_Cheque_Deposit_Number','Bank_Deposit_Date','Cc_Details','Consultant_Name','Partner_Name','Add_On_Plan_Code','Enrollment_Type','New_Renewal_Date','Next_Renewal_Expiry_Date','First_Enrolledat','First_Enroll_Source','Last_Updateat','Last_Update_Source','Membershipno','Tier','Reason_Code_For_Higher_Tier','Statusdesc','Dt_Of_Birth','Gender','Nationality','Title','Full_Name','Addas','First_Name','Middlename','Last_Name','Officeadd1','Officeadd2','Officeadd3','Officecountry','Officestate','Officecity','Officepin','Officetel','Officetel2','Officemobile','Officefax','Officeembil','Addr_Type_Cd','Region_Of_Office_Address','Homeadd1','Homeadd2','Homeadd3','Homecountry','Homestate','Homecity','Homepin','Hometel','Hometel2','Mobile','Homefax','Homeemail','Alt_Addr_Type_Cd','Region_Of_Home_Address','Preferred_Postal_Communication','Preferred_Email_Communication','Preferred_Mobile_Communication','Designation','Company','Job_Description','Profession','Tic_Form_No','Form_Sign_Date','Created_At_Source(Non Member)','Created_At_Channel(Non Member)','Createdby','Createddt','Modifiedby','Modifieddt','Relation','Marital','Spoussex','Fullname','Spous_Sal','Spous_Firstname','Spous_Lastname','Spousdob','Anniversary','Pan_No','Passport_No','Passport_Issue_Date','Adharcard_No','Driving_Lic_No','Cis_Id','Sfa_Id','Do_Not_Expiry_Flag','Do_Not_Downgrade','Do_Not_Send_Statement','Unsubscribefrompromomails','Contact_Me_On_Mobile	Sales_Acount_Type','Easypaycardno','Easypayexpdt','Easypaytype','Tapcity','Relationship_Manager','Do_Send_Postal_Mail','Do_Not_Send_Email','Do_Not_Call','Cis_Remark','Inactive_Status','Address_Invalid','Emial_Id_Invalid','Fnb_Remarks','Fo_Remarks','Hk_Remarks','Rs_Remarks','Send_Email','Sic','Priorty','Influence','Accountlevel','Accounttype','Accountno','Accountid','Contactid','Acc_Basetype','orion_cheque_bank','orion_cheque_branch','orion_cheque_city','orion_cheque_type','orion_paid_by','orion_payment_method','orion_payment_type','orion_transaction_date','Addon_Calling(Need to add in adhoc temp table)','State Code','City Code','Enrolled into the Taj Inner Circle loyalty programme','Agree to Receive marketing and promotional emails/SMS /Calls','Agree to Use of your personal information for analytics and research purpose'];
      /**
       * Looping header
       */
      for(let h =0 ; h <sheetHeaderArr.length ;h++){
        ws2.cell(1, h +1).string(`${sheetHeaderArr[h]}`).style(style);
      }

      let fileName = `./reports/ExportString/DSRPrivilege_${Date.now()}.xlsx`
      const buffer = await wb.writeToBuffer();
       
      await wb.write(`${fileName}`);
      return new Promise(async(resolve,reject)=>{
        try{
          await resolve(`${fileName}`)
           
        }catch(e){
            console.log(e)
          reject(`${e}`)
        }
      })

    }



/**
 * This function takes all required values for DSR Preferred and generates an excel for the same
 */
let DSRPreferred=async(data)=>{
        // Create a new instance of a Workbook class
        let wb = new xl.Workbook();
        // Add Worksheets to the workbook
        // let ws = wb.addWorksheet('tlc collects money');
        let ws2 = wb.addWorksheet(`DSR Preferred`);
        let style = wb.createStyle({
            font: {
              color: '#000000',
              size: 12,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
          });
     let sheetHeaderArr = ['Dsr no','Dmdb_Uid','Type_Of_Enrollement','Profile_Type','Type_Of_Upload','Dsr_Date','Fees_Of_Addon_Plan','Sales_Tax','Total_Fees','Mbr_Rct_No','Payment_Method','Payment_Type','Cheque_Number','Bank_Name','Cheque_Date','Bank_Cheque_Deposit_Number','Bank_Deposit_Date','Cc_Details','Consultant_Name','Partner_Name','Add_On_Plan_Code','Enrollment_Type','New_Renewal_Date','Next_Renewal_Expiry_Date','First_Enrolledat','First_Enroll_Source','Last_Updateat','Last_Update_Source','Membershipno','Tier','Reason_Code_For_Higher_Tier','Statusdesc','Dt_Of_Birth','Gender','Nationality','Title','Full_Name','Addas','First_Name','Middlename','Last_Name','Officeadd1','Officeadd2','Officeadd3','Officecountry','Officestate','Officecity','Officepin','Officetel','Officetel2','Officemobile','Officefax','Officeembil','Addr_Type_Cd','Region_Of_Office_Address','Homeadd1','Homeadd2','Homeadd3','Homecountry','Homestate','Homecity','Homepin','Hometel','Hometel2','Mobile','Homefax','Homeemail','Alt_Addr_Type_Cd','Region_Of_Home_Address','Preferred_Postal_Communication','Preferred_Email_Communication','Preferred_Mobile_Communication','Designation','Company','Job_Description','Profession','Tic_Form_No','Form_Sign_Date','Created_At_Source(Non Member)','Created_At_Channel(Non Member)','Createdby','Createddt','Modifiedby','Modifieddt','Relation','Marital','Spoussex','Fullname','Spous_Sal','Spous_Firstname','Spous_Lastname','Spousdob','Anniversary','Pan_No','Passport_No','Passport_Issue_Date','Adharcard_No','Driving_Lic_No','Cis_Id','Sfa_Id','Do_Not_Expiry_Flag','Do_Not_Downgrade','Do_Not_Send_Statement','Unsubscribefrompromomails','Contact_Me_On_Mobile	Sales_Acount_Type','Easypaycardno','Easypayexpdt','Easypaytype','Tapcity','Relationship_Manager','Do_Send_Postal_Mail','Do_Not_Send_Email','Do_Not_Call','Cis_Remark','Inactive_Status','Address_Invalid','Emial_Id_Invalid','Fnb_Remarks','Fo_Remarks','Hk_Remarks','Rs_Remarks','Send_Email','Sic','Priorty','Influence','Accountlevel','Accounttype','Accountno','Accountid','Contactid','Acc_Basetype','orion_cheque_bank','orion_cheque_branch','orion_cheque_city','orion_cheque_type','orion_paid_by','orion_payment_method','orion_payment_type','orion_transaction_date','Addon_Calling(Need to add in adhoc temp table)','State Code','City Code','Enrolled into the Taj Inner Circle loyalty programme','Agree to Receive marketing and promotional emails/SMS /Calls','Agree to Use of your personal information for analytics and research purpose'];
  /**
       * Looping header
       */
   for(let h =0 ; h <sheetHeaderArr.length ;h++){
    ws2.cell(1, h +1).string(`${sheetHeaderArr[h]}`).style(style);
  }

  let fileName = `./reports/ExportString/DSRPreferred_${Date.now()}.xlsx`
  const buffer = await wb.writeToBuffer();
   
  await wb.write(`${fileName}`);
  return new Promise(async(resolve,reject)=>{
    try{
      await resolve(`${fileName}`)
       
    }catch(e){
        console.log(e)
      reject(`${e}`)
    }
  })
}

/**
 * This function takes all required values for OrionString and generates an excel for the same
 */
 


let OrionString=async(data)=>{
        // Create a new instance of a Workbook class
        let wb = new xl.Workbook();
        // Add Worksheets to the workbook
        // let ws = wb.addWorksheet('tlc collects money');
        let ws2 = wb.addWorksheet(`Orion String`);
        let style = wb.createStyle({
            font: {
              color: '#000000',
              size: 12,
            },
            // numberFormat: '$#,##0.00; ($#,##0.00); -',
          });
    let sheetHeaderArr = ['Membership_Number','Guest_Name','Address_1','Address_2','Address_3','City_Name','Postal_Code','Telephone_Number','Mobile_Number','Fax_Number','Email_Address','Cperson_Title','cperson_fname','cperson_lname','Recommended_By','Membership_From','Membership_To','Address_State_Code','Address_City_Code','Transaction_Date','Base_Amount','Payment_Method','Payment_Type','Cheque_No.','Cheque_Bank','Cheque_City','Cheque_Branch','Cheque_Date','Cheque_Type','Credit_Card_Number','Paid_By','GST No','Membership Type'];
  /**
       * Looping header
       */
      for(let h =0 ; h <sheetHeaderArr.length ;h++){
        ws2.cell(1, h +1).string(`${sheetHeaderArr[h]}`).style(style);
      }
      let row =2;
      for(let d of data){
        // console.log(data)
        let column = 1;
        ws2.cell(row , column++).number((d.membership_number__c ? d.membership_number__c : 0 )).style(style);
        ws2.cell(row , column++).string(`` + (d.name ? d.name : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.add1 ? d.add1 : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.add2 ? d.add2 : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.add3 ? d.add3 : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.city ? d.city : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.billingpostalcode ? d.billingpostalcode : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.telephone_number ? d.telephone_number : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.mobile_number ? d.mobile_number : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.fax_number ? d.fax_number : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.email_for_notification__c ? d.email_for_notification__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.salutation ? d.salutation : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.firstname ? d.firstname : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.lastname ? d.lastname : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.recommended_by ? d.recommended_by : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.membership_enrollment_date__c ? d.membership_enrollment_date__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.expiry_date__c ? d.expiry_date__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.state_code ? d.state_code : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.city_code ? d.city_code : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.membership_enrollment_date__c ? d.membership_enrollment_date__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.net_amount__c ? d.net_amount__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.payment_mode__c ? d.payment_mode__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.payment_mode__c ? d.payment_mode__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.cheque_number__c ? d.cheque_number__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.orion_cheque_bank ? d.orion_cheque_bank : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.check_city ? d.check_city : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.check_branch ? d.check_branch : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.bank_deposit_date__c ? d.bank_deposit_date__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.payment_mode__c = 'CHEQUE'? 'Other Local' : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.credit_card__c ? d.credit_card__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.paid_by ? d.paid_by : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.gst_details__c ? d.gst_details__c : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.customer_set_program_level__c ? d.customer_set_program_level__c : ``)).style(style);
        row++;

      }

  let fileName = `./reports/ExportString/OrionString_${Date.now()}.xlsx`
  const buffer = await wb.writeToBuffer();
   
  await wb.write(`${fileName}`);
  return new Promise(async(resolve,reject)=>{
    try{
      await resolve(`${fileName}`)
       
    }catch(e){
        console.log(e)
      reject(`${e}`)
    }
  })
  }

// Exporting the functions
// DSRCheque()
// DSRPrivilege()
// DSRPreferred()
// OrionString()
module.exports={
    DSRCheque,
    DSRPrivilege,
    DSRPreferred,
    OrionString
}