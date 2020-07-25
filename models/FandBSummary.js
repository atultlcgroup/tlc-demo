const pool = require("../databases/db").pool;


let FandBSummaryReport = async () => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log('FandBSummaryReport data api called in controller ');
            let qry = `select distinct o.sfid outlet_id from tlcsalesforce.outlet__c o inner join tlcsalesforce.membershiptype__c  ms on  o.property__c = ms.property__c  inner join  tlcsalesforce.program__c p on ms.program__c = p.sfid where p.unique_identifier__c = 'TLC_MAR_CLMA'`;
            const result =await pool.query(`${qry}`)
            let data = result ? result.rows : null;
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
