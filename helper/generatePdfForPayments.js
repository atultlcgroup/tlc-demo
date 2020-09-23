let fs = require('fs');
let pdf = require('html-pdf');
const Promise = require('bluebird');

exports.generatePDF =async()=>{
  try{
    let sheet1HeaderArr= ['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','State','Payment Mode','(A) Net_Amount__c','(B) GST Amount','C=(A)+(B)Total Amount']
    let sheet1FooterArr= ['Total','','','','','','','','','','0','0','0']
    let h=`<div><table border="1" width=50% align="center" style="margin-top: 20px;"><tr>`
    for(let i =0;i<sheet1HeaderArr.length;i++){
      console.log()
      h+="<th>"+`${sheet1HeaderArr[i]}`+"</th>"
    }
    h+=`</tr>`
    for(i=0;i<10;i++){
      let k = i+1;
      h+=`<tr>`
      for(j=0;j<sheet1HeaderArr.length;j++){
        
        if(j==0)
        h+=`<td>${k}</td>`;
        else
        h+=`<td></td>`;
      }
      h+=`</tr>`
    }
    h+=`<tr>`
    for(let i =0;i<sheet1FooterArr.length;i++){
      console.log()
      h+="<td>"+`${sheet1FooterArr[i]}`+"</td>"
    }
    h+=`</tr>`
    h+=`</table></div>`
    let html=`<!DOCTYPE html>
    <html><head><title>Title of the document</title><style>table,td {padding: 10px;border: 1px solid black;border-collapse: collapse; width: 50%;} th{font-size: 12px;}</style></head><body><p style="margin-top: 20px;"><b>TLC collects the money on Payment Gateway on behalf of Hotels</b></p><p style="margin-top: 20px;"><b>Scheme</b></p><p style="margin-top: 20px;"><b>Club Marriott</b></p>${h}<p style="margin-top: 100px;"><b>Refund / Cancellations</b></p><script></script></body></html>`
    let pdfName = `./paymentReport/Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.pdf`
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${html}`, { format: 'A4', filename: `${pdfName}` })
    return pdfName;
  }catch(e){
    throw e;
  }
}
