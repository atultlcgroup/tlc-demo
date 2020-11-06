let  dotenv = require('dotenv');

dotenv.config();
let fs = require('fs');
let pdf = require('html-pdf');

const Promise = require('bluebird');
const sendmail = require('./sendMail')


let generatePDF =async(resultArr)=>{
  try{
    let sheet1HeaderArr=['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','Member GST Details','Email','Address','City','State','Pin code','Country','Payment Mode','(A) Membership Fee','(B) GST Amount','C=(A)+(B)Total Amount']
    let sheet1FooterArr=['Total','','','','','','','','','','','','','','','','0','0','','','0']
   let h=`<div><table border="1" width=50% align="center" style="margin-top: 20px;"><tr>`
    for(let i =0;i<sheet1HeaderArr.length;i++){
      if(i == 17){
        h+="<th colspan= '3'>"+`${sheet1HeaderArr[i]}`+"</th>"
      }else{
        h+="<th>"+`${sheet1HeaderArr[i]}`+"</th>"
      }
     }
    h+=`</tr>`
    let feeTotal = 0;
    let gstTotal =0;
    let totalAmount = 0;
    for(i=0;i<4;i++){
      let k = i+1;
      let total = 0;
      h+=`<tr>`
        h+=`<td>${k}</td>`;
        h+=`<td>201309</td>`;
        h+=`<td>Atul</td>`;
        h+=`<td>Kumar</td>`;
        h+=`<td>Jw</td>`;
        h+=`<td>Fresh</td>`;
        h+=`<td>08-10-2020 12:45 PM</td>`;
        h+=`<td>2378289932</td>`;
        h+=`<td>DGJHH88BH</td>`;
        h+=`<td>atul.srivastava@tlcgroup.com</td>`;
        h+=`<td>Jasola Apollo</td>`;
        h+=`<td>Delhi</td>`;
        h+=`<td>Delhi</td>`;
        h+=`<td>802301</td>`;
        h+=`<td>India</td>`;
        h+=`<td>Online</td>`;
        h+=`<td>12000</td>`;
        h+=`<td>1000</td>`;
        h+=`<td>1000</td>`;
        h+=`<td>--</td>`;
        h+=`<td>12000</td>`;
      h+=`</tr>`
    }
    h+=`<tr>`
    for(let i =0;i<sheet1FooterArr.length;i++){
      console.log()
      if(i == 16)
      h+="<td>"+`10000`+"</td>"
      else if(i == 17)
      h+="<td>"+`1000`+"</td>"
      else if(i == 20)
      h+="<td>"+`12000`+"</td>"
      else
      h+="<td>"+`${sheet1FooterArr[i]}`+"</td>"
    }
    h+=`</tr>`
    h+=`</table></div>`
    let html=`<!DOCTYPE html>
    <html><head><title>Title of the document</title><style>table,td {padding: 10px;border: 1px solid black;border-collapse: collapse; width: 50%;} th{font-size: 12px;} td{font-size: 12px;}</style></head><body><p style="margin-top: 20px;"><b>Hotel collects the money on Payment Gateway</b></p><p style="margin-top: 20px;"><b>JW Marriott Hotel Pune</b></p><p style="margin-top: 20px;"><b>24 Sep 2020</b></p><p style="margin-top: 20px;"><b>Scheme</b></p>${h}<p style="margin-top: 100px;"><b>Refund / Cancellations</b></p><script></script></body></html>`
    let pdfName = `./paymentReport/Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.pdf`
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${html}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
     console.log(pdfName);
     sendmail.smtpAttachment('atul.srivastava@tlcgroup.com', `Club Marriott <mis@clubmarriott.in>` , 'PDF CHECK',`<html><body>HI</body></html>` , `<html><body>HI</body></html>`,``,`${pdfName}`).then((data)=>{
         console.log(`Mail sent`)
     }).catch(err=>{
         console.log(err)
     })
  }catch(e){
    throw e;
  }
}

module.exports={
    generatePDF  
}
