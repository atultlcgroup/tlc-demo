const pool = require("../databases/db").pool;
let scheduledDate = process.env.SCHEDULED_DATE_FOR_POS_REPORT || 1;
let getMemnershipNumberForPOSCD= async()=>{
    try{
      let qry =await pool.query(`select distinct membership__r_membership_number__c from tlcsalesforce.pos_cheque_details__c  where TO_DATE(created_time__c,'YYYY-MM-DD') = TO_DATE(TO_CHAR(CURRENT_DATE - interval '1 day','YYYY-MM-DD'),'YYYY-MM-DD') and created_time__c NOT IN('51:49.4')`)
    // let qry =await pool.query(`select distinct membership__r_membership_number__c from tlcsalesforce.pos_cheque_details__c  where TO_DATE(created_time__c,'YYYY-MM-DD') = '2020-12-15' and created_time__c NOT IN('51:49.4')`)
    let data =qry ?  qry.rows : []
    let memberShipArr = []
    data.map(d=>{
        memberShipArr.push(`'${d.membership__r_membership_number__c}'`)
    })
    return memberShipArr
    }catch(e){
        return []
    }
}

let getMembershipDetails = async()=>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log("membership data");
            // identifie
            let daily = true ;
            let dateTime = `${String((new Date()).getDate())}`
            dateTime == scheduledDate ? daily = false : ''
            let resultDay =[]
            let resultMonth = []
            console.log(`------Daily = ${daily}-----------`)
            if(daily){
                console.log(`------Daily = ${daily}-----------`)
                let memberShipArr = await getMemnershipNumberForPOSCD()
                if(memberShipArr.length){
                console.log(`select membership_status__C,expiry_date__c,member__c,membership_number__c,sfid from tlcsalesforce.membership__c where membership_number__c IN (${memberShipArr})`)
                let getMembershipDataForDay=await pool.query(`select membership_status__C,expiry_date__c,member__c,membership_number__c,sfid from tlcsalesforce.membership__c where membership_number__c IN (${memberShipArr})`)
                resultDay= getMembershipDataForDay ? getMembershipDataForDay.rows : [];
               }else{
                resultDay=[]
               }
            }else{
                console.log(`------Daily = ${daily}-----------`)
                let memberShipArr = await getMemnershipNumberForPOSCD()
                if(memberShipArr.length){
                let getMembershipDataForDay=await pool.query(`select membership_status__C,expiry_date__c,member__c,membership_number__c,sfid from tlcsalesforce.membership__c where membership_number__c IN (${memberShipArr})`)
                resultDay= getMembershipDataForDay ? getMembershipDataForDay.rows : [];
               }else{
                resultDay =[] 
               }
               let getMembershipDataForMonth=await pool.query(`select membership_status__C,expiry_date__c,member__c,membership_number__c,sfid from tlcsalesforce.membership__c where membership_number__c is not NULL`)
               resultMonth= getMembershipDataForMonth ? getMembershipDataForMonth.rows : [];
            }
        
            console.log(resultDay.length);
            console.log(resultMonth.length)
           status=await getPOSchequeDetailsData(resultDay, resultMonth,daily);

            resolve (status);
         
        }catch(e){
            console.log(`${e}`);
            return e
        }
    })
}

