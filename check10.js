
const Promise = require('bluebird');
let  generateDSRPDF=async()=>{  
let htmlStr=`<apex:page controller="DSRPDFController" showHeader="false" applyBodyTag="false" renderAs="pdf" applyHtmlTag="false" standardStylesheets="False">


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
              width: 100%;
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
      </style>
  </head>

  <body style="font-family:sans-serif;">
      <table style="width: 100%;">
          <tr>
              <td style="font-size: 25px;color: #bfa57d; border-bottom: 2px solid black; width: 100%">DSR</td>
              <td style="text-align: right; color:#438282;" rowspan="2"> {! IF(propertyName =='' ,membershipTypeName,propertyName)}</td>
          </tr>
          <tr>
              <td style="width: 100%; font-size: 11px; padding-bottom: 10px;">
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

                  <apex:outputText value="{0, date, dd MMM yyyy}">
                      <apex:param value="{!startDate}" />
                  </apex:outputText> -
                  <apex:outputText value="{0, date, dd MMM yyyy}">
                      <apex:param value="{!endDate}" />
                  </apex:outputText>
              </td>
          </tr>
      </table>

      <apex:variable var="pageno" value="{!0}" />
      <apex:variable var="srno" value="{!1}" />
      <apex:repeat value="{!lstPages}" var="page">
          <table class="tftable" border="1">
              <tr>
                  <th width="5%">S.N.</th>
                  <th>Member Name</th>
                  <th width="5%">Membership Number</th>
                  <th width="5%">Type
                      <br/>(N/R)</th>
                  <th width="5%">Expiry Date</th>
                  <th width="5%">Enrollment/
                      <br/>Renewal
                      <br/>Date</th>
                  <th width="5%">CC/CheqNo.
                      <br/>/Online Trn.No</th>
                  <th width="5%">CC Approval Code</th>
                  <th width="5%">Receipt No.</th>
                  <th width="5%">Payment Mode</th>
                  <th width="5%">Batch Number</th>
                  <th width="5%">Amount</th>
                  <th width="5%">Tax</th>
                  <th width="5%">Total Amount</th>
                  <th width="5%">GSTIN</th>
                  <th width="5%">State Code</th>
                  <th width="7%">Remarks</th>

              </tr>

              <apex:repeat value="{!page.lstPayment1}" var="p">
                  <tr>
                      <td>{!srno}
                          <apex:variable var="srno" value="{p.srno + 1}" />
                      </td>
                      <td>{!p.Member_Name_Report__c}</td>
                      <td>{!p.Membership_Number_Formula_Field__c}</td>
                      <td>{!p.Type_N_R__c}</td>
                      <td>{!p.Expiry_Date_dd_mm_yyyy__c}</td>
                      <td>
                          <apex:outputText value="{0, date, dd MMM yyyy}">
                              <apex:param value="{!p.Enrollment_Renewal_Date__c}" />
                          </apex:outputText>
                      </td>
                      <td>{!p.CC_CheqNo_Online_Trn_No__c}</td>
                      <td>{!p.Approval_Code__c}</td>
                      <td>{!p.Receipt_No__c}</td>
                      <td>{!p.Payment_Mode_for_Report__c}</td>
                      <td>{!p.Batch_Number__c}</td>
                      <td style="text-align:right;">{!p.Round_Off_Amount_w_o_Tax__c}</td>
                      <td style="text-align:right;">{!p.Round_Off_Tax_Amount__c}</td>
                      <td style="text-align:right;">{!p.Round_Off_Total_Amount__c}</td>
                      <td>
                          {!IF(len(p.Account__r.GSTIN__c) > 7 , (left(p.Account__r.GSTIN__c, 7)+' '+mid(p.Account__r.GSTIN__c, 8, len(p.Account__r.GSTIN__c))),
                          p.Account__r.GSTIN__c)}
                      </td>
                      <td>06</td>
                      <td>{!p.Remarks__c}</td>
                  </tr>
              </apex:repeat>
              <apex:variable var="pageno" value="{!pageno + 1}" />

              <tr style="{! IF(pageno == lstPages.size,'display:bock;','display: none;')}">
                  <td colspan="11">Total Month Sales : {!salesCount}</td>
                  <td style="text-align:right;">{!salesAmount}</td>
                  <td style="text-align:right;">{!salesTax}</td>
                  <td style="text-align:right;">{!salesTotalAmount}</td>
                  <td> </td>
                  <td></td>
                  <td></td>
              </tr>

          </table>
          <div style="page-break-after: always;">&nbsp; </div>
      </apex:repeat>

      <table class="tftable" border="1" style="margin-top:10px; float:left;">
          <caption style="font-size: 13px; margin-top:12px;">Summary</caption>
          <tr>
              <th width="200px">Type</th>
              <th>No. Of Sales</th>
              <th>Amount</th>
          </tr>

          <apex:repeat value="{!SummaryRecordsList}" var="summary">
              <!--tr>
              <td>{!summary['mode']}</td>
              <td>{!summary['modefor']}</td>
              <td style="text-align: right;">{!summary['recordCount']}</td>
              <td style="text-align: right;">{!summary['amount']}</td>
          </tr-->
              <tr>
                  <td>{!summary.type}</td>
                  <td style="text-align: right;">{!summary.recordCount}</td>
                  <td style="text-align: right;">{!summary.amount}</td>
              </tr>
          </apex:repeat>
          <tr>
              <td>Total</td>
              <td style="text-align: right;">{!recordCount}</td>
              <td style="text-align: right;">{!allTotalAmount}</td>
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

  </body>

  </html>
</apex:page>`
let pdfName = `./DSR_Repoprt_${require('dateformat')(new Date(), "yyyymmddhMMss")}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "22.5in", filename: `${pdfName}` })
    return pdfName
}


generateDSRPDF().then(data=>{
    console.log(data)
}).catch(e=>{
    console.log(e);
});




// [{
//     srno:0,
//     Member_Name_Report__c:"Mr. Neeraj Sharma",
//     Membership_Number_Formula_Field__c:104778475,
//     Type_N_R__c:"R",
//     Expiry_Date_dd_mm_yyyy__c:"31 Oct 2021 ",
//     Enrollment_Renewal_Date__c:"",
//     CC_CheqNo_Online_Trn_No__c:4427,
    


    


// },{},{},{},{}]