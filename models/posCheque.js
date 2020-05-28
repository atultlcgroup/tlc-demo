let pool = require("../db").pool

let getPosCheque=async()=>{
   try{
       console.log(`getPosCheque api called in model`)
    // const client = await pool.connect()       
    const result = await pool.query(`select * from tlcsalesforce.pos_cheque_details__c`);
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