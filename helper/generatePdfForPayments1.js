let fs = require('fs');
let pdf = require('html-pdf');
const Promise = require('bluebird');
let today = new Date();
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

let generatePDF =async(resultArr,hotelName,summaryName)=>{
  try{
    let membershipName = (resultArr.length && resultArr[0].membership_type_name) ? resultArr[0].membership_type_name : ''
    let schemeCode = (resultArr.length && resultArr[0].scheme_code) ? resultArr[0].scheme_code : ''

    let sheet2HeaderArr=[
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="2%">SL No </td>`,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Membership Number </td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">First Name </td>`,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">Last Name </td>`,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Membership Type</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Fresh/ Renewal</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Transaction Time</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Transcation Code</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Member GST Details</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Email</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="4%">Address</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">City</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="2%">State</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="2%">Pin code</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="2%">Country</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">Payment Mode</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">Membership Fee</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">(A) Membership Amount</td> `,
      `<td colspan ="3" style="background-color: #bfa57d; word-wrap:break-word;"  width="3%">(B) GST Amount</td> `,
      `<td rowspan="2"  colspan="1" border="1" style="background-color:#bfa57d; word-wrap:break-word;" width="3%">C=(A)+(B)Total Amount</td> `]
    let sheet2FooterArr=['Total','','','','','','','','','','','','','','','','0','0','0','','','0']
    let h = `<tr>`;
    let index= 1
    sheet2HeaderArr.map(d=>{
        if(index == 19){
            h+=`${d}`     
       }
        else{
        h+=`${d}`
        }
        index++;

      })
       h+=`</tr>`
      h+=`<tr><th>CGST</th><th>SGST</th><th>IGST</th></tr>`
    
        cell=9;
        let feeTotal=0;
        let gstTotal = 0;
        let totalAmount =0;
        let totalFee =0;
        
      for(let i =0;i<resultArr.length;i++){
          h+=`<tr>`
        cell +=1
        let total=0;
        index = 1;
          h+=`<td>${i+1}</td>`
          h+=`<td>${(resultArr[i].membership__r__membership_number__c ? resultArr[i].membership__r__membership_number__c : '')}</td>`
          h+=`<td>${(resultArr[i].firstname ? resultArr[i].firstname : '')}</td>`
          h+=`<td>${(resultArr[i].lastname ? resultArr[i].lastname : '')}</td>`
          h+=`<td>${(resultArr[i].membership_type_name ? resultArr[i].membership_type_name : '')}</td>`;
          h+=`<td>${(resultArr[i].freshrenewal ? resultArr[i].freshrenewal : '')}</td>`
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
          h+=`<td width="2%">${dateTime}</td>`
          h+=`<td>${(resultArr[i].transcationcode__c ? resultArr[i].transcationcode__c : '')}</td>`;
          h+=`<td>${(resultArr[i].gst_details__c ? resultArr[i].gst_details__c : '')}</td>`;
          h+=`<td>${(resultArr[i].email__c ? resultArr[i].email__c : '')}</td>`;
          h+=`<td>${(resultArr[i].billingstreet ? resultArr[i].billingstreet : '')}</td>`
          h+=`<td>${(resultArr[i].billingcity ? resultArr[i].billingcity : '')}</td>`
          h+=`<td>${(resultArr[i].billingstate ? resultArr[i].billingstate : '')}</td>`
          h+=`<td>${(resultArr[i].billingpostalcode ? resultArr[i].billingpostalcode : '')}</td>`
          h+=`<td>${(resultArr[i].billingcountry ? resultArr[i].billingcountry : '')}</td>`
          h+=`<td>${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}</td>`
          h+=`<td>${(Math.round((resultArr[i].membership_fee ? resultArr[i].membership_fee : 0) * 100) / 100)}</td>`
          h+=`<td>${(Math.round((resultArr[i].membership_amount ? resultArr[i].membership_amount : 0) * 100) / 100)}</td>`
    
         total +=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0);
         totalFee += (resultArr[i].membership_fee ? resultArr[i].membership_fee : 0);
         feeTotal+=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0)
         let CGST = resultArr[i].CGST ? resultArr[i].CGST : '--'
         let SGST = resultArr[i].SGST ? resultArr[i].SGST : '--'
         let IGST = resultArr[i].IGST ? resultArr[i].IGST : '--'
         
         resultArr[i].CGST ? h+=`<td>${(Math.round(CGST * 100) / 100)}</td>` : h+=`<td>--</td>`
          total+=resultArr[i].CGST
          gstTotal+=resultArr[i].CGST
          resultArr[i].SGST ? h+=`<td>${(Math.round(SGST * 100) / 100)}</td>`: h+=`<td>--</td>`
          total+=resultArr[i].SGST
          gstTotal+=resultArr[i].SGST
          resultArr[i].IGST ? h+=`<td>${(Math.round(IGST * 100) / 100)}</td>` :h+=`<td>--</td>`
          total+=resultArr[i].IGST
          gstTotal+=resultArr[i].IGST
          h+=`<td>${(Math.round((resultArr[i].membership_total_amount ? resultArr[i].membership_total_amount : 0) * 100) / 100)}</td>`
          totalAmount +=(resultArr[i].membership_total_amount ? resultArr[i].membership_total_amount : 0)
        h+=`</tr>`
        }
    
    
    
      cell++;
      index = 1;
      // totalAmount = feeTotal + gstTotal;
      console.log(`---------------------${totalFee}------${feeTotal}--${gstTotal}----${totalAmount}---------`)
      h+=`<tr>`
      sheet2FooterArr.map(f=>{
        if(index == 17)
        h+=`<td>${(Math.round(totalFee * 100) / 100)}</td>`;
          else if(index == 18)
        h+=`<td>${(Math.round(feeTotal * 100) / 100)}</td>`;
        else if(index == 19)
        h+=`<td>${(Math.round(gstTotal * 100) / 100)}</td>`;
        else if(index == 22)
        h+=`<td>${(Math.round(totalAmount * 100) / 100)}</td>`;
        else
        h+=`<td>${f}</td>`;
        index++
      })
      h+=`</tr>`
    cell++;    
    cell+=4;
    index = 1;

    let html=`<html>
    <head>
        <meta charset="UTF-8" />
        <title>DSR Table</title>
        <style>
            @page {
                size: A4 landscape;
            }
  
            
            .tftable {
                font-size: 9px;
                color: #333333;
                width: 35%;
                border: 1px solid black;
                border-collapse: collapse;
            }
            .tftable th {
                font-size: 9px;
                background-color: #bfa57d;
                border: 1px solid black;
                padding: 6px;
                text-align: center;
            }
            .tftable td {
                font-size: 9px;
                border: 1px solid black;
                padding: 6px;
            }
            .tftable tr:hover {
                background-color: #ffffff;
            }
  
  
            .tftable1 {
              font-size: 8px;
              color: #333333;
              width: 100%;
              border: 1px solid black;
              border-collapse: collapse;
          }
          .tftable1 th {
              font-size: 8px;
              background-color: #bfa57d;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable1 td {
              font-size: 8px;
              border: 1px solid black;
              padding: 6px;
          }
          .tftable1 tr:hover {
              background-color: #ffffff;
          }
          div {
              
              margin-top: 10px;
              margin-bottom: 10px;
              margin-right: 20px;
              margin-left: 40px;
              
            }
        </style>
    </head>
    <div>
    <table style="width: 100%; font-size: 11px; background-color: #408080; padding: 1px; color:white;">
    <tr>
        <td>Daily Summary</td>
        <td style="text-align: right">
           
        </td>
    </tr>
</table>
</div>
    <div style="float:left;  font-size: 13px; margin-top:0" >
            <span><p >Level Name:</span><span>       ${membershipName}</p></span>
            </span><p >Scheme: </span><span>          ${schemeCode}</p></span>
            </span><p >Transaction Date:</span><span> ${today}</p></span>


            
                  </div>
    <div>
    <body style="font-family:sans-serif;" >  
       
            <table class="tftable1" align="center" border="1">
               ${h}
            </table>
           
        
      </div>
      <div style="float:left;  font-size: 13px;">
            <p >Refund / Cancellations</p>
        </div>
    </body>
  
    </html>`
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