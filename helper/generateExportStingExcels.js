let xl = require('excel4node');



/**
* This function takes all required values for DSR Cheque and generates an excel for the same
*/ 

let DSRCheque=async(dataArr)=>{
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
 //Insert data in EXCEL
 let row = 2 ;
  
 for(let data of dataArr){
   let column = 1 ; 
   ws2.cell(row , column++).number(row -1).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.type_of_enrollement ? (data.type_of_enrollement =='New Membership' ? 'New TIC Epicure' : 'TIC Epicure'): ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`Update`).style(style);
   ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
   ws2.cell(row , column++).number(data.net_amount__c ? data.net_amount__c : 0).style(style);
   ws2.cell(row , column++).number(data.sales_tax ? data.sales_tax : 0).style(style);
   let Total_Fees = data.net_amount__c  + data.sales_tax;
   ws2.cell(row , column++).number(Total_Fees ? Total_Fees : 0).style(style);
   ws2.cell(row , column++).string((data.mbr_rct_no == 'Cheque' || data.mbr_rct_no == 'Credit Card' || data.mbr_rct_no == 'CHEQUE' || data.mbr_rct_no == 'CREDIT CARD') ? data.mbr_rct_no :`` ).style(style);//Doubt
   let payment_method = ``;
   if(data.payment_method == 'Cheque' || data.payment_method == 'CHEQUE')
   payment_method = `Cheque`;
   else if(data.payment_method == 'Online' || data.payment_method == 'ONLINE' )
   payment_method = `Net Banking`;

   ws2.cell(row , column++).string(payment_method).style(style);
   let payment_type  = ``;
   if(data.payment_type == 'Cheque' || data.payment_type == 'CHEQUE' || data.payment_type == 'Online' || data.payment_type == 'Online')
   payment_type = `Payment`;
   else if(data.payment_type == 'Credit Card' || data.payment_type == 'CREDIT CARD')
   payment_type = data.payment_type;//Doubt
   ws2.cell(row , column++).string(payment_type).style(style);
   ws2.cell(row , column++).string(`` + (data.cheque_number ? data.cheque_number : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.bank_name ? data.bank_name : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.cheque_date ? convertDateFormatForExcel(data.cheque_date) : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.bank_cheque_deposit_number ? data.bank_cheque_deposit_number : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.bank_deposit_date ? convertDateFormatForExcel(data.bank_deposit_date) : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.cc_details ? data.cc_details : ``)).style(style);
   let consultant_name = data.salutation ? data.salutation : `` + ` `;
   consultant_name += data.firstname ? data.firstname : `` + ` `;
   consultant_name += data.lastname ? data.lastname : ``;
   ws2.cell(row , column++).string(`` + (consultant_name ? consultant_name : ``)).style(style);
   ws2.cell(row , column++).string(`Taj`).style(style);
   ws2.cell(row , column++).string(`` + (data.add_on_plan_code ? data.add_on_plan_code : ``)).style(style);
   let enrollment_type = ``;
   if(data.enrollment_type == `New Membership`)
   enrollment_type = `New`;
   else if(data.enrollment_type == `Renewal` || data.enrollment_type == `Renew`)
   enrollment_type = `Renewal`;
   ws2.cell(row , column++).string(enrollment_type).style(style);
   ws2.cell(row , column++).string(`` + (data.new_renewal_date ? convertDateFormatForExcel(data.new_renewal_date): ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.next_renewal_expiry_date ? convertDateFormatForExcel(data.next_renewal_expiry_date): ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.first_enrolledat == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.first_enroll_source == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
   ws2.cell(row , column++).string(`Taj TeleSales Centre`).style(style);
   let lastUpdateSource = ``;
   if(data.officecity == 'Delhi')
   lastUpdateSource = `Telesales - Delhi`;
   else if(data.officecity == 'Mumbai')
   lastUpdateSource = `Telesales - Mumbai`;
   ws2.cell(row , column++).string(lastUpdateSource).style(style);
   ws2.cell(row , column++).string(`` +(data.membershipno ? data.membershipno : ``)).style(style);
   ws2.cell(row , column++).string(`` +(data.tier ? data.tier : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.statusdesc ? data.statusdesc : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.dt_of_birth ? data.dt_of_birth : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.gender ? data.gender : ``)).style(style);
   ws2.cell(row , column++).string(`IN`).style(style);
   ws2.cell(row , column++).string(`` + (data.title ? data.title : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.first_name ? data.first_name : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.last_name ? data.last_name : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officeadd1 ? data.officeadd1 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officeadd2 ? data.officeadd2 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officeadd3 ? data.officeadd3 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officecountry ? data.officecountry : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officestate ? data.officestate : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officecity ? data.officecity : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officepin ? data.officepin : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officetel ? data.officetel : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officetel2 ? data.officetel2 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officemobile ? data.officemobile : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.officefax ? data.officefax : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.office_email ? data.office_email : ``)).style(style);
   ws2.cell(row , column++).string(`"B"`).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.homeadd1 ? data.homeadd1 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homeadd2 ? data.homeadd2 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homeadd3 ? data.homeadd3 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homecountry ? data.homecountry : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homestate ? data.homestate : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homecity ? data.homecity : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homepin ? data.homepin : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.hometel ? data.hometel : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.hometel2 ? data.hometel2 : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.mobile ? data.mobile : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homefax ? data.homefax : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.homeemail ? data.homeemail : ``)).style(style);
   ws2.cell(row , column++).string(`"R"`).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.Preferred_Postal_Communication ? data.Preferred_Postal_Communication : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.Preferred_Email_Communication ? data.Preferred_Email_Communication : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.Preferred_Mobile_Communication ? data.Preferred_Mobile_Communication : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.designation ? data.designation : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.company ? data.company : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.job_description ? data.job_description : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.til_form_no ? data.til_form_no : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.created_at_source == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.created_at_channel == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.createdby == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.createddt ? convertDateFormatForExcel(data.createddt): ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.modified_by ? data.modified_by: ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.modifieddt ? convertDateFormatForExcel(data.modifieddt): ``)).style(style);
   ws2.cell(row , column++).string(`"Spouse"`).style(style); 
   ws2.cell(row , column++).string(`` + (data.marital ? data.marital : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.spoussex ? data.spoussex : ``)).style(style); 
   let spouseFullName =(data.spous_sal ? data.spous_sal : ``) + ` `+ (data.spous_firstname ? data.spous_firstname : ``) + ` `+ (data.spous_lastname ? data.spous_lastname : ``);
   ws2.cell(row , column++).string(`` + (spouseFullName)).style(style); 
   ws2.cell(row , column++).string(`` + (data.spous_sal ? data.spous_sal : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.spous_firstname ? data.spous_firstname : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.spous_lastname ? data.spous_lastname : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.spousdob ? data.spousdob : ``)).style(style); 
   ws2.cell(row , column++).string(`` + (data.anniversary ? data.anniversary : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.orion_cheque_bank ? data.orion_cheque_bank : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + ((data.payment_mode__c == 'CHEQUE' || data.payment_mode__c == 'Cheque') ? 'Other Local' : ``)).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(``).style(style);
   ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
   ws2.cell(row , column++).string(`"Y"`).style(style);
   ws2.cell(row , column++).string(`` + (data.state_code ? data.state_code : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.city_code ? data.city_code : ``)).style(style);
   ws2.cell(row , column++).string(`` + (data.enrolled_in_taj_loyalty_program__c ? data.enrolled_in_taj_loyalty_program__c : `false`)).style(style);
   ws2.cell(row , column++).string(`` + (data.sms_communication_preferences__c ? data.sms_communication_preferences__c : `false`)).style(style);
   ws2.cell(row , column++).string(`` + (data.terms_and_condition_flag__c ? data.terms_and_condition_flag__c : `false`)).style(style);
  row++;
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

let DSRPrivilege=async(dataArr)=>{
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

   //Insert data in EXCEL
   let row = 2 ;
  
   for(let data of dataArr){
     let column = 1 ; 
     ws2.cell(row , column++).number(row -1).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.type_of_enrollement ? (data.type_of_enrollement =='New Membership' ? 'New Privileged Epicure' : 'Privileged Epicure'): ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`Update`).style(style);
     ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
     ws2.cell(row , column++).number(data.net_amount__c ? data.net_amount__c : 0).style(style);
     ws2.cell(row , column++).number(data.sales_tax ? data.sales_tax : 0).style(style);
     let Total_Fees = data.net_amount__c  + data.sales_tax;
     ws2.cell(row , column++).number(Total_Fees ? Total_Fees : 0).style(style);
     ws2.cell(row , column++).string((data.mbr_rct_no == 'Cheque' || data.mbr_rct_no == 'Credit Card' || data.mbr_rct_no == 'CHEQUE' || data.mbr_rct_no == 'CREDIT CARD') ? data.mbr_rct_no :`` ).style(style);//Doubt
     let payment_method = ``;
     if(data.payment_method == 'Cheque' || data.payment_method == 'CHEQUE')
     payment_method = `Cheque`;
     else if(data.payment_method == 'Online' || data.payment_method == 'ONLINE' )
     payment_method = `Net Banking`;
 
     ws2.cell(row , column++).string(payment_method).style(style);
     let payment_type  = ``;
     if(data.payment_type == 'Cheque' || data.payment_type == 'CHEQUE' || data.payment_type == 'Online' || data.payment_type == 'Online')
     payment_type = `Payment`;
     else if(data.payment_type == 'Credit Card' || data.payment_type == 'CREDIT CARD')
     payment_type = data.payment_type;//Doubt
     ws2.cell(row , column++).string(payment_type).style(style);
     ws2.cell(row , column++).string(`` + (data.cheque_number ? data.cheque_number : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_name ? data.bank_name : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.cheque_date ? convertDateFormatForExcel(data.cheque_date) : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_cheque_deposit_number ? data.bank_cheque_deposit_number : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_deposit_date ? convertDateFormatForExcel(data.bank_deposit_date) : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.cc_details ? data.cc_details : ``)).style(style);
     let consultant_name = data.salutation ? data.salutation : `` + ` `;
     consultant_name += data.firstname ? data.firstname : `` + ` `;
     consultant_name += data.lastname ? data.lastname : ``;
     ws2.cell(row , column++).string(`` + (consultant_name ? consultant_name : ``)).style(style);
     ws2.cell(row , column++).string(`Taj`).style(style);
     ws2.cell(row , column++).string(`` + (data.add_on_plan_code ? data.add_on_plan_code : ``)).style(style);
     let enrollment_type = ``;
     if(data.enrollment_type == `New Membership`)
     enrollment_type = `New`;
     else if(data.enrollment_type == `Renewal` || data.enrollment_type == `Renew`)
     enrollment_type = `Renewal`;
     ws2.cell(row , column++).string(enrollment_type).style(style);
     ws2.cell(row , column++).string(`` + (data.new_renewal_date ? convertDateFormatForExcel(data.new_renewal_date): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.next_renewal_expiry_date ? convertDateFormatForExcel(data.next_renewal_expiry_date): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.first_enrolledat == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.first_enroll_source == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
     ws2.cell(row , column++).string(`Taj TeleSales Centre`).style(style);
     let lastUpdateSource = ``;
     if(data.officecity == 'Delhi')
     lastUpdateSource = `Telesales - Delhi`;
     else if(data.officecity == 'Mumbai')
     lastUpdateSource = `Telesales - Mumbai`;
     ws2.cell(row , column++).string(lastUpdateSource).style(style);
     ws2.cell(row , column++).string(`` +(data.membershipno ? data.membershipno : ``)).style(style);
     ws2.cell(row , column++).string(`` +(data.tier ? `PRIVILEGED` : `PRIVILEGED`)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.statusdesc ? data.statusdesc : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.dt_of_birth ? data.dt_of_birth : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.gender ? data.gender : ``)).style(style);
     ws2.cell(row , column++).string(`IN`).style(style);
     ws2.cell(row , column++).string(`` + (data.title ? data.title : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.first_name ? data.first_name : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.last_name ? data.last_name : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd1 ? data.officeadd1 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd2 ? data.officeadd2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd3 ? data.officeadd3 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officecountry ? data.officecountry : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officestate ? data.officestate : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officecity ? data.officecity : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officepin ? data.officepin : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officetel ? data.officetel : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officetel2 ? data.officetel2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officemobile ? data.officemobile : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officefax ? data.officefax : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.office_email ? data.office_email : ``)).style(style);
     ws2.cell(row , column++).string(`"B"`).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd1 ? data.homeadd1 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd2 ? data.homeadd2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd3 ? data.homeadd3 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homecountry ? data.homecountry : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homestate ? data.homestate : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homecity ? data.homecity : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homepin ? data.homepin : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.hometel ? data.hometel : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.hometel2 ? data.hometel2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.mobile ? data.mobile : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homefax ? data.homefax : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeemail ? data.homeemail : ``)).style(style);
     ws2.cell(row , column++).string(`"R"`).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.Preferred_Postal_Communication ? data.Preferred_Postal_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.Preferred_Email_Communication ? data.Preferred_Email_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.Preferred_Mobile_Communication ? data.Preferred_Mobile_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.designation ? data.designation : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.company ? data.company : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.job_description ? data.job_description : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.til_form_no ? data.til_form_no : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.created_at_source == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.created_at_channel == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.createdby == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.createddt ? convertDateFormatForExcel(data.createddt): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.modified_by ? data.modified_by: ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.modifieddt ? convertDateFormatForExcel(data.modifieddt): ``)).style(style);
     ws2.cell(row , column++).string(`"Spouse"`).style(style); 
     ws2.cell(row , column++).string(`` + (data.marital ? data.marital : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spoussex ? data.spoussex : ``)).style(style); 
     let spouseFullName =(data.spous_sal ? data.spous_sal : ``) + ` `+ (data.spous_firstname ? data.spous_firstname : ``) + ` `+ (data.spous_lastname ? data.spous_lastname : ``);
     ws2.cell(row , column++).string(`` + (spouseFullName)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_sal ? data.spous_sal : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_firstname ? data.spous_firstname : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_lastname ? data.spous_lastname : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spousdob ? data.spousdob : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.anniversary ? data.anniversary : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.orion_cheque_bank ? data.orion_cheque_bank : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + ((data.payment_mode__c == 'CHEQUE' || data.payment_mode__c == 'Cheque') ? 'Other Local' : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
     ws2.cell(row , column++).string(`"Y"`).style(style);
     ws2.cell(row , column++).string(`` + (data.state_code ? data.state_code : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.city_code ? data.city_code : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.enrolled_in_taj_loyalty_program__c ? data.enrolled_in_taj_loyalty_program__c : `false`)).style(style);
     ws2.cell(row , column++).string(`` + (data.sms_communication_preferences__c ? data.sms_communication_preferences__c : `false`)).style(style);
     ws2.cell(row , column++).string(`` + (data.terms_and_condition_flag__c ? data.terms_and_condition_flag__c : `false`)).style(style);
    row++;
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
let DSRPreferred=async(dataArr)=>{
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
   //Insert data in EXCEL
   let row = 2 ;
  
   for(let data of dataArr){
     let column = 1 ; 
     ws2.cell(row , column++).number(row -1).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.type_of_enrollement ? (data.type_of_enrollement =='New Membership' ? 'New Preferred Epicure' : 'Preferred Epicure'): ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`Update`).style(style);
     ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
     ws2.cell(row , column++).number(data.net_amount__c ? data.net_amount__c : 0).style(style);
     ws2.cell(row , column++).number(data.sales_tax ? data.sales_tax : 0).style(style);
     let Total_Fees = data.net_amount__c  + data.sales_tax;
     ws2.cell(row , column++).number(Total_Fees ? Total_Fees : 0).style(style);
     ws2.cell(row , column++).string((data.mbr_rct_no == 'Cheque' || data.mbr_rct_no == 'Credit Card' || data.mbr_rct_no == 'CHEQUE' || data.mbr_rct_no == 'CREDIT CARD') ? data.mbr_rct_no :`` ).style(style);//Doubt
     let payment_method = ``;
     if(data.payment_method == 'Cheque' || data.payment_method == 'CHEQUE')
     payment_method = `Cheque`;
     else if(data.payment_method == 'Online' || data.payment_method == 'ONLINE' )
     payment_method = `Net Banking`;
 
     ws2.cell(row , column++).string(payment_method).style(style);
     let payment_type  = ``;
     if(data.payment_type == 'Cheque' || data.payment_type == 'CHEQUE' || data.payment_type == 'Online' || data.payment_type == 'Online')
     payment_type = `Payment`;
     else if(data.payment_type == 'Credit Card' || data.payment_type == 'CREDIT CARD')
     payment_type = data.payment_type;//Doubt
     ws2.cell(row , column++).string(payment_type).style(style);
     ws2.cell(row , column++).string(`` + (data.cheque_number ? data.cheque_number : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_name ? data.bank_name : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.cheque_date ? convertDateFormatForExcel(data.cheque_date) : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_cheque_deposit_number ? data.bank_cheque_deposit_number : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.bank_deposit_date ? convertDateFormatForExcel(data.bank_deposit_date) : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.cc_details ? data.cc_details : ``)).style(style);
     let consultant_name = data.salutation ? data.salutation : `` + ` `;
     consultant_name += data.firstname ? data.firstname : `` + ` `;
     consultant_name += data.lastname ? data.lastname : ``;
     ws2.cell(row , column++).string(`` + (consultant_name ? consultant_name : ``)).style(style);
     ws2.cell(row , column++).string(`Taj`).style(style);
     ws2.cell(row , column++).string(`` + (data.add_on_plan_code ? data.add_on_plan_code : ``)).style(style);
     let enrollment_type = ``;
     if(data.enrollment_type == `New Membership`)
     enrollment_type = `New`;
     else if(data.enrollment_type == `Renewal` || data.enrollment_type == `Renew`)
     enrollment_type = `Renewal`;
     ws2.cell(row , column++).string(enrollment_type).style(style);
     ws2.cell(row , column++).string(`` + (data.new_renewal_date ? convertDateFormatForExcel(data.new_renewal_date): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.next_renewal_expiry_date ? convertDateFormatForExcel(data.next_renewal_expiry_date): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.first_enrolledat == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.first_enroll_source == 'New Membership' ? `Taj TeleSales Centre` : ``)).style(style);
     ws2.cell(row , column++).string(`Taj TeleSales Centre`).style(style);
     let lastUpdateSource = ``;
     if(data.officecity == 'Delhi')
     lastUpdateSource = `Telesales - Delhi`;
     else if(data.officecity == 'Mumbai')
     lastUpdateSource = `Telesales - Mumbai`;
     ws2.cell(row , column++).string(lastUpdateSource).style(style);
     ws2.cell(row , column++).string(`` +(data.membershipno ? data.membershipno : ``)).style(style);
     ws2.cell(row , column++).string(`` +(data.tier ? 'PREFERRED' : `PREFERRED`)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.statusdesc ? data.statusdesc : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.dt_of_birth ? data.dt_of_birth : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.gender ? data.gender : ``)).style(style);
     ws2.cell(row , column++).string(`IN`).style(style);
     ws2.cell(row , column++).string(`` + (data.title ? data.title : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.first_name ? data.first_name : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.last_name ? data.last_name : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd1 ? data.officeadd1 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd2 ? data.officeadd2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officeadd3 ? data.officeadd3 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officecountry ? data.officecountry : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officestate ? data.officestate : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officecity ? data.officecity : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officepin ? data.officepin : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officetel ? data.officetel : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officetel2 ? data.officetel2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officemobile ? data.officemobile : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.officefax ? data.officefax : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.office_email ? data.office_email : ``)).style(style);
     ws2.cell(row , column++).string(`"B"`).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd1 ? data.homeadd1 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd2 ? data.homeadd2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeadd3 ? data.homeadd3 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homecountry ? data.homecountry : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homestate ? data.homestate : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homecity ? data.homecity : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homepin ? data.homepin : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.hometel ? data.hometel : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.hometel2 ? data.hometel2 : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.mobile ? data.mobile : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homefax ? data.homefax : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.homeemail ? data.homeemail : ``)).style(style);
     ws2.cell(row , column++).string(`"R"`).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.Preferred_Postal_Communication ? data.Preferred_Postal_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.Preferred_Email_Communication ? data.Preferred_Email_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.Preferred_Mobile_Communication ? data.Preferred_Mobile_Communication : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.designation ? data.designation : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.company ? data.company : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.job_description ? data.job_description : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.til_form_no ? data.til_form_no : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.profession ? data.profession : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.created_at_source == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.created_at_channel == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.createdby == 'New Membership' ? 'Taj TeleSales Centre' : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.createddt ? convertDateFormatForExcel(data.createddt): ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.modified_by ? data.modified_by: ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.modifieddt ? convertDateFormatForExcel(data.modifieddt): ``)).style(style);
     ws2.cell(row , column++).string(`"Spouse"`).style(style); 
     ws2.cell(row , column++).string(`` + (data.marital ? data.marital : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spoussex ? data.spoussex : ``)).style(style); 
     let spouseFullName =(data.spous_sal ? data.spous_sal : ``) + ` `+ (data.spous_firstname ? data.spous_firstname : ``) + ` `+ (data.spous_lastname ? data.spous_lastname : ``);
     ws2.cell(row , column++).string(`` + (spouseFullName)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_sal ? data.spous_sal : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_firstname ? data.spous_firstname : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spous_lastname ? data.spous_lastname : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.spousdob ? data.spousdob : ``)).style(style); 
     ws2.cell(row , column++).string(`` + (data.anniversary ? data.anniversary : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.orion_cheque_bank ? data.orion_cheque_bank : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + ((data.payment_mode__c == 'CHEQUE' || data.payment_mode__c == 'Cheque') ? 'Other Local' : ``)).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(``).style(style);
     ws2.cell(row , column++).string(`` + (data.membership_enrollment_date__c ? convertDateFormatForExcel(data.membership_enrollment_date__c): ``)).style(style);
     ws2.cell(row , column++).string(`"Y"`).style(style);
     ws2.cell(row , column++).string(`` + (data.state_code ? data.state_code : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.city_code ? data.city_code : ``)).style(style);
     ws2.cell(row , column++).string(`` + (data.enrolled_in_taj_loyalty_program__c ? data.enrolled_in_taj_loyalty_program__c : `false`)).style(style);
     ws2.cell(row , column++).string(`` + (data.sms_communication_preferences__c ? data.sms_communication_preferences__c : `false`)).style(style);
     ws2.cell(row , column++).string(`` + (data.terms_and_condition_flag__c ? data.terms_and_condition_flag__c : `false`)).style(style);
    row++;
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
 * 
 * Date formate
 */

let monthArr = ['Jan', 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec'];
 let convertDateFormatForExcel = (date1) => {
   let dateTime = ``;
  if (date1) {
      let today1 = new Date(date1);
      let hours1 = date1.getHours();
      let minutes = date1.getMinutes();
      let ampm = hours1 >= 12 ? 'pm' : 'am';
      hours1 = hours1 % 12;
      hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      let strTime = hours1 + ':' + minutes + ' ' + ampm;
      dateTime = `${String(today1.getDate()).padStart(2, '0')}-${monthArr[today1.getMonth() +1]}-${today1.getFullYear()}`;
  }
  return dateTime;
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
        ws2.cell(row , column++).string(`` +(d.membership_number__c ? d.membership_number__c : `` )).style(style);
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
        ws2.cell(row , column++).string(`` + (d.membership_enrollment_date__c ? convertDateFormatForExcel(d.membership_enrollment_date__c) : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.expiry_date__c ? convertDateFormatForExcel(d.expiry_date__c) : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.state_code ? d.state_code : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.city_code ? d.city_code : ``)).style(style);
        ws2.cell(row , column++).string(`` + (d.membership_enrollment_date__c ? convertDateFormatForExcel(d.membership_enrollment_date__c) : ``)).style(style);
        ws2.cell(row , column++).number( (d.net_amount__c ? d.net_amount__c : 0)).style(style);
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