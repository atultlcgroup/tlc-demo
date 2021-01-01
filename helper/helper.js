const sendmail = require('./sendMail')
const pool = require("../databases/db").pool;

let getBrandInfoForreports= async(brandSFID)=>{
    let salData =await pool.query(`select * from tlcsalesforce.reports_dynamic_value where (status = 'true' or status= 'TRUE') and  "Brand Sfid" = '${brandSFID}'`)
    return  salData.rows ?  salData.rows[0] : []
}

module.exports={
    getBrandInfoForreports 
}