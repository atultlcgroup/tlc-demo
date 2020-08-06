const pool = require("../databases/db").pool;
const BREAKFASTTIME = process.env.BREAKFAST_TIME.split(",") || ['04:00','11:00']
const LUNCHTIME = process.env.LUNCH_TIME.split(",") || ['11:00', '17:00']
const DINNERTIME = process.env.DINNER_TIME.split(",") || [ '17:00', '04:00' ]
console.log(BREAKFASTTIME, LUNCHTIME,DINNERTIME)

let findNetSpentAPCTCovers = (outlet_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
          let data = await pool.query(`Select SUM (cast(pos_cheque_details__c.gross_bill_total__c AS DOUBLE PRECISION)) AS totalamount,
          SUM (cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) AS totalcovers,
          SUM( cast(pos_cheque_details__c.gross_bill_total__c AS DOUBLE PRECISION))/SUM (cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) AS apc
          from tlcsalesforce.pos_cheque_details__c where date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
          and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}'`)
        const result = data ? data.rows : [{totalamount: 0,totalcovers:0,apc:0}]
        let dataObj={};
        dataObj['totalamount'] = result[0].totalamount || 0;
        dataObj['totalcovers'] = result[0].totalcovers || 0;
        dataObj['apc'] = result[0].apc || 0;
        console.log(dataObj)


           resolve(dataObj)
         }catch( e ){
            reject(e);
        }

    })
}

let totalCoversInDBL = (outlet_id)=>{
    return new Promise(async(resolve,reject)=>{
    try{
        console.log(`${outlet_id} = = 'a0L0k000002Ubo2EAC'`)

        let coversObject = {}
    //     console.log(`-------------------------------------- QUERY FOR BREAKFAST-----------------`)
    //     console.log(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_breakfaset from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and bill_time__c::time <= '${BREAKFASTTIME[1]}'::time and bill_time__c::time >= '${BREAKFASTTIME[0]}'::time and length(covers__c)>0  and date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    //     and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}'`)
    //     console.log(`-------------------------------------- QUERY FOR LUNCH-----------------`)
    //    console.log(`select  sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_lunch from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and bill_time__c::time > '${LUNCHTIME[0]}'::time and bill_time__c::time <= '${LUNCHTIME[1]}'::time   and length(covers__c)>0 and  date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    //    and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}' `)
    //    console.log(`-------------------------------------- QUERY FOR DINNER-----------------`)

    //    console.log(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_dinner from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and (bill_time__c::time  >'${DINNERTIME[0]}'::time or bill_time__c::time < '${DINNERTIME[1]}'::time)  and length(covers__c)>0 and date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    //    and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}'`) 
       let totalCoverForBreakFast = await pool.query(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_breakfaset from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and bill_time__c::time <= '${BREAKFASTTIME[1]}'::time and bill_time__c::time >= '${BREAKFASTTIME[0]}'::time and length(covers__c)>0  and date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}'`)
    const resultcovers_in_breakfaset = totalCoverForBreakFast ? totalCoverForBreakFast.rows : [{covers_in_breakfaset: 0}]
    let totalCoverForLunch = await pool.query(`select  sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_lunch from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and bill_time__c::time > '${LUNCHTIME[0]}'::time and bill_time__c::time <= '${LUNCHTIME[1]}'::time   and length(covers__c)>0 and  date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}' `)
    const resulttotalCoverForLunch = totalCoverForLunch ? totalCoverForLunch.rows : [{covers_in_lunch: 0}]
    let totalCoverForDinner = await pool.query(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) covers_in_dinner from tlcsalesforce.pos_cheque_details__c where length(bill_time__c)>0 and (bill_time__c::time  >'${DINNERTIME[0]}'::time or bill_time__c::time < '${DINNERTIME[1]}'::time)  and length(covers__c)>0 and date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
    and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}'`)
    const resultCoverForDinner = totalCoverForDinner ? totalCoverForDinner.rows : [{covers_in_lunch: 0}]
    coversObject['covers_in_breakfaset'] =   resultcovers_in_breakfaset[0].covers_in_breakfaset || 0
    coversObject['covers_in_lunch'] =   resulttotalCoverForLunch[0].covers_in_lunch || 0
    coversObject['covers_in_dinner'] =   resultCoverForDinner[0].covers_in_dinner || 0
    console.log(coversObject)
    resolve(coversObject)

    }catch(e){
        reject(`${e}`)
    }
  })
}


let coversDayWise= (outlet_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let coversDayWiseObject = {}
        //    let  coversOfDayInCurrentMonth=await  pool.query(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)) ,to_char(pos_cheque_details__c.bill_date__c, 'Day') AS "Day"
        //    from tlcsalesforce.pos_cheque_details__c where length(covers__c) >0  group by "Day"`)
         
        let  coversOfDayInCurrentMonth=await  pool.query(`select sum(cast(pos_cheque_details__c.covers__c AS DOUBLE PRECISION)),to_char(pos_cheque_details__c.bill_date__c, 'Day') AS "Day"
           from tlcsalesforce.pos_cheque_details__c where length(covers__c) >0 and date_part('year', actual_bill_date__c)= date_part('year',CURRENT_DATE) 
          and date_part('month', actual_bill_date__c) = date_part('month',CURRENT_DATE) AND actual_bill_date__c<=CURRENT_DATE AND outlet__c='${outlet_id}' group by "Day"`)
          const resultcoversOfDayInCurrentMonth = coversOfDayInCurrentMonth ? coversOfDayInCurrentMonth.rows : []
           let resultcoversOfDayInCurrentMonthObject = {}
           for(d1 of resultcoversOfDayInCurrentMonth){
            resultcoversOfDayInCurrentMonthObject[` ${d1.Day}`.trim()] = d1.sum
          }
          coversDayWiseObject['Sunday'] =   resultcoversOfDayInCurrentMonthObject['Sunday'] || 0
          coversDayWiseObject['Monday'] =  resultcoversOfDayInCurrentMonthObject['Monday'] || 0
          coversDayWiseObject['Tuesday'] = resultcoversOfDayInCurrentMonthObject['Tuesday'] || 0
          coversDayWiseObject['Wednesday'] = resultcoversOfDayInCurrentMonthObject['Wednesday']  || 0
          coversDayWiseObject['Thursday'] = resultcoversOfDayInCurrentMonthObject['Thursday'] || 0
          coversDayWiseObject['Friday'] = resultcoversOfDayInCurrentMonthObject['Friday'] || 0
          coversDayWiseObject['Saturday'] = resultcoversOfDayInCurrentMonthObject['Saturday'] || 0
          console.log(coversDayWiseObject)
          resolve(coversDayWiseObject)
        }catch(e){
            reject(`${e}`)
        }
    })
}

