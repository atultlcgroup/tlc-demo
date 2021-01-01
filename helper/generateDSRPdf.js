const Promise = require('bluebird');
let publicDir = require('path').join(__dirname,'/helper'); 


let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;

let convertDateFormat= (date1)=>{
    if(date1){
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')} ${today1.toLocaleString('default', { month: 'short' })} ${today1.getFullYear()}`
      }
      return dateTime
}


let getEmptyIfNull = (val) => {
    return val?val:'';
}
let  generateDSRPDF=async(dsrValues,propertyId)=>{
    let pyamnetObj={}
    let summaryTotalSale =0
    let summaryTotalAmount=0
 propertyName = `${dsrValues[0].property_name}`;
 let summaryData = [{key:'Spouse Complimentary',amount:0, noOfSale:0 },{key:'Credit Card',amount:0, noOfSale:0 },{key:'Hotel Transfer',amount:0, noOfSale:0 },{key:'Cash',amount:0, noOfSale:0 },{key:'Online',amount:0, noOfSale:0 }]
console.log("DSR values are");
 //  dsrValues = [
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Complimentary",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Credit Card(Master)",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},
// {name:"Mr. Neeraj Sharma",amount:12000,tax:2160,totalamt:14160, number:"104778475", type:"R", expiry:"31/10/2021", ren:"14 Oct 2020", cheqno:4427, cc:863577, recno:3784, paymode: "Hotel Transfer",batchno:"000040",GSTIN:'GST12345', statecode:"06", remarks:"10092371"},

// ]
let headerForPage = ` 


</table>
<table class="page-break tftable1" align="center" border="1" >
<tr height="60px"></tr>
<tr style="margin-top:10px; height="50"">
<th width="2%">S.N.</th>
<th width="15%" >Member Name</th>
<th width="3%">Membership Number</th>
<th width="3%">Level</th>
<th width="3%">Type
    <br/>(N/R)</th>
<th width="3%">Enrollment/
    <br/>Renewal
    <br/>Date</th>
    <th>Expiry</br> Date</th>
<th width="3%">CC/CheqNo.
    <br/>/Online Trn.No</th>
<th width="3%">CC Approval Code</th>
<th width="3%">Receipt No.</th>
<th width="4%">Payment Mode</th>
<th width="3%">Batch Number</th>
<th width="4%">Cheque Details</th>
<th width="5%">Amount</th>
<th width="4%">Tax</th>
<th width="3%">Total Amount</th>
<th width="5%">GSTIN</th>
<th width="4%">State Code</th>
<th width="7%">Remarks</th>
</tr>
`
let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
let slNo =1;
let dailySalesReportRows =``;
let indexForPage=0 ;
for(obj of dsrValues){
dailySalesReportRows += `<tr align="center" height="50"><td>${slNo++}</td>
                    <td >${getEmptyIfNull(obj.name)}</td>
                    <td >${getEmptyIfNull(obj.membership_number__c)}</td>
                    <td >${getEmptyIfNull(obj.customer_set_program_level__c)}</td>
                    <td>${getEmptyIfNull(obj.type_n_r__c)}</td>
                    <td>${(obj.membership_enrollment_date__c ? convertDateFormat((obj.membership_renewal_date__c ? obj.membership_renewal_date__c: obj.membership_enrollment_date__c)) : '')}</td>
                    <td>${(obj.expiry_date__c ? convertDateFormat(obj.expiry_date__c) : '')}</td>
                    <td>${getEmptyIfNull(obj.cc_cheqno_online_trn_no__c)}</td>
                    <td>${getEmptyIfNull(obj.authorization_number__c)}</td>
                    <td>${getEmptyIfNull(obj.receipt_no__c)}</td>
                    <td>${getEmptyIfNull((obj.payment_mode__c=='Credit Card' ? `${obj.payment_mode__c} ${(obj.credit_card__c?obj.credit_card__c : '')}`: `${obj.payment_mode__c}`))}</td>
                    <td>${getEmptyIfNull(obj.batch_number__c)}</td>
                    <td>${getEmptyIfNull(obj.receipt_no__c)}</td>
                    <td>${(obj.amount__c ? (Math.floor(obj.amount__c * 100) / 100):0)}</td>
                    <td>${(obj.total_amount__c-obj.amount__c) ? (Math.floor((obj.total_amount__c-obj.amount__c) * 100) / 100): 0}</td>
                    <td>${(obj.total_amount__c ? (Math.floor(obj.total_amount__c * 100) / 100):0)}</td>
                    <td>${getEmptyIfNull(obj.gstin__c)}</td>
                    <td>${getEmptyIfNull(obj.state_code__c)}</td>
                    <td>${getEmptyIfNull(obj.remarks__c)}</td>
                    </tr>
                    `
                    if(obj.payment_mode__c != 'Complimentary')
                {
                    salesCount++;
                    salesAmount+= obj.amount__c ? obj.amount__c : 0 
                    salesTax += (obj.total_amount__c- obj.amount__c) ? (obj.total_amount__c- obj.amount__c) : 0
                    //salesTax += obj.tax ? obj.tax : 0
                    salesTotalAmount += obj.total_amount__c
                   // salesTotalAmount += (obj.amount__c ? obj.amount__c : 0 ) + (obj.tax ? obj.tax : 0);
                }
                summaryTotalSale+=1
                summaryTotalAmount += obj.total_amount__c
                    if(pyamnetObj[obj.payment_mode__c]){
                   
                       pyamnetObj[obj.payment_mode__c]={amount:obj.total_amount__c+pyamnetObj[obj.payment_mode__c].amount,noOfSale:pyamnetObj[obj.payment_mode__c].noOfSale+1}
                    }else{
                       pyamnetObj[obj.payment_mode__c]= {amount:obj.total_amount__c,noOfSale:1}
                    }
                   console.log(pyamnetObj)
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
                    



                indexForPage++;
                if(indexForPage %10 == 0 && indexForPage != 0 && dsrValues[indexForPage]){
                    dailySalesReportRows+=`${headerForPage}`
                }


            }

