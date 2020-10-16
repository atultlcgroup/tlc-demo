const pool = require("../databases/db").pool;
const dotenv = require('dotenv');
dotenv.config();

console.log(pool);

let insertUpdateLog= async(transactionId,emailStatus,paymentReportType,toEmail,fromEmail,emailRuleId)=>{
  try {
      console.log("insert log data");
      console.log('transactionId',transactionId);
    if(transactionId == null || transactionId==''){

       await  pool.query(`INSERT INTO tlcsalesforce.payment_report_log(
            transaction_id, email_status, payment_report_type, created_date_time, to_email, from_email, email_rule_id)
            VALUES ('${transactionId}', '${emailStatus}', '${paymentReportType}', now(), '${toEmail}','${fromEmail}' ,'${emailRuleId}')`);
    
        } 
    else{
      await  pool.query(`UPDATE tlcsalesforce.payment_report_log
        SET  email_status='${emailStatus}', payment_report_type='${paymentReportType}', created_date_time= now(), to_email='${toEmail}', from_email='${fromEmail}', email_rule_id='${emailRuleId}'
        WHERE transaction_id=${transactionId}`)
        
    }
    return "hi"
  }
  catch(e){
      console.log('________error______________')
      console.log(e)
      return e
  }

}
insertUpdateLog("qw123456","success","payment report for EOD","shubham.thute@tlcgroup.com", "atul.srivastava@tlcgroup.com","fhcdscb")
.then(data=>{
        console.log('data',data);
    
}).catch(e=>{
    console.log(e);
})


// insertUpdateLog("bhcbjcbs","success","payment report for EOD","shubham.thute@tlcgroup.com", "atul.srivastava@tlcgroup.com","fhcdscb");