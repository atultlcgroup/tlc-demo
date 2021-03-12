const Promise = require('bluebird');

let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

let convertDateFormat= (date1)=>{
    if(date1){
        let today1 = new Date(date1);
        console.log(today1)
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')}/${today1.toLocaleString('default', { month: 'short' })}/${today1.getFullYear()}  ${strTime}`
      }
      return dateTime
}


let getEmptyIfNull = (val) => {
    return val?val:'';
}
let  generateCMNewEnrollPDF=async(cmValues , pName, pId)=>{


    let finalObject  = {}
    cmValues.map(d=>{
                if(d.membership_renewal_date__c)
                d.membership_enrollment_date__c = d.membership_renewal_date__c;
                if(finalObject[d.membership_enrollment_date__c]){
                    finalObject[d.membership_enrollment_date__c].push(d)
                }else{
                    finalObject[d.membership_enrollment_date__c] = [d]
                }
        })
    console.log(finalObject)
    console.log(`=============`)


let headerForPage = ` 
</table>
<table class="page-break tftable1" align="center" border="1" >
<tr height="60px"></tr>
<th width="15%" >Account Name</th>
<th width="3%">Membership Name</th>
<th width="3%">Email ID</th>
<th width="3%">Customer Set 
    <br/>Name</th>
<th width="3%">Member Type</th>
    <th>Expiry</br> Date</th>
    <th width="4%"> Promo code</th>
    <th width="4%">Time</th> 
</tr>
`

let htmlStr=`
 <html>
  <head>
      <meta charset="UTF-8" />
      <title>DSR Table</title>
      <style>
      @media print {
        table.page-break  {
            display:block; page-break-before: always; 
            margin-top: 100px;
        }
    }   
          @page {
              size: A4 landscape;
          }

          
          .tftable {
              font-size: 10px;
              color: #333333;
              width: 35%;
              border: 1px solid black;
              border-collapse: collapse;
          }
          .tftable th {
              font-size: 10px;
              background-color: #bfa57d;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable td {
              font-size: 10px;
              border: 1px solid black;
              padding: 6px;
          }
          .tftable tr:hover {
              background-color: #ffffff;
          }


          .tftable1 {
            font-size: 10px;
            color: #333333;
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .tftable1 th {
            font-size: 10px;
            background-color: #bfa57d;
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .tftable1 td {
            font-size: 10px;
            border: 1px solid black;
            padding: 6px;
        }
        .tftable1 tr:hover {
            background-color: #ffffff;
        }
        div {
            
            margin-top: 60px;
            margin-bottom: 100px;
            margin-right: 20px;
            margin-left: 40px;
            
          }
      </style>
  </head>
  

  <body style="font-family:sans-serif;" >
  <div>
      <table style="width: 100%;">
          <tr>
              <td style="font-size: 20px;color: #438282; border-bottom: 2px solid black; width: 100%">${pName}</td>
          </tr>
          <tr>
              <td style="width: 85%; font-size: 11px; padding-bottom: 10px;">
                  <apex:outputText value="{0, date,EEE dd/MM/yyyy HH:mm a}">
                      <apex:param value="{!Now()}" />
                  </apex:outputText>
              </td>
          </tr>
      </table>
      <table style="width: 100%; font-size: 11px; background-color: #408080; padding: 4px; margin-bottom: 10px; color:white;">
          <tr>
              <td>Daily Feedback Report</td>
              <td style="text-align: right">
              ${today}
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1">
              <tr height="50"><th width="2%">S.N.</th>
              <th width="15%" >Account Name</th>
              <th width="3%">Membership Name</th>
              <th width="3%">Email ID</th>
              <th width="3%">Customer Set 
                  <br/>Name</th>
              <th width="3%">Member Type</th>
                  <th>Expiry</br> Date</th>
                  <th width="4%"> Promo code</th>
                  <th width="4%">Time</th> 
              </tr>

              
                 ${dailySalesReportRows}

          </table>
      
    </div>
  </body>

  </html>
`
let pdfName = `./reports/CMNewEnroll/CM_Enroll_${pId}_${Date.now()}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateCMNewEnrollPDF
}