let getPOSchequeDetailsData=async(membershipDataForDay ,membershipDataForMonth , daily)=>{
    console.log(`-----${daily}----`)
    return new Promise(async(resolve,reject)=>{
        try{
            let membershipStatusForDay;
            console.log("member spent data from POS");
            for(obj of membershipDataForDay){                
                        // let spendData=await pool.query(`select sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '6 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) as last_six_month,
                        // sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN gross_bill_total__C ELSE 0 END) as last_year,
                        // sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '3 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) AS last_three_months,
                        // sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE-1) THEN gross_bill_total__C ELSE 0 END) AS year_till_date,
                        // sum(case when EXTRACT(MONTH FROM bill_date__c) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) THEN gross_bill_total__C ELSE 0 END) AS month_till_date
                        // from tlcsalesforce.pos_cheque_details__c where membership__r_membership_number__c=' ${obj.membership_number__c}'
                        // `)
                        let spendDataForDay=await pool.query(`select 
                        sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE-1) THEN gross_bill_total__C ELSE 0 END) AS year_till_date,
                        sum(case when EXTRACT(MONTH FROM bill_date__c) = EXTRACT(MONTH FROM CURRENT_DATE) and EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) THEN gross_bill_total__C ELSE 0 END) AS month_till_date
                        from tlcsalesforce.pos_cheque_details__c where membership__r_membership_number__c='${obj.membership_number__c}'
                        `)
                        console.log(`Member ${obj.membership_number__c} spend for`);
                    console.log(spendDataForDay.rows[0])
                        membershipStatusForDay=await updateMembershipSpentForDay(obj.membership_number__c,spendDataForDay.rows[0]);
                }
                if(!daily){
                    let membershipStatusForMonth;
                    console.log("member spent data from POS");
                    for(obj1 of membershipDataForMonth){              
                                let spendDataForMonth=await pool.query(`select sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '6 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) as last_six_month,
                                sum(case when EXTRACT(YEAR FROM bill_date__c) = EXTRACT(YEAR FROM CURRENT_DATE) - 1 THEN gross_bill_total__C ELSE 0 END) as last_year,
                                sum(case when bill_date__c >= date_trunc('month',(CURRENT_DATE - INTERVAL '3 months')) and bill_date__c <= date_trunc('month',(CURRENT_DATE - INTERVAL '1 months')) + INTERVAL '1 MONTH - 1 day' THEN gross_bill_total__C ELSE 0 END) AS last_three_months
                                from tlcsalesforce.pos_cheque_details__c where membership__r_membership_number__c='${obj1.membership_number__c}'
                                `)
                                console.log(`Member ${obj1.membership_number__c} spend for`);
                                console.log(spendDataForMonth.rows[0])
                                membershipStatusForMonth=await updateMembershipSpentForMonth(obj1.membership_number__c,spendDataForMonth.rows[0]);
                        }
                
                }

            resolve(`Success`);

        }catch(e){
            console.log(e);
            reject(e);
        }
    })
}


let updateMembershipSpentForDay=async(membership,spendData)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log("update membership_c columns");
            console.log(`update tlcsalesforce.membership__c set  spends_mtd__c=${spendData.month_till_date}, spends_this_year__c=${spendData.year_till_date} where membership_number__c='${membership}'`)
            let updateMembershipData=await pool.query(`update tlcsalesforce.membership__c set  spends_mtd__c=${spendData.month_till_date}, spends_this_year__c=${spendData.year_till_date} where membership_number__c='${membership}'`);
            
            console.log("membership__c update successfully")
            resolve("membership__c updated successfully");
            

        }catch(e){
            console.log(e);
            reject(e);

        }
    })
}

let updateMembershipSpentForMonth=async(membership,spendData)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            console.log("update membership_c columns");
            console.log(`update tlcsalesforce.membership__c set  spends_last_3_months__c=${spendData.last_three_months}, spends_last_6_months__c=${spendData.last_six_month}, spends_last_year__c=${spendData.last_year} where membership_number__c='${membership}'`)
            let updateMembershipData=await pool.query(`update tlcsalesforce.membership__c set  spends_last_3_months__c=${spendData.last_three_months}, spends_last_6_months__c=${spendData.last_six_month}, spends_last_year__c=${spendData.last_year} where membership_number__c='${membership}'`);
            
            console.log("membership__c update successfully")
            resolve("membership__c updated successfully");
            

        }catch(e){
            console.log(e);
            reject(e);

        }
    })
}


module.exports={
    getMembershipDetails
}