
const { resolve, reject } = require('bluebird');
let xl = require('excel4node');
let today = new Date();
today = `${String(today.getDate()).padStart(2, '0')} ${today.toLocaleString('default', { month: 'short' })} ${today.getFullYear()}`;
let generateExcel = async()=>{
// Create a new instance of a Workbook class

let wb = new xl.Workbook();
 
// Add Worksheets to the workbook
// let ws = wb.addWorksheet('tlc collects money');
let ws2 = wb.addWorksheet('hotel collects money');
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


  let sheet2HeaderArr=['SL No','Membership Number','First Name','Last Name','MembershipType','Fresh / Renewal','Transaction Time','TranscationCode','Member GST Details','Email','Address','City','State','Pin code','Country','Payment Mode','(A) Membership Fee','(B) GST Amount','C=(A)+(B)Total Amount']
  let sheet2FooterArr=['Total','','','','','','','','','','','','','','','','0','0','0','0','0']

  ws2.cell(1, 1).string('Hotel collects the money on Payment Gateway').style(style);

  ws2.cell(4, 1).string('JW Marriott Hotel Pune').style(style);
  ws2.cell(5, 1).string(`${today}`).style(style);
  ws2.cell(6, 1).string(`Scheme`).style(style);

   index= 1
  sheet2HeaderArr.map(d=>{
    if(index == 18)
    ws2.cell(8, index++,8, index++,8, index++, true).string(d).style(style);
    else
    ws2.cell(8, index++).string(d).style(style);
    
  })
    cell=8;
  for(let i =0;i<6;i++){
    cell +=1
    index = 1;
       for(let j =0;j<sheet2FooterArr.length;j++){
         if(j==0){
         ws2.cell(cell, index++).number(i+1).style(style);
         }
         else{
           let str = ``;
         ws2.cell(cell, index++).string(`${str}`).style(style);
         }
       }
  }
  cell++;
  index = 1;
  sheet2FooterArr.map(f=>{
    ws2.cell(cell, index++)
  .string(f)
  .style(style);
  })
cell++;

cell+=4;
index = 1;
ws2.cell(cell, index++).string('Refund / Cancellations').style(style);
let fileName = `./paymentReport/Payment_Report_${require('dateformat')(new Date(), "yyyymmddhMMss")}.xlsx`
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