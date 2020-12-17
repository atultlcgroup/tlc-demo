

let xl = require('excel4node');



let formatDate1=(date)=>{
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return (`${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()} ${strTime}`);
}


let today = new Date();
today.setDate(today.getDate() - 1); 
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let generateExcel = async(resultArr,hotelName,summaryName,propertyId)=>{
//date format 



  // Create a new instance of a Workbook class



let wb = new xl.Workbook();
 
// Add Worksheets to the workbook
// let ws = wb.addWorksheet('tlc collects money');
let ws2 = wb.addWorksheet(`${summaryName}`);
// let ws3 = wb.addWorksheet('Consolidated Reprot to TLC');
 //Sheet 1
let sheet1HeaderArr= ['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','State','Payment Mode','(A) Net_Amount__c','(B) GST Amount','C=(A)+(B)Total Amount']
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


  let sheet2HeaderArr=['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','Member GST Details','Email','Address','City','State','Pin code','Country','Payment Mode','Membership Fee','(A) Membership Amount','(B) GST Amount','C=(A)+(B)Total Amount']
  let sheet2FooterArr=['Total','','','','','','','','','','','','','','','','0','0','0','','','0']

  // ws2.cell(1, 1).string(`Hotel collects the money on Payment Gateway`).style(style);
  ws2.cell(1, 1).string(`${summaryName}`).style(style);
   let membershipName = (resultArr.length && resultArr[0].membership_type_name) ? resultArr[0].membership_type_name : ''
    let schemeCode = (resultArr.length && resultArr[0].scheme_code) ? resultArr[0].scheme_code : ''

   ws2.cell(4, 1).string(`Level Name`).style(style);
  ws2.cell(4, 2).string(`${membershipName}`).style(style);

  ws2.cell(6, 1).string(`Transaction Date`).style(style);
  ws2.cell(6, 2).string(`${today}`).style(style);

  ws2.cell(5, 1).string(`Scheme`).style(style);
  ws2.cell(5, 2).string(`${schemeCode}`).style(style);
   index= 1
  
  sheet2HeaderArr.map(d=>{
    if(index == 19){
    ws2.cell(8, index++,8, 1 +  index++, true).string(d).style(style);
    index++
    ws2.cell(9, index-3).string('CGST').style(style);
    ws2.cell(9, index-2).string('SGST').style(style);
    ws2.cell(9, index-1).string('IGST').style(style);
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
      ws2.cell(cell, index++).number(i+1).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].membership__r__membership_number__c ? resultArr[i].membership__r__membership_number__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].firstname ? resultArr[i].firstname : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].lastname ? resultArr[i].lastname : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].membership_type_name ? resultArr[i].membership_type_name : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].freshrenewal ? resultArr[i].freshrenewal : '')}`).style(style);
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
      ws2.cell(cell, index++).string(`${dateTime}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].transcationcode__c ? resultArr[i].transcationcode__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].gst_details__c ? resultArr[i].gst_details__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].email__c ? resultArr[i].email__c : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].billingstreet ? resultArr[i].billingstreet : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].billingcity ? resultArr[i].billingcity : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].billingstate ? resultArr[i].billingstate : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].billingpostalcode ? resultArr[i].billingpostalcode : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].billingcountry ? resultArr[i].billingcountry : '')}`).style(style);
      ws2.cell(cell, index++).string(`${(resultArr[i].payment_mode__c ? resultArr[i].payment_mode__c : '')}`).style(style);
      ws2.cell(cell, index++).number(Math.round((resultArr[i].membership_fee ? resultArr[i].membership_fee : 0) * 100) / 100).style(style);
      ws2.cell(cell, index++).number(Math.round((resultArr[i].membership_amount ? resultArr[i].membership_amount : 0) * 100) / 100).style(style);

     total +=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0);
     totalFee += (resultArr[i].membership_fee ? resultArr[i].membership_fee : 0);
     feeTotal+=(resultArr[i].membership_amount ? resultArr[i].membership_amount : 0)
     let CGST = resultArr[i].CGST ? resultArr[i].CGST : '--'
     let SGST = resultArr[i].SGST ? resultArr[i].SGST : '--'
     let IGST = resultArr[i].IGST ? resultArr[i].IGST : '--'
     
     resultArr[i].CGST ? ws2.cell(cell, index++).number(Math.round(CGST * 100) / 100).style(style) : ws2.cell(cell, index++).string(`--`).style(style)
      total+=resultArr[i].CGST
      gstTotal+=resultArr[i].CGST
      resultArr[i].SGST ? ws2.cell(cell, index++).number(Math.round(SGST * 100) / 100).style(style): ws2.cell(cell, index++).string(`--`).style(style)
      total+=resultArr[i].SGST
      gstTotal+=resultArr[i].SGST
      resultArr[i].IGST ? ws2.cell(cell, index++).number(Math.round(IGST * 100) / 100).style(style):ws2.cell(cell, index++).string(`--`).style(style)
      total+=resultArr[i].IGST
      gstTotal+=resultArr[i].IGST
      ws2.cell(cell, index++).number(Math.round((resultArr[i].membership_total_amount ? resultArr[i].membership_total_amount : 0) * 100) / 100).style(style);
      totalAmount +=(resultArr[i].membership_total_amount ? resultArr[i].membership_total_amount : 0)
    }



  cell++;
  index = 1;
  // totalAmount = feeTotal + gstTotal;
  sheet2FooterArr.map(f=>{
    if(index == 17)
    ws2.cell(cell, index++).number(Math.round(totalFee * 100) / 100).style(style);
      else if(index == 18)
    ws2.cell(cell, index++).number(Math.round(feeTotal * 100) / 100).style(style);
    else if(index == 19)
    ws2.cell(cell, index++,cell,1+index,true).number(Math.round(gstTotal * 100) / 100).style(style);
    else if(index == 22)
    ws2.cell(cell, index++).number(Math.round(totalAmount * 100) / 100).style(style);
    else
    ws2.cell(cell, index++).string(f).style(style);


  })
cell++;

cell+=4;
index = 1;
ws2.cell(cell, index++).string('Refund / Cancellations').style(style);
let fileName = `./reports/paymentReport/Payment_Report_${propertyId}_${Date.now()}.xlsx`
const buffer = await wb.writeToBuffer();
 
await wb.write(`${fileName}`);
return new Promise(async(resolve,reject)=>{
  try{
    await setTimeout(async()=>{
      resolve(`${fileName}`)
     },1000)
  }catch(e){
    reject(`${e}`)
  }
})
}
  // Set value of cell A3 to true as a boolean type styled with paramaters of style but with an adjustment to the font size.
//  ws.write(`Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`);


module.exports={
    generateExcel
}