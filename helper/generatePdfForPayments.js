let fs = require('fs');
let pdf = require('html-pdf');
const Promise = require('bluebird');
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
    for(i=0;i<resultArr.length;i++){
      let k = i+1;
      let total = 0;
      h+=`<tr>`
        h+=`<td>${k}</td>`;
        h+=`<td>${(resultArr[i].membership__r__membership_number__c ? resultArr[i].membership__r__membership_number__c : '')}</td>`;
        h+=`<td>${(resultArr[i].firstname ? resultArr[i].firstname : '')}</td>`;
        h+=`<td>${(resultArr[i].lastname ? resultArr[i].lastname : '')}</td>`;
        h+=`<td>${(resultArr[i].membership_type_name ? resultArr[i].membership_type_name : '')}</td>`;
        h+=`<td>${(resultArr[i].freshrenewal ? resultArr[i].freshrenewal : '')}</td>`;
        let date1 = resultArr[i].createddate ? resultArr[i].createddate : '';
      let dateTime = ``;
      if(date1){
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')} ${today1.toLocaleString('default', { month: 'short' })} ${today1.getFullYear()} ${strTime}`
      }
        h+=`<td>${dateTime}</td>`;
        h+=`<td>${(resultArr[i].transcationcode__c ? resultArr[i].transcationcode__c : '')}</td>`;
        h+=`<td>${(resultArr[i].gst_details__c ? resultArr[i].gst_details__c : '')}</td>`;
        h+=`<td>${(resultArr[i].email__c ? resultArr[i].email__c : '')}</td>`;
        h+=`<td>${(resultArr[i].billingstree ? resultArr[i].billingstree : '')}</td>`;
        h+=`<td>${(resultArr[i].billingcity ? resultArr[i].billingcity : '')}</td>`;
        h+=`<td>${(resultArr[i].billingstate ? resultArr[i].billingstate : '')}</td>`;
        h+=`<td>${(resultArr[i].billingpostalcode ? resultArr[i].billingpostalcode : '')}</td>`;
        h+=`<td>${(resultArr[i].billingcountry ? resultArr[i].billingcountry : '')}</td>`;
        h+=`<td>${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}</td>`;
        h+=`<td>${(resultArr[i].membership_fee ? resultArr[i].membership_fee : 0)}</td>`;
        total = total + (resultArr[i].membership_fee ? resultArr[i].membership_fee : 0)
        feeTotal += (resultArr[i].membership_fee ? resultArr[i].membership_fee : 0);
        let CGST = resultArr[i].CGST ? resultArr[i].CGST : '--'
        let SGST = resultArr[i].SGST ? resultArr[i].SGST : '--'
        let IGST = resultArr[i].IGST ? resultArr[i].IGST : '--'
        h+=`<td>${CGST}</td>`;
        total+=0
        gstTotal+=resultArr[i].CGST ;
        h+=`<td>${SGST}</td>`;
        total+=0
        gstTotal+=resultArr[i].SGST;
        h+=`<td>${IGST}</td>`;
        total+=0
        gstTotal+=resultArr[i].IGST;
        h+=`<td>${total}</td>`;
      h+=`</tr>`
    }
    h+=`<tr>`
    totalAmount = feeTotal + gstTotal;
    for(let i =0;i<sheet1FooterArr.length;i++){
      console.log()
      if(i == 16)
      h+="<td>"+`${feeTotal}`+"</td>"
      else if(i == 17)
      h+="<td>"+`${gstTotal}`+"</td>"
      else if(i == 20)
      h+="<td>"+`${totalAmount}`+"</td>"
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
    return pdfName;
  }catch(e){
    throw e;
  }
}

module.exports={
  generatePDF
}