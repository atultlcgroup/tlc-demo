`Select ID,Member_Name_Formula__c,Member_Name_Report__c,Membership_Number_Formula_Field__c,Booklet_No__c,Expiry_Date_dd_mm_yyyy__c,Payment_Mode__c,
                          CC_CheqNo_Online_Trn_No__c,Enrollment_Renewal_Date__c,Receipt_No__c,Total_Amount__c,Approval_Code__c,Payment_Mode_for_Report__c,Tax__c,Type_N_R__c,
                          Batch_Number__c,Member_GST_Details__c,Remarks__c,Amount_w_o_Tax__c, Account__r.GSTIN__c,
                          Membership__r.Customer_Set__r.Property__r.Name,Round_Off_Amount_w_o_Tax__c,Round_Off_Tax_Amount__c,Round_Off_Total_Amount__c, Membership__r.Customer_Set__r.Name From Payment__c 
                          where ((Membership__r.Membership_Enrollment_Date__c >= CURRENT_DATE) 
                                 or (Membership__r.Membership_Renewal_Date__c >= CURRENT_DATE))
                          and Membership__c != Null and Membership_Offer__c = null 
                          and Membership__r.Customer_Set__c =: membershipType limit 10000`