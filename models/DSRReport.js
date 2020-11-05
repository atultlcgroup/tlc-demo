let sendMail= require("../helper/mailModel")
let generatePdf = require("../helper/generateDSRPdf")
const pool = require("../databases/db").pool;

let findPaymentRule= async(req)=>{
    try{
        console.log(`${req.property_sfid} || ${req.customer_set_sfid}`)
        let qry = ``;
        if(req.property_sfid && req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}' and customer_set__c = '${req.customer_set_sfid}'`;
        if(req.property_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where property__c = '${req.property_sfid}'`;
        if(req.customer_set_sfid)
        qry = `select hotel_email_status__c,hotel_emails__c,manager_email__c,tlc_email_status__c from tlcsalesforce.Payment_Email_Rule__c where customer_set__c = '${req.customer_set_sfid}'`;
        console.log(qry)
        let emailData = await pool.query(`${qry}`)
        let result = emailData ? emailData.rows : []
        let resultArray=[];
        if(result){
            for(let d of result){
            if(d.hotel_email_status__c == true)
            resultArray= resultArray.concat(d.hotel_emails__c.split(','));
            if(d.tlc_email_status__c == true)
            resultArray=resultArray.concat(d.manager_email__c.split(','));
           }
        }
        return resultArray
    }catch(e){
        console.log(e)
        return [];
    }
}

let DSRReport = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let dataObj = await getEPRSfid();
            console.log(dataObj)

            let ind = 0;
               
             for(e of dataObj.emailArr){
            let emails = e;
            // req.property_sfid = 'a0Y1y000000EFBNEA4';
            console.log("getting DSR report");
            console.log(`----------------`)
            let DSRRecords=await getDSRReport(dataObj.propertyArr[ind]);
            //  let DSRRecords=await getDSRReport('a0Y1y000000EFBNEA4');
                if(DSRRecords.length){
                    let pdfFile = await generatePdf.generateDSRPDF(DSRRecords,dataObj.propertyArr[ind]);
                    console.log(pdfFile)
                  sendMail.sendDSRReport(`${pdfFile}`,'Daily Sales Report',emails)
                    console.log(`From Model`)
                }
            ind++;
            
          }

          //For customerset 
          let dataObj1 = await getEPRSfidCS();
          console.log(dataObj1)
          let ind1 = 0;
           for(e of dataObj1.emailArr){
          let emails1 = e;
          // req.property_sfid = 'a0Y1y000000EFBNEA4';
          console.log("getting DSR report");
           let DSRRecords1=await getDSRReportCS(dataObj1.customer_set_sfid[ind1]);
        //   let DSRRecords1=await getDSRReportCS('a0J1y000000u9BJEAY');
              if(DSRRecords1.length){
                  let pdfFile1 = await generatePdf.generateDSRPDF(DSRRecords1,dataObj1.customer_set_sfid[ind1]);
                  console.log(pdfFile1)
                 sendMail.sendDSRReport(`${pdfFile1}`,'Daily Sales Report',emails1)
                  console.log(`From Model`)
              }
          ind1++;
        
        }

        }catch(e){
            console.log(`${e}`)
        }
    })
}

let getEPRSfid = async()=>{
    try{
      let qry = `select distinct property__c property_sfid from tlcsalesforce.payment_email_rule__c where
      (hotel_email_status__c = true or tlc_email_status__c = true) and  (property__c is not NULL or property__c !='')`
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
      (hotel_email_status__c = true or tlc_email_status__c = true) and (property__c is  NULL or property__c ='')`
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

let getDSRReport=async(property_sfid)=>{
    try{
        let query=await pool.query(`select account.name,membership__c.membership_number__c,
        --Type_N_R__c,
        case
        when payment__c.payment_for__c='New Membership' then 'N'
        when payment__c.payment_for__c='Renewal' then 'R'
        when payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is null then 'N'
        when payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is not null then 'R'
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
        account.gstin__c,remarks__c,city__c.state_code__c,property__c.name as property_name,payment__c,credit_card__c
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
        (Property__c.sfid='${property_sfid}'
        --or membership__c.customer_set__c IN ('')
        )
        and
        (payment__c.payment_status__c = 'CONSUMED' OR payment__c.payment_status__c = 'SUCCESS')
      
        
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
        let query=await pool.query(`select account.name,membership__c.membership_number__c,
        --Type_N_R__c,
        case
        when payment__c.payment_for__c='New Membership' then 'N'
        when payment__c.payment_for__c='Renewal' then 'R'
        when payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is null then 'N'
        when payment__c.payment_for__c='Add-On' and membership__c.membership_renewal_date__c is not null then 'R'
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
        account.gstin__c,remarks__c,city__c.state_code__c,property__c.name as property_name,payment__c,credit_card__c
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
            --Property__c.sfid=''
        --or 
        membership__c.customer_set__c IN ('${customer_set_sfid}')
        )
        and
        (payment__c.payment_status__c = 'CONSUMED' OR payment__c.payment_status__c = 'SUCCESS')
        
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