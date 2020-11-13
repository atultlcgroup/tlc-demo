let xl = require('excel4node');



// let formatDate1=(date)=>{
//   var hours = date.getHours();
//   var minutes = date.getMinutes();
//   var ampm = hours >= 12 ? 'pm' : 'am';
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   minutes = minutes < 10 ? '0'+minutes : minutes;
//   var strTime = hours + ':' + minutes + ' ' + ampm;
//   return (`${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()} ${strTime}`);
// }


let today = new Date();
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let generateExcel = async(resultArr,summaryName)=>{
    console.log(`-----------------------------------------------------`)
    console.log(resultArr)
    console.log(summaryName)
//date format 

// resultArr=[
//     {firstName:"Shubham",lastName:"Thute",membershipType:"JW aerocity level 1",email:"shubham.thute@tlcgroup.com", 
//     state:"Delhi", freshOrRenew:"Fresh", bankId:"ABCD12345",bankName:"SBI",transactionCode:"12121415",tsplTransactionId:"abcd7654",
//     smTransactionId:"12345678",bankTransactionId:"SBI0001234",memberGSTDetails:"GSTIN00017",paymentMode:"Online",membershipFee:"5000",
//     membershipAmount_A:"900",totalAmount:"5900",GSTAmount:"2000",cgst:"1500",sgst:"1500",igst:"1500",charges:"1000",netAmount:"9000",transactionDate:"12/1/2020",
//     transactionTime:"12:40",paymentDate:"18/09/1994",SRC_ITC:"abcde",scheme:"XYZ",schemeamount:"10000"
// },
// {firstName:"Shubham",lastName:"Thute",membershipType:"JW aerocity level 1",email:"shubham.thute@tlcgroup.com", 
//     state:"Delhi", freshOrRenew:"Fresh", bankId:"ABCD12345",bankName:"SBI",transactionCode:"12121415",tsplTransactionId:"abcd7654",
//     smTransactionId:"12345678",bankTransactionId:"SBI0001234",memberGSTDetails:"GSTIN00017",paymentMode:"Online",membershipFee:"5000",
//     membershipAmount_A:"900",totalAmount:"5900",GSTAmount:"2000",cgst:"1500",sgst:"1500",igst:"1500",charges:"1000",netAmount:"9000",transactionDate:"12/1/2020",
//     transactionTime:"12:40",paymentDate:"18/09/1994",SRC_ITC:"abcde",scheme:"XYZ",schemeamount:"10000"
// }

// ]

  // Create a new instance of a Workbook class



let wb = new xl.Workbook();
 
// Add Worksheets to the workbook
// let ws = wb.addWorksheet('tlc collects money');
let ws2 = wb.addWorksheet(`${summaryName}`);
// let ws3 = wb.addWorksheet('Consolidated Reprot to TLC');
 //Sheet 1
let sheet1HeaderArr= ['First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','State','Payment Mode','(A) Net_Amount__c','(B) GST Amount','C=(A)+(B)Total Amount']
let sheet1FooterArr= ['Total','','','','','','','','','','0','0','0']
// Create a reusable style
let style = wb.createStyle({
  font: {
    color: '#000000',
    size: 12,
  },
  // numberFormat: '$#,##0.00; ($#,##0.00); -',
});
 
// Set value of cell A1 to 100 as a number type styled with paramaters of style
// ws.cell(1, 1)
//   .string('TLC collects the money on Payment Gateway on behalf of Hotels')
//   .style(style);

//   ws.cell(3, 1)
//   .string('Scheme')
//   .style(style);
 
// // Set value of cell B1 to 200 as a number type styled with paramaters of style
// ws.cell(4, 1)
//   .string('Club Marriott')
//   .style(style);
//   let index= 1
//   sheet1HeaderArr.map(d=>{
//     ws.cell(6, index++)
//   .string(d)
//   .style(style);
//   })
//    let cell=6;
//   for(let i =0;i<6;i++){
//     cell +=1
//     index = 1;
//        for(let j =0;j<sheet1HeaderArr.length;j++){
//          if(j==0){
//          ws.cell(cell, index++).number(i+1).style(style);
//          }
//          else{
//          ws.cell(cell, index++).string('').style(style);
//          }
//        }
//   }
//   cell++;
//   index = 1;
//   sheet1FooterArr.map(f=>{
//     ws.cell(cell, index++)
//   .string(f)
//   .style(style);
//   })
// cell++;

// cell+=4;
// index = 1;
// ws.cell(cell, index++).string('Refund / Cancellations').style(style);








  //Sheet 2


  let sheet2HeaderArr=['S.N','First Name','Last Name','Membership Type','Email','State','Fresh / Renewal','Bank Id','Bank Name','TPSL Transaction Id','SM Transaction Id','Bank Transaction Id','Member GST Details','Payment Mode','Membership Fee','Membership Amount(A)','Total Amount','GST Aomunt','Charges','Net Amount','Transaction Date','Transaction Time','Payment Date','SRC ITC','Scheme','Schemeamount']
  let sheet2FooterArr=['Total','','','','','','','','','','','','','','','','0','0','0','','','0']

  // ws2.cell(1, 1).string(`Hotel collects the money on Payment Gateway`).style(style);
  ws2.cell(1, 1).string(`${summaryName}`).style(style);
   let membershipName = (resultArr.length && resultArr[0].property_name) ? resultArr[0].property_name : (resultArr.length && resultArr[0].membership_type_name ? resultArr.length && resultArr[0].membership_type_name : '') 
    let schemeCode = (resultArr.length && resultArr[0].scheme_code) ? resultArr[0].scheme_code : ''
    let transaactionDate = (resultArr.length && resultArr[0]['Transaction Date']) ? resultArr[0]['Transaction Date'] : today

   ws2.cell(4, 1).string(`Hotel Name`).style(style);
  ws2.cell(4, 2).string(`${membershipName}`).style(style);

  ws2.cell(6, 1).string(`Transaction Date`).style(style);
  ws2.cell(6, 2).string(`${transaactionDate}`).style(style);

  ws2.cell(5, 1).string(`Scheme`).style(style);
  ws2.cell(5, 2).string(`${schemeCode}`).style(style);
   index= 1
  
  sheet2HeaderArr.map(d=>{
    if(index == 18){
    ws2.cell(7, index++,7, 1 +  index++, true).string(d).style(style);
    index++
    ws2.cell(8, index-3).string('CGST').style(style);
    ws2.cell(8, index-2).string('SGST').style(style);
    ws2.cell(8, index-1).string('IGST').style(style);
  }
    else
    ws2.cell(8, index,9,index++,true).string(d).style(style);
  })

    cell=9;
    let feeTotal=0;
    let gstTotal = 0;
    let totalAmount =0;
    let totalFee =0;
    
  for(let i =0;i<resultArr.length;i++){
    cell +=1
    let total=0;
    index = 1;
   //    {firstName:"Shubham",lastName:"Thute",membershipType:"JW aerocity level 1",email:"shubham.thute@tlcgroup.com", state:"Delhi", freshOrRenew:"Fresh",
  
      ws2.cell(cell, index++).number(i+1).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].firstname ? resultArr[i].firstname : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].lastname ? resultArr[i].lastname : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].membership_type_name ? resultArr[i].membership_type_name : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].email__c ? resultArr[i].email__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].state__c ? resultArr[i].state__c : '')}`).style(style);
      let date1 = resultArr[i].createddate ? resultArr[i].createddate : '';
      let dateTime = ``;
      if(date1){
          console.log("date1",date1)
        let today1 = new Date(date1);
        let hours1 = today1.getHours();
        let minutes = today1.getMinutes();
        let ampm = hours1 >= 12 ? 'pm' : 'am';
        hours1 = hours1 % 12;
        hours1 = hours1 ? hours1 : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours1 + ':' + minutes + ' ' + ampm;
        dateTime = `${String(today1.getDate()).padStart(2, '0')} ${today1.toLocaleString('default', { month: 'short' })} ${today1.getFullYear()} ${strTime}`
      }
       // bankId:"ABCD12345",bankName:"SBI",transactionCode:"12121415",tsplTransactionId:"abcd7654",
   //smTransactionId:"12345678",bankTransactionId:"SBI0001234",memberGSTDetails:"GSTIN00017",
   //paymentMode:"Online",membershipFee:"5000",membershipAmount_A:"900"},
 //membershipAmount_A:"900",totalAmount:"5900",GSTAmount:"2000",charges:"1000",netAmount:"9000",transactionDate:"12/1/2020"

      ws2.cell(cell, index++).string(`${(resultArr[i].freshrenewal ? resultArr[i].freshrenewal : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i]['Bank Id'] ? resultArr[i]['Bank Id'] : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i]['Bank Name'] ? resultArr[i]['Bank Name'] : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i]['TPSL Transaction Id'] ? resultArr[i]['TPSL Transaction Id'] : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i]['SM Transaction Id'] ? resultArr[i]['SM Transaction Id'] : '')}`).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i]['Bank Transaction Id'] ? resultArr[i]['Bank Transaction Id'] : '')).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].gst_details__c ? resultArr[i].gst_details__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].membership_fee ? resultArr[i].membership_fee : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].membership_total_amount ? resultArr[i].membership_total_amount : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].CGST ? resultArr[i].CGST : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].SGST ? resultArr[i].SGST : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].IGST ? resultArr[i].IGST : 0)).style(style);
      console.log(parseFloat(resultArr[i].Charges ? resultArr[i].Charges : 0))
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].Charges ? resultArr[i].Charges : 0)).style(style);
      ws2.cell(cell, index++).number(parseFloat(resultArr[i]['Net Amount'] ? resultArr[i]['Net Amount'] : 0)).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i]['Transaction Date'] ? resultArr[i]['Transaction Date'] : '')}`).style(style); 
      ws2.cell(cell, index++).string(`${(resultArr[i]['Transaction Time'] ? resultArr[i]['Transaction Time'] : '')}`).style(style);    
      ws2.cell(cell, index++).string(`${(resultArr[i]['Payment Date'] ? resultArr[i]['Payment Date'] : '')}`).style(style); 
      ws2.cell(cell, index++).string(`${(resultArr[i]['SRC ITC'] ? resultArr[i]['SRC ITC'] : '')}`).style(style);  
      ws2.cell(cell, index++).string(`${(resultArr[i].Scheme ? resultArr[i].Scheme : '')}`).style(style);     
     total +=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0);
     totalFee += (resultArr[i].membership_fee ? resultArr[i].membership_fee : 0);
     feeTotal+=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0)
     let CGST = resultArr[i].CGST ? resultArr[i].CGST : '--'
     let SGST = resultArr[i].SGST ? resultArr[i].SGST : '--'
     let IGST = resultArr[i].IGST ? resultArr[i].IGST : '--'
     
      ws2.cell(cell, index++).number(parseFloat(resultArr[i].Schemeamount ? resultArr[i].Schemeamount : '')).style(style);
      total+=resultArr[i].CGST
      gstTotal+=resultArr[i].CGST
     
    }
     
 
  cell++;
  index = 1;
  // totalAmount = feeTotal + gstTotal;
//   sheet2FooterArr.map(f=>{
//     if(index == 17)
//     ws2.cell(cell, index++).string(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
//       else if(index == 18)
//     ws2.cell(cell, index++).strin(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
//     else if(index == 19)
//     ws2.cell(cell, index++,cell,1+index,true).string(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
//     else if(index == 22)
//     ws2.cell(cell, index++).string(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
//     else
//     ws2.cell(cell, index++).string(f).style(style);


//   })
// cell++;

cell+=4;
index = 1;
ws2.cell(cell, index++).string('Refund / Cancellations').style(style);
let pcid = resultArr[0].property_id ? resultArr[0].property_id : resultArr[0].membership_type_id
let fileName = `./reports/UTReport/UTR_Report_${resultArr[0].pcid }_${Date.now()}.xlsx`
const buffer = await wb.writeToBuffer();
 
await wb.write(`${fileName}`);
return new Promise(async(resolve,reject)=>{
  try{
    await resolve(`${fileName}`)
     
  }catch(e){
      console.log(e)
    reject(`${e}`)
  }
})
}
  // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
//  ws.write(`Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`);


// generateExcel().then(data=>{
//     console.log("data");
// }).catch(e=>{
//     console.log(e);
// })

module.exports={
    generateExcel
}