const Promise = require('bluebird');

let today = new Date();
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
let  generateFRPDF=async(frValues , pName, pId)=>{
    console.log(frValues)
    console.log(`=============`)
    let pyamnetObj={}
    let summaryTotalSale =0
    let summaryTotalAmount=0
 //propertyName = `${frValues[0].property_name}`;
 let summaryData = [{key:'Spouse Complimentary',amount:0, noOfSale:0 },{key:'Credit Card',amount:0, noOfSale:0 },{key:'Hotel Transfer',amount:0, noOfSale:0 },{key:'Cash',amount:0, noOfSale:0 },{key:'Online',amount:0, noOfSale:0 }]
console.log("FR values are");

//   frValues = [
// {Case:"00001212",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"Bella Cucina", rating__c:"5", createddate:"31/10/2021"},
// {Case:"00001211",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"K3", rating__c:"3", createddate:"31/10/2021"},
// {Case:"00001212",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"K3", rating__c:"3", createddate:"31/10/2021"},
// {Case:"00001213",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"K3", rating__c:"3", createddate:"31/10/2021"},
// {Case:"00001214",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"K3", rating__c:"3", createddate:"31/10/2021"},
// {Case:"00001215",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"K3", rating__c:"3", createddate:"31/10/2021"},
// {Case:"00001216",Feedbacknumber:"Record # 00090",ID:"a0AN00000AxxJK",AccountOwner:"Shubham Thute", outlet:"Bella Cucina", rating__c:"4", createddate:"31/10/2021"},

// ]
// console.log("frValues",frValues)
let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
let slNo =1;
let dailySalesReportRows =``;
for(obj of frValues){
dailySalesReportRows += `<tr align="center"><td>${slNo++}</td>
                    <td align="center">${getEmptyIfNull(obj.casenumber)}</td>
                    <td align="center">${getEmptyIfNull(obj.feedbacknumber)}</td>
                    <td align="center">${getEmptyIfNull(obj.id)}</td>
                    <td align="center">${getEmptyIfNull(obj.accountowner)}</td>
                    <td align="center">${getEmptyIfNull(obj.outlet)}</td>
                    <td align="center">${getEmptyIfNull(obj.rating__c)}</td>
                    <td align="center">${(getEmptyIfNull(obj.createddate) ? convertDateFormat(new Date(obj.createddate)) : '')}</td>
                    </tr>
                    `
                // if((obj.payment_mode__c).indexOf('Complimentary') >= 0)
                // {
                //     summaryData[0].amount +=  obj.total_amount__c;
                //     summaryData[0].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Credit Card') >= 0){
                //     summaryData[1].amount +=  obj.total_amount__c;
                //     summaryData[1].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Hotel Transfer') >= 0){
                //     summaryData[2].amount +=  obj.total_amount__c;
                //     summaryData[2].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Cash') >= 0){
                //     summaryData[3].amount +=  obj.total_amount__c;
                //     summaryData[3].noOfSale += 1;
                // }
                // if((obj.payment_mode__c).indexOf('Online') >= 0){
                //     summaryData[4].amount +=  obj.total_amount__c;
                //     summaryData[4].noOfSale += 1;
                // }
                    

}

// let summaryTotalSale = summaryData[0].noOfSale + summaryData[1].noOfSale + summaryData[2].noOfSale + summaryData[3].noOfSale + summaryData[4].noOfSale
// let summaryTotalAmount = summaryData[0].amount + summaryData[1].amount + summaryData[2].amount + summaryData[3].amount + summaryData[4].amount



// <td>${summaryData[0].key}</td>
// <td style="text-align: right;">${summaryData[0].noOfSale}</td>
// <td style="text-align: right;">${summaryData[0].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[1].key}</td>
// <td style="text-align: right;">${summaryData[1].noOfSale}</td>
// <td style="text-align: right;">${summaryData[1].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[2].key}</td>
// <td style="text-align: right;">${summaryData[2].noOfSale}</td>
// <td style="text-align: right;">${summaryData[2].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[3].key}</td>
// <td style="text-align: right;">${summaryData[3].noOfSale}</td>
// <td style="text-align: right;">${summaryData[3].amount}</td>
// </tr>
// <tr>
// <td>${summaryData[4].key}</td>
// <td style="text-align: right;">${summaryData[4].noOfSale}</td>
// <td style="text-align: right;">${summaryData[4].amount}</td>



let htmlStr=`
 <html>
  <head>
      <meta charset="UTF-8" />
      <title>DSR Table</title>
      <style>
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
              <td>Daily Feedback Reports</td>
              <td style="text-align: right">
              ${today}
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1">
              <tr><th width="2%">S.N.</th>
                  <th width="3%">Case</th>
                  <th width="7%" >Member Feedback: Feedback #</th>
                  <th width="5%">Member Feedback : ID"</th>
                  <th width="5%">Account Owner     </th>
                  <th width="5%">Outlet</th>
                  <th width="3%">Rating</th>
                  <th width="5%">Member Feedback : Created Date</th>

              </tr>

              
                 ${dailySalesReportRows}

          </table>
      
    </div>
  </body>

  </html>
`
let pdfName = `./reports/FReport/FR_Repoprt_${pId}_${Date.now()}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateFRPDF
}

