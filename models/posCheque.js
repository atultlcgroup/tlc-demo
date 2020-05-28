let pool = require("../db").pool

let getPosCheque=async()=>{
   try{
       console.log(`getPosCheque api called in model`)
    // const client = await pool.connect()       
    const result = await pool.query(`select membership__r_membership_number__c membership_number,bill_number__c bill_number,bill_time__c bill_time,bill_date__c bill_date,pos_code__c  pos_code, pax__c pax,bill_total__c bill_total, bill_tax__c bill_tax,bill_disc__c bill_disc, gross_bill_total__c gross_bill_total, created_by__c created_by, created_time__c created_time, is_inactive__c is_inactive, is_points_issued__c is_points_issued,is_direct_points_issued__c is_direct_points_issued, property__c property, actual_bill_date__c actual_bill_date, tips__c tips, lead_entry_id__c lead_entry_id, tender_media_number__c tender_media_number, paymode__c paymode, covers__c covers, offer_used__c offer_used, outlet__c outlet, tender_mdeia_reference__c tender_mdeia_reference, tender_media_code__c tender_media_code, membership_offer__r__offer_unique_identifier__c offer_unique_identifier, check_data__c check_data, meal_period__c meal_period, service_charge__c service_charge, redemption_code__c redemption_code, net_amount__c net_amount, cashier_number__c cashier_number from tlcsalesforce.pos_cheque_details__c`);
    // pool.end();
    // console.log(result)
    return (result) ? result.rows : null;
   }catch( e ){
       return e
   }
}
module.exports={
    getPosCheque
}