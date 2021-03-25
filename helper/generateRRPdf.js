const Promise = require('bluebird');

let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let convertDateFormatForPDF = (date1) => {
    if (date1) {
        let today1 = new Date(date1);
        let hours1 = date1.getHours();
        let minutes = date1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(days[today1.getDay()] || '')} ${String(today1.getDate()).padStart(2, '0')}/${today1.getMonth() +1}/${today1.getFullYear()} ${strTime}`
    }
    console.log("dateTime----",dateTime);
    return dateTime
}
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


let  generateRRPDF=async(resultArr , dynamicValues)=>{
    let pyamnetObj={}
    let summaryTotalSale =0
    let summaryTotalAmount=0
 //propertyName = `${rrValues[0].property_name}`;
 let summaryData = [{key:'Spouse Complimentary',amount:0, noOfSale:0 },{key:'Credit Card',amount:0, noOfSale:0 },{key:'Hotel Transfer',amount:0, noOfSale:0 },{key:'Cash',amount:0, noOfSale:0 },{key:'Online',amount:0, noOfSale:0 }]
console.log("FR values are");


//   rrValues = [
// {Record:"00001212",AccountName:"shubham thute", reservationStatus:"Close Cheque", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001211",AccountName:"shubham thute", reservationStatus:"Close Cheque", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001212",AccountName:"shubham thute", reservationStatus:"Awaiting Confirmation", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001213",AccountName:"shubham thute", reservationStatus:"Close Cheque", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001214",AccountName:"shubham thute", reservationStatus:"Awaiting Confirmation", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001215",AccountName:"shubham thute", reservationStatus:"Awaiting Confirmation", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"},
// {Record:"00001216",AccountName:"shubham thute", reservationStatus:"Cancelled", memershipType:"30% off on F&B", outlet:"K3",membership:"101033827",reservationDateTime:"9/1/2020 4:30 am",numberOfGuest:2,numberOfAdults:3,numberOfKids:2,celebrationType:"Birthday",celebrationRemark:"Birthday celebration",specialRequest:"flowers"}

// ]

let headerForPage = `
</table>
<table class="page-break tftable1" align="center" border="1" >
<tr height="60px"></tr>
<tr height="50" style="background-color:#C4B67E; color:white;">
<th width="2%">S.N.</th>
                  <th width="7%" >Member Name</th>
                  <th width="5%">Reservation Status</th>
                  <th width="3%">Membership Offer</th>
                  <th width="5%">Outlet</th>
                  <th width="3%">Membership Number</th>
                  <th width="5%">Reservation <br>Date and Time</th>
                  <th width="3%">Number<br> of Guest</th>
                  <th width="5%">Number<br> of Adults</th>
                  <th width="5%">Number<br> of Kids</th>
                  <th width="5%">Celebration<br> Type</th>
                  <th width="5%">Celebration<br> Remark</th>    
                  <th width="5%">Special Request</th>  
</tr>
`

let salesCount = 0, salesAmount = 0, salesTax = 0, salesTotalAmount = 0;
let slNo =1;
let indexForPage = 0;
let dailySalesReportRows =``;
for(obj of resultArr){
dailySalesReportRows += ``

if(slNo % 2== 0)
dailySalesReportRows += `<tr align="center"  height="50" background-color: #E3E3E3;><td>${slNo++}</td>`;
else
dailySalesReportRows += `<tr align="center"  height="50" background-color: #F2F2F2;><td>${slNo++}</td>`;


dailySalesReportRows+=`   <td align="center">${getEmptyIfNull(obj.member_name)}</td>
                    <td align="center">${getEmptyIfNull(obj.reservation_status__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.customer_set_name)}</td>
                    <td align="center">${getEmptyIfNull(obj.outlet_name)}</td>
                    <td align="center">${getEmptyIfNull(obj.membership_number__c)}</td>
                    <td align="center">${(getEmptyIfNull(obj.r_date_time) ? convertDateFormat(new Date(obj.r_date_time)) : '')}</td>
                    <td align="center">${getEmptyIfNull(obj.number_of_guests__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.number_of_adults__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.number_of_kids__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.celebration_type__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.celebration_remark__c)}</td>
                    <td align="center">${getEmptyIfNull(obj.specialrequest__c)}</td>
                    </tr>
                    `

                    indexForPage++;
                    if(indexForPage %8 == 0 && indexForPage != 0 && resultArr[indexForPage]){
                        dailySalesReportRows+=`${headerForPage}`
                    }
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
              font-size: 8px;
              color: #333333;
              width: 35%;
              border: 1px solid black;
              border-collapse: collapse;
          }
          .tftable th {
              font-size: 8px;
              background-color: #C4B67E;
              border: 1px solid black;
              padding: 6px;
              text-align: center;
          }

          .tftable td {
              font-size: 8px;
              border: 1px solid black;
              padding: 6px;
          }
          .tftable tr:hover {
              background-color: #ffffff;
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
            background-color: #C4B67E;
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
          .tftable tr:nth-child(even) {background-color: #E3E3E3;}
          .tftable tr:nth-child(odd) {background-color: #F2F2F2;}
  
          .tftable1 tr:nth-child(even) {background-color: #E3E3E3;}
          .tftable1 tr:nth-child(odd) {background-color: #F2F2F2;}
      </style>
  </head>
  

  <body style="font-family:sans-serif;" >
  <div>
      <table style="width: 100%; font-size: 11px; background-color: #C4B67E; padding: 4px; margin-bottom: 4px; color:white;">
      <tbody>
          <tr >
          <td align="left" style="font-size: 14px;color: #808000;  width: 30%"><img src='${dynamicValues[0].tlc_logo__c}' alt=""  height=60 width=80></img></td>
              <td align="center" style="font-size: 14px; width: 30%; color:black;">Daily Sales Report-${resultArr[0].program_name}</td>
              <td align="right"style="font-size: 14px; width: 30%; color:black;"> ${resultArr[0].h_name} </td>
          </tr>
      </tbody>
  </table>
  <table style="width: 100%; font-size: 10px; background-color: white; padding: 0; margin-bottom: 0px; color:white;">
  <tr>
      
      <td style="text-align: left; color:black">
      ${convertDateFormatForPDF(new Date())}
      </td>
  </tr>
</table>
     
          <table class="tftable1" align="center" border="1"  height="50">
          <tr height="50" style="background-color:#C4B67E; color:white;">
          <th width="2%">S.N.</th>
                  <th width="7%" >Member Name</th>
                  <th width="5%">Reservation Status</th>
                  <th width="3%">Membership Offer</th>
                  <th width="5%">Outlet</th>
                  <th width="3%">Membership Number</th>
                  <th width="5%">Reservation <br>Date and Time</th>
                  <th width="3%">Number<br> of Guest</th>
                  <th width="5%">Number<br> of Adults</th>
                  <th width="5%">Number<br> of Kids</th>
                  <th width="5%">Celebration<br> Type</th>
                  <th width="5%">Celebration<br> Remark</th>    
                  <th width="5%">Special Request</th>  


              </tr>

              
                 ${dailySalesReportRows}

          </table>
      
    </div>
    <div class="arilFont" id="pageFooter" style="font-size: 8px; height:500px; bottom:100px;" ><p><b>
    This is an auto generated report by TLC Relationship Management Private Limited (TLC), (<a href="www.tlcgroup.com">www.tlcgroup.com</a>) and does not require a signature</b></p>
   <p align="left"> ${dynamicValues[0].page_footer_1_rr__c} </p>
   <p>${dynamicValues[0].page_footer_2_rr__c}</p>
   </div>
  </body>

  </html>
`
let pdfName = `./reports/RReport/R_Repoprt_${resultArr[0].property_id}_${Date.now()}.pdf`

const pdf = Promise.promisifyAll(require('html-pdf'));
    let data = await pdf.createAsync(`${htmlStr}`, { "height": "10.5in","width": "14.5in", filename: `${pdfName}` })
    return pdfName
}

module.exports={
    generateRRPDF
}