

// let  dotenv = require('dotenv');

// dotenv.config();
// const pool = require("./databases/db").pool;

// let insertUpdateLog= async(transactionId,emailStatus,paymentReportType = "",toEmail,fromEmail = "",emailRuleId="")=>{
//     try {
//         console.log("insert log data");
//         console.log('transactionId',transactionId);
//         let selectTransaction = await pool.query(`select transaction_id from tlcsalesforce.payment_report_log where transaction_id = '${transactionId}'`)
//         let data = selectTransaction.rows ? selectTransaction.rows : [];
//         if(data.length){
//            console.log(`from update`)
//            console.log(`UPDATE tlcsalesforce.payment_report_log
//            SET  email_status='${emailStatus}' 
//            WHERE transaction_id='${transactionId}'`)
//             await  pool.query(`UPDATE tlcsalesforce.payment_report_log
//             SET  email_status='${emailStatus}' 
//             WHERE transaction_id='${transactionId}'`)  
//         }else{
//             console.log(`from insert`)
//                     await  pool.query(`INSERT INTO tlcsalesforce.payment_report_log(
//                 transaction_id, email_status, payment_report_type, created_date_time, to_email, from_email, email_rule_id)
//                 VALUES ('${transactionId}', '${emailStatus}', '${paymentReportType}', now(), '${toEmail}','${fromEmail}' ,'${emailRuleId}')`);
//         }
//       return "hi"
//     }
//     catch(e){
//         console.log('________error______________')
//         console.log(e)
//         return e
//     }
//   }
//   insertUpdateLog("qw1234561","SUCCESS","payment report for EOD","shubham.thute@tlcgroup.com", "atul.srivastava@tlcgroup.com","fhcdscb")
//   .then(data=>{
//           console.log('data',data);
      
//   }).catch(e=>{
//       console.log(e);
//   })
let arr = ['a','b','c']
console.log(arr.join(","))