let fs = require('fs');
let pdf = require('html-pdf');
const Promise = require('bluebird');

exports.generatePDF =async()=>{
  try{
    let sheet1HeaderArr=['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','Member GST Details','Email','Address','City','State','Pin code','Country','Payment Mode','(A) Membership Fee','(B) GST Amount','C=(A)+(B)Total Amount']
    let sheet1FooterArr=['Total','','','','','','','','','','','','','','','','0','0','0','0','0']
   let h=`<div><table border="1" width=50% align="center" style="margin-top: 20px;"><tr>`
    for(let i =0;i<sheet1HeaderArr.length;i++){
      if(i == 17){
        h+="<th colspan= '3'>"+`${sheet1HeaderArr[i]}`+"</th>"
      }else{
        h+="<th>"+`${sheet1HeaderArr[i]}`+"</th>"

      }
    }
    h+=`</tr>`
    for(i=0;i<10;i++){
      let k = i+1;
      h+=`<tr>`
      for(j=0;j<sheet1FooterArr.length;j++){
        
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
    <html><head><title>Title of the document</title><style>table,td {padding: 10px;border: 1px solid black;border-collapse: collapse; width: 50%;} th{font-size: 12px;} td{font-size: 12px;}</style></head><body><p style="margin-top: 20px;"><b>Hotel collects the money on Payment Gateway</b></p><p style="margin-top: 20px;"><b>JW Marriott Hotel Pune</b></p><p style="margin-top: 20px;"><b>24 Sep 2020</b></p><p style="margin-top: 20px;"><b>Scheme</b></p>${h}<p style="margin-top: 100px;"><b>Refund / Cancellations</b></p><script></script></body></html>`
    let pdfName = `./paymentReport/Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.pdf`
    const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${html}`, { "height": "10.5in","width": "12.5in", filename: `${pdfName}` })
    return pdfName;
  }catch(e){
    throw e;
  }
}
