let pool = require("../databases/db").pool
const DBURL = require('../config').ENV_OBJ

let feedbackUrl= DBURL.FEEDBACK_URL;

let getFeedbackUrl=async(reservationId)=>{
    return new Promise(async(resolve, reject)=>{
        try{
            const result = await pool.query(`select outlet__c,membership__r__membership_number__c  from tlcsalesforce.reservation__c where reservation_id__c = '${reservationId}'`);
            (result && result.rows.length) ? resolve(`${feedbackUrl}&id=${result.rows[0].outlet__c}&member=${result.rows[0].membership__r__membership_number__c}&reservationID=${reservationId}`) : reject(`Reservation not found!`);

        }catch( e ){
            reject(`${e}`);
        }
    })
}


module.exports={
    getFeedbackUrl
}