let insertSummarizedDataToFandB=async(netSpentAPCTCovers,coversInDBL,coversOfDayInCurrentMonth,outlet_id)=>{
    return new Promise(async(resolve,reject)=>{
        try{
            let checkOutletForMonth = await pool.query(`select id from tlcsalesforce.f_b_summary__c where  date_part('year', createddate)= date_part('year',CURRENT_DATE) 
            and date_part('month', createddate) = date_part('month',CURRENT_DATE) and outlet__c='${outlet_id}'`)
            let data = checkOutletForMonth ? checkOutletForMonth.rows : [];
            if(data.length ==0){
            await pool.query(`INSERT INTO tlcsalesforce.f_b_summary__c(Monthly_Total_Cover__c,
            covers_for_wed__c, net_spends__c, covers_by_time_in_a_day_for_breakfast__c, covers_by_time_in_a_day_for_dinner__c, covers_for_mon__c, covers_for_sun__c, apc_month_wise__c, outlet__c, createddate, covers_for_sat__c, covers_for_tue__c, covers_by_time_in_a_day_for_lunch__c, covers_for_thr__c, covers_for_fri__c)
            VALUES ('${netSpentAPCTCovers['totalcovers']}','${coversOfDayInCurrentMonth['Wednesday']}','${netSpentAPCTCovers['totalamount']}','${coversInDBL['covers_in_breakfaset']}','${coversInDBL['covers_in_dinner']}','${coversOfDayInCurrentMonth['Monday']}','${coversOfDayInCurrentMonth['Sunday']}','${netSpentAPCTCovers['apc']}','${outlet_id}',NOW(),'${coversOfDayInCurrentMonth['Saturday']}','${coversOfDayInCurrentMonth['Tuesday']}','${coversInDBL['covers_in_lunch']}','${coversOfDayInCurrentMonth['Thursday']}','${coversOfDayInCurrentMonth['Friday']}')`);
            console.log(`Data Inserted Successfully in f_b_summary__c !`)
            }else{
            await pool.query(`update tlcsalesforce.f_b_summary__c set  Monthly_Total_Cover__c='${netSpentAPCTCovers['totalcovers']}',
            covers_for_wed__c= '${coversOfDayInCurrentMonth['Wednesday']}', net_spends__c='${netSpentAPCTCovers['totalamount']}', covers_by_time_in_a_day_for_breakfast__c ='${coversInDBL['covers_in_breakfaset']}', covers_by_time_in_a_day_for_dinner__c = '${coversInDBL['covers_in_dinner']}', covers_for_mon__c = '${coversOfDayInCurrentMonth['Monday']}', covers_for_sun__c ='${coversOfDayInCurrentMonth['Sunday']}', apc_month_wise__c = '${netSpentAPCTCovers['apc']}', outlet__c= '${outlet_id}', covers_for_sat__c = '${coversOfDayInCurrentMonth['Saturday']}', covers_for_tue__c = '${coversOfDayInCurrentMonth['Tuesday']}', covers_by_time_in_a_day_for_lunch__c ='${coversInDBL['covers_in_lunch']}', covers_for_thr__c = '${coversOfDayInCurrentMonth['Thursday']}', covers_for_fri__c='${coversOfDayInCurrentMonth['Friday']}' where date_part('year', createddate)= date_part('year',CURRENT_DATE) 
            and date_part('month', createddate) = date_part('month',CURRENT_DATE) and outlet__c='${outlet_id}'`);
            console.log(`Data Updated Successfully in f_b_summary__c !`)
            }
            resolve(`Success`)
        }catch(e){
            reject(`${e}`)
        }
    })

}


let FandBSummaryReport = async () => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log('FandBSummaryReport data api called in controller ');
            let qry = `select distinct o.sfid outlet_id from tlcsalesforce.outlet__c o inner join tlcsalesforce.membershiptype__c  ms on  o.property__c = ms.property__c  inner join  tlcsalesforce.program__c p on ms.program__c = p.sfid where p.unique_identifier__c = 'TLC_MAR_CLMA' `;
            const result =await pool.query(`${qry}`)
            let data = result ? result.rows : [];
            for(d of data){
                    const netSpentAPCTCovers = await findNetSpentAPCTCovers(d.outlet_id)
                    const coversInDBL = await totalCoversInDBL(d.outlet_id)
                    const coversOfDayInCurrentMonth= await coversDayWise(d.outlet_id)
                    await insertSummarizedDataToFandB(netSpentAPCTCovers,coversInDBL,coversOfDayInCurrentMonth,d.outlet_id)
                }
            resolve(data)
        } catch (e) {
            console.log(`${e}`)
            reject(`${e}`)
        }
    })
}

module.exports={
    FandBSummaryReport
}
