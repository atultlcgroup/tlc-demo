const Promise = require('bluebird');
let getEmptyIfNull = (val) => {
    return val?val:'';
}
let  generateDSRPDF=async(dsrValues,propertyName)=>{
 propertyName = `JW Marriott Mumbai Juhu`;
 let summaryData = [{key:'Spouse Complimentary',amount:0, noOfSale:0 },{key:'Credit Card',amount:0, noOfSale:0 },{key:'Hotel Transfer',amount:0, noOfSale:0 }]
 dsrValues = [
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
{name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},

]
let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
let slNo =1;
let dailySalesReportRows =``;
for(obj of dsrValues){
dailySalesReportRows += `<tr><td>${slNo++}</td>
                    <td>${getEmptyIfNull(obj.name)}</td>
                    <td>${getEmptyIfNull(obj.number)}</td>
                    <td>${getEmptyIfNull(obj.type)}</td>
                    <td>${getEmptyIfNull(obj.expiry)}</td>
                    <td>${getEmptyIfNull(obj.ren)}</td>
                    <td>${getEmptyIfNull(obj.cheqno)}</td>
                    <td>${getEmptyIfNull(obj.cc)}</td>
                    <td>${getEmptyIfNull(obj.recno)}</td>
                    <td>${getEmptyIfNull(obj.paymode)}</td>
                    <td>${getEmptyIfNull(obj.batchno)}</td>
                    <td>${getEmptyIfNull(obj.amount)}</td>
                    <td>${getEmptyIfNull(obj.tax)}</td>
                    <td>${getEmptyIfNull(obj.totalamt)}</td>
                    <td>${getEmptyIfNull(obj.GSTIN)}</td>
                    <td>${getEmptyIfNull(obj.statecode)}</td>
                    <td>${getEmptyIfNull(obj.remarks)}</td>
                    </tr>
                    `
                    if(obj.paymode != 'Complimentary')
                {
                    salesCount++;
                    salesAmount+= obj.amount ? obj.amount : 0 
                    salesTax += obj.tax ? obj.tax : 0
                    salesTotalAmount += (obj.amount ? obj.amount : 0 ) + (obj.tax ? obj.tax : 0);
                }
                if((obj.paymode).indexOf('Complimentary') >= 0)
                {
                    summaryData[0].amount +=  obj.totalamt;
                    summaryData[0].noOfSale += 1;
                }
                if((obj.paymode).indexOf('Credit Card') >= 0){
                    summaryData[1].amount +=  obj.totalamt;
                    summaryData[1].noOfSale += 1;
                }
                if((obj.paymode).indexOf('Hotel Transfer') >= 0){
                    summaryData[2].amount +=  obj.totalamt;
                    summaryData[2].noOfSale += 1;
                }
                    

}

let summaryTotalSale = summaryData[0].noOfSale + summaryData[1].noOfSale + summaryData[2].noOfSale
let summaryTotalAmount = summaryData[0].amount + summaryData[1].amount + summaryData[2].amount

let summaryHtml = ` <tr>
<td>${summaryData[0].key}</td>
<td style="text-align: right;">${summaryData[0].noOfSale}</td>
<td style="text-align: right;">${summaryData[0].amount}</td>
</tr>
<tr>
<td>${summaryData[1].key}</td>
<td style="text-align: right;">${summaryData[1].noOfSale}</td>
<td style="text-align: right;">${summaryData[1].amount}</td>
</tr>
<tr>
<td>${summaryData[2].key}</td>
<td style="text-align: right;">${summaryData[2].noOfSale}</td>
<td style="text-align: right;">${summaryData[2].amount}</td>
</tr>`

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
              font-size: 9px;
              color: #333333;
              width: 40%;
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
            font-size: 9px;
            color: #333333;
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .tftable1 th {
            font-size: 9px;
            background-color: #bfa57d;
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .tftable1 td {
            font-size: 9px;
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
              <td style="font-size: 25px;color: #bfa57d; border-bottom: 2px solid black; width: 85%">DSR</td>
              <td style="text-align: right; color:#438282;" rowspan="2"> ${propertyName}</td>
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
              <td>Daily Sales Reports</td>
              <td style="text-align: right">
                 
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1">
              <tr>
                  <th width="2%">S.N.</th>
                  <th width="15%" >Member Name</th>
                  <th width="3%">Membership Number</th>
                  <th width="3%">Type
                      <br/>(N/R)</th>
                  <th width="2%">Expiry Date</th>
                  <th width="3%">Enrollment/
                      <br/>Renewal
                      <br/>Date</th>
                  <th width="3%">CC/CheqNo.
                      <br/>/Online Trn.No</th>
                  <th width="3%">CC Approval Code</th>
                  <th width="3%">Receipt No.</th>
                  <th width="4%">Payment Mode</th>
                  <th width="3%">Batch Number</th>
                  <th width="5%">Amount</th>
                  <th width="5%">Tax</th>
                  <th width="5%">Total Amount</th>
                  <th width="5%">GSTIN</th>
                  <th width="4%">State Code</th>
                  <th width="7%">Remarks</th>

              </tr>

              
                 ${dailySalesReportRows}
          
              <tr style="{! IF(pageno == lstPages.size,'display:bock;','display: none;')}">
                  <td colspan="11">Total Month Sales : ${salesCount}</td>
                  <td style="text-align:right;">${salesAmount}</td>
                  <td style="text-align:right;">${salesTax}</td>
                  <td style="text-align:right;">${salesTotalAmount}</td>
                  <td> </td>
                  <td></td>
                  <td></td>
              </tr>

          </table>
          <div style="page-break-after: always;">&nbsp; </div>


      <table class="tftable" border="1" style="margin-top:10px; float:left;">
          <caption style="font-size: 13px; margin-top:12px;">Summary</caption>
          <tr>
              <th width="200px">Type</th>
              <th>No. Of Sales</th>
              <th>Amount</th>
          </tr>

              <!--tr>
              <td>{!summary['mode']}</td>
              <td>{!summary['modefor']}</td>
              <td style="text-align: right;">{!summary['recordCount']}</td>
              <td style="text-align: right;">{!summary['amount']}</td>
          </tr-->
            ${summaryHtml}

          <tr>
              <td>Total</td>
              <td style="text-align: right;">${summaryTotalSale}</td>
              <td style="text-align: right;">${summaryTotalAmount}</td>
          </tr>
      </table>

      <div style="float:left; margin-left: 200px; font-size: 11px;">
          <p>Prepared By _ _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Checked and Signed by</p>
          <p>Manager / Asst. Manager Hotel (Acceptance) _ _ _ _ _ _ _ _ _ _ _ _ _</p>
          <p>Hotel Personnel Accepted By</p>
          <p>Name</p>
          <p>Signature</p>
          <p>Date</p>
          <p>Enclosures</p>
          <ol>
              <li>Credit Card Batch Closure (MC / Visa / Diners)</li>
              <li>Batch Closure (Amex / Diners)</li>
              <li>Cash Deposit receipt at the Hotel (copy)</li>
              <li>Cheque deposit at Hotel receipt copy</li>
              <li>Comp card authorization if available, else reason</li>
          </ol>
      </div>
    </div>
  </body>

  </html>
`
let pdfName = `./DSRReport/DSR_Repoprt_${require('dateformat')(new Date(), "yyyymmddhMMss")}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateDSRPDF
}