// let summaryTotalSale = summaryData[0].noOfSale + summaryData[1].noOfSale + summaryData[2].noOfSale + summaryData[3].noOfSale + summaryData[4].noOfSale
// let summaryTotalAmount = summaryData[0].amount + summaryData[1].amount + summaryData[2].amount + summaryData[3].amount + summaryData[4].amount

let summaryHtml = ``
let serialNumber=1;
for(let [key,value] of Object.entries(pyamnetObj)){
    summaryHtml += ` <tr height="50" align="center">`
    summaryHtml +=`<td> ${serialNumber++}</td>`
    summaryHtml +=`<td >${key}</td>`
    summaryHtml +=`<td >${value.noOfSale}</td>`
    summaryHtml +=`<td >${(value.amount ? (Math.floor(value.amount * 100) / 100):0)}</td>`
    summaryHtml+=`</tr>`
}

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
              font-size: 7px;
              color: #333333;
              width: 35%;
              border: 1px solid black;
              border-collapse: collapse;
          }
          .tftable th {
              font-size: 7px;
              background-color: #bfa57d;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable td {
              font-size: 7px;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }
          .tftable tr:hover {
              background-color: #ffffff;
          }

          .border-none {
               height:30px!important;
               border:1px solid white!important;
           }
          .border-none  td{
            font-size:12px!important;   
            height:30px!important;   
            border:1px solid white!important;
           }
        .border-none th{
            font-size: 12px!important;
            color:white!important;
            height:30px!important;
            background-color: #4472C4!important;
            border:1px solid white!important;
        }
        .border-none tr{
            font-size: 12px!important;
            height:30px!important;
            border:1px solid white!important;
        }
       
       


          .tftable1 {
            font-size: 7px;
            color: #333333;
            width: 100%;
            border: 1px solid black;
            border-collapse: collapse;
        }
        .tftable1 th {
            font-size: 7px;
            background-color: #bfa57d;
            border: 1px solid black;
            padding: 6px;
            text-align: center;
        }
        .tftable1 td {
            font-size: 7px;
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

          .header {
            position: fixed;
            top: 0;
          }
          .footer {
            position: fixed;
            bottom: 0;
          }
          .center {
            margin-left: auto;
            margin-right: auto;
          }
        
        .tftable tr:nth-child(even) {background-color: #C7CAF7;}
        .tftable tr:nth-child(odd) {background-color: #F2F2F2;}

        .arilFont {
            font-family: Arial, Helvetica, sans-serif;
          }
      </style>
  </head>

  
  
  
  <body style="font-family:sans-serif;" >
  
  <div>
  <table style="width: 100%;">
        <tbody>
            <tr>
                <td align="left" style="font-size: 25px;color: #808000;  width: 30%"><img src="file:///D:/referralDemo/tlc-demo/helper/logo-tlc.png" alt=""  height=70 width=160></img></td>
                <td align="center" style="font-size: 25px;color: #808000;  width: 30%">Daily Sales report</td>
                <td align="right"style="font-size: 23px;color: #438282; width: 30%"></td>
            </tr>
        </tbody>
    </table>
    <table style="width: 100%;">
        
        <tr style="width: 100%">
            <td > 
                <span style="font-size:30px;">DSR</span>
                <br><hr color="black" style="margin: 0; width:100%"/>
                <span style="font-size: 10px;"> ${today}</span>
            </td>
            <td  align="right" style="font-size: 23px;color: #438282; width:30%"> ${propertyName}</td>

        </tr>
    </table>
  
      <table style="width: 100%; font-size: 11px; background-color: #408080; padding: 4px; margin-bottom: 10px; color:white;">
          <tr>
              
              <td style="text-align: right">
              ${today}
              </td>
          </tr>
      </table>

     
          <table class="tftable1" align="center" border="1" >
              <tr height="50">
                  <th width="2%">S.N.</th>
                  <th width="15%" >Member Name</th>
                  <th width="3%">Membership Number</th>
                  <th width="2%"> Level </th>
                  <th width="3%">Type
                      <br/>(N/R)</th>
                  <th width="3%">Enrollment/
                      <br/>Renewal
                      <br/>Date</th>
                      <th>Expiry</br> Date</th>

                  <th width="3%">CC/ChequeNo.
                      <br/>/Online Trn.No</th>
                  <th width="3%">CC Approval Code</th>
                  <th width="3%">Receipt No.</th>
                  <th width="4%">Payment Mode</th>
                  <th width="3%">Batch Number</th>
                  <th width="4%">Cheque Details</th>
                  <th width="5%">Amount</th>
                  <th width="4%">Tax</th>
                  <th width="3%">Total Amount</th>
                  <th width="5%">GSTIN</th>
                  <th width="4%">State Code</th>
                  <th width="7%">Remarks</th>

              </tr>

              
                 ${dailySalesReportRows}
          
              <tr style="{! IF(pageno == lstPages.size,'display:bock;','display: none;')} " height="50">
                  <td colspan="12">Total Month Sales : ${salesCount}</td>
                  <td  align="center">${(salesAmount ? (Math.floor(salesAmount * 100) / 100): 0)}</td>
                  <td  align="center">${(salesTax ? (Math.floor(salesTax * 100) / 100): 0)}</td>
                  <td  align="center">${(salesTotalAmount ? (Math.floor(salesTotalAmount * 100) / 100): 0)}</td>
                  <td> </td>
                  <td></td>
                  <td></td>
              </tr>

          </table>
          
          <div style="page-break-after: always;">&nbsp; </div>

      <table class="tftable border-none" style="margin-top:50px; ">
      <caption align="left" style="font-size: 16px; margin-top:12px; background-color: #c3c1cf; text-align:left;" ><b>Summary By Payment Mode</b></caption>
          <tr width="200px">
              <th>S. No. </th>
              <th  height="50">Type</th>
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

          <tr height="50"  align="center">
             
              <td colspan="2">Total</td>
              <td >${summaryTotalSale}</td>
              <td >${(summaryTotalAmount ? (Math.floor(summaryTotalAmount * 100) / 100):0)}</td>
          </tr>
      </table>

      
     

    
  

      <table class="tftable   border-none"  style="margin-top:50px;">
      <caption  style="font-size: 16px; margin-top:12px; background-color: #c3c1cf; text-align:left;" ><b>Break-up of sales </b></caption>
      <tr width="200px" >
          <th>S. No.</th>
          <th  height="50">Type</th>
          <th>No. Of Sales</th>
          <th>Amount</th>
      </tr>
    
          <!--tr>
          <td>{!summary['mode']}</td>
          <td>{!summary['modefor']}</td>
          <td style="text-align: right;">{!summary['recordCount']}</td>
          <td style="text-align: right;">{!summary['amount']}</td>
      </tr-->
      <tr>
          <td>1</td>
          <td>New(N)</td>
          <td>4</td>
          <td>10000</td>
      </tr>
      <tr>
          <td>2</td>
          <td>Renewal(R)(N)</td>
          <td>5</td>
          <td>9000</td>
         
      </tr>
      <tr>
          <td>3</td>
          <td>Cancellation (C)</td>
          <td>6</td>
          <td>12000</td>
      </tr>
       <!-- ${summaryHtml} -->
    
      <tr height="50"  align="center">
          <td colspan="2">Total (N+R-C)</td>
          <td >${summaryTotalSale}</td>
          <td >${(summaryTotalAmount ? (Math.floor(summaryTotalAmount * 100) / 100):0)}</td>
      </tr>
    </table>
    
    
    <div style="page-break-after: always;">&nbsp; </div>
  
      <table class="tftable border-none"  style="margin-top:50px; ">
      <caption align="left" style="font-size: 16px; margin-top:12px; background-color: #c3c1cf; text-align:left;" ><b>Summary By Level</b></caption>
      <tr width="200px" >
          <th>S. No.</th>
          <th  height="50">Type</th>
          <th>No. Of Sales</th>
          <th>Amount</th>
      </tr>

          <!--tr>
          <td>{!summary['mode']}</td>
          <td>{!summary['modefor']}</td>
          <td style="text-align: right;">{!summary['recordCount']}</td>
          <td style="text-align: right;">{!summary['amount']}</td>
      </tr-->
      <tr>
         <td>1</td>   
          <td>Level 1</td>
          <td>5</td>
          <td>5000</td>
      </tr>
      <tr>
          <td>2</td>
          <td>Level 2</td>
          <td>7</td>
          <td>15000</td>
      </tr>
      <tr>
          <td>3</td>
          <td>Level 3</td>
          <td>3</td>
          <td>3000</td>
      </tr>
      <tr>
          <td>4</td>
          <td>Level 4</td>
          <td>2</td>
          <td>4000</td>
      </tr>
      <tr>
      <td colspan="2">Sub Total of Paid sales</td>
      <td>3</td>
      <td>5000</td>
      </tr>
      <tr>
      <td>5</td>
      <td>Spouse Complimentry</td>
      <td>2</td>
      <td>4000</td>
      </tr>
      <tr>
      <td>6</td>
      <td>Other Complimentry (includes MGM)</td>
      <td>2</td>
      <td>4000</td>
      </tr>
      <tr>
      <td>7</td>
      <td>Reissue (INR 500)</td>
      <td>2</td>
      <td>4000</td>
      </tr>
      <td>8</td>
      <td>Wedding Bunding</td>
      <td>2</td>
      <td>4000</td>
      </tr>
      
        <!-- ${summaryHtml} -->

      <tr height="50"  align="center">
          <td colspan="2">Total</td>
          <td >${summaryTotalSale}</td>
          <td >${(summaryTotalAmount ? (Math.floor(summaryTotalAmount * 100) / 100):0)}</td>
      </tr>
  </table>


  <table class="tftable border-none" style="margin-top:50px; width: 45%">
  <caption align="left" style="font-size: 16px; margin-top:12px; background-color: #c3c1cf; text-align:left;" ><b>Annexure – 1 		Certificate Numbers Issued for Audit purpose</b></caption>
  <tr width="200px">
      <th>S. No.</th>
      <th>Date</th>
      <th>Member Name</th>
      <th  height="50">Membership Number</th>
      <th>Level</th>
      <th>Certificate Number issued</th>
  </tr>

      <tr>
      <td>1</td>
      <td>15/12/2020</td>
      <td>Shubham Thute</td>
      <td> 113677894</td>
      <td> Level 3</td>
      <td>21123rybc3oksdjd</td>
  </tr>
  <tr>
      <td>1</td>
      <td>15/12/2020</td>
      <td>Shubham Thute</td>
      <td> 113677894</td>
      <td> Level 3</td>
      <td>21123rybc3oksdjd</td>
  </tr>
    <!-- ${summaryHtml}  -->

</table>

<br> 


<div style="page-break-after: always;">&nbsp; </div>



<table class="tftable border-none" style="margin-top:50px; ">
<caption align="left" style="font-size: 16px; margin-top:12px; background-color: #c3c1cf; text-align:left;" ><b>Annexure – 2 		Credit card batch closure</b></caption>
<tr width="200px">
    <th>S. No.</th>
    <th  height="50">Type</th>
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

<tr height="50"  align="center">
    <td colspan="2">Total</td>
    <td >${summaryTotalSale}</td>
    <td >${(summaryTotalAmount ? (Math.floor(summaryTotalAmount * 100) / 100):0)}</td>
</tr>
</table>

<div style="page-break-after: always;">&nbsp;</div>


<h4 style="background-color: #c3c1cf; width: 15%">Annexure – 3 	Explanation</h4>
<div style="font-size:3.5vw; " >
This is an auto generated Daily Sales Report of < Program Name>.   Please do not reply to this email and contact the Program management team for any questions.  Explanations and Definitions are given below.   <br><br>

1.	Member Name – The full name of the Member <br>
2.	Membership Number – A Nine-digit unique number for every membership <br>
3.	Type – New or Renewal Membership. N for New and R for Renewal  <br>
4.	Enrolment Date – The date when the membership was enrolled or renewed <br>
5.	Expiry Date – The date when the membership expires <br>
6.	Payment Mode – The mode of payment through which a member pays the membership amount <br>
7.	Online Transaction No. – A unique transaction number to identify a membership (Not the UTR number) <br>
8.	CC Approval Code – An approval code that appears on the charge slip that gets printed from a credit/debit card charging machine <br>
9.  CC Batch Number – Batch Number that appears on the charge slips that gets printed from a credit/debit card charging machine <br>
10.	Cash Receipt Number – The number that appears on a Cash receipt issued by the hotel/program <br>
11.	Cheque Details – Cheque number, Bank Name and Deposit Date  <br>
12.	Amount – Net Amount without Tax  <br>
13.	Tax – Goods and Services Tax  <br>
14.	Total Amount – The amount that the member has paid <br>
15.	GSTIN – The GST number that the member has provided  <br>
16.	State Code – Two-digit code that appears before the PAN number in a GSTIN provided <br>
17.	Remarks – Comments entered by the person enrolling a membership in the TLC CRM  <br>
18.	Certificate Number – The number printed on the back of a physical voucher or on a digital certificate.  This can be used by the Audit teams to reconcile any used certificate. <br> <br>

Disclaimer <br><br>

While we have taken every precaution to ensure that the data presented here is accurate, errors and omissions may occur.  TLC is not responsible for any errors or omissions, or for the results obtained from the use of this information. This information has no guarantee of completeness, accuracy, timeliness or of the results obtained from the use of this information..."

<div>





 <!--
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
    -->
    </div>
    <div class="arilFont" id="pageFooter" style="font-size: 13px; height:500px; bottom:100px;" ><p><b>
     This is an auto generated report by TLC Relationship Management Private Limited (TLC), (<a href="www.tlcgroup.com">www.tlcgroup.com</a>) and does not require a signature</b></p>
    <p align="left"> MARRIOTT CONFIDENTIAL & PROPRIETARY INFORMATION </p>
    <p>The contents of the document are confidential and proprietary to Marriott International, Inc. and may not be reproduced, disclosed, distributed or used without the express permission of an authorised representative of Marriott. Any other use is expressly prohibited</p>
    </div>
    
  </body>

  </html>
`


let pdfName = `./reports/DSRReport/DSR_Repoprt_${propertyId}_${Date.now()}.pdf`
const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in","footer":{"height":"42mm","padding":"0 20px 0 20px"}, filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateDSRPDF
}